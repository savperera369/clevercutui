import asyncio
import grpc
from concurrent import futures
import random
import time
import threading
from grpc_reflection.v1alpha import reflection
import serial
import point_pb2
import point_pb2_grpc

# Serial Port Configuration
POSITION_SERIAL_PORT = "COM7"
ORIENTATION_SERIAL_PORT = "COM4"
DEFAULT_BAUDRATE = 115200

# Serial Port Objects
position_serial = None
orientation_serial = None

# Shared structured data with thread-safe lock
shared_data = {
    "orientation": {
        "quaternion": [],
        "acceleration": [],
        "distance_to_roof": None
    },
    "position": {
        "anchors": {}
    }
}
data_lock = threading.Lock()

# ------------------ PARSERS ------------------ #

def parse_orientation_line(line):
    try:
        parts = line.split(',')
        if len(parts) < 9:
            return None
        q = list(map(float, parts[0:4]))
        acc = list(map(float, parts[4:7]))
        distance_to_roof = float(parts[7])  # ignore the 9th value
        return {
            "quaternion": q,
            "acceleration": acc,
            "distance_to_roof": distance_to_roof
        }
    except Exception as e:
        print(f"Failed to parse orientation: {e}")
        return None

def parse_position_line(line):
    if "Anchor" in line and ':' in line:
        try:
            parts = line.split(':')
            anchor_id = parts[0].split('0x')[-1].strip()
            distance_cm = float(parts[1].replace('cm', '').strip())
            return anchor_id, distance_cm
        except Exception as e:
            print(f"Failed to parse position: {e}")
    return None, None

# ------------------ SERIAL HANDLING ------------------ #

def connect_to_serial_port(serial_port, baudrate=DEFAULT_BAUDRATE):
    try:
        print(f"Connecting to serial port {serial_port}...")
        ser = serial.Serial(serial_port, baudrate, timeout=1)
        print(f"Connected to {serial_port} with baudrate {baudrate}")
        return ser
    except Exception as e:
        print(f"Failed to connect to serial port {serial_port}: {e}")
        return None

def read_serial_data(name, ser):
    while True:
        if ser and ser.is_open:
            try:
                line = ser.readline().decode('utf-8').strip()
                if name == "orientation":
                    parsed = parse_orientation_line(line)
                    if parsed:
                        with data_lock:
                            shared_data["orientation"] = parsed
                elif name == "position":
                    anchor_id, dist = parse_position_line(line)
                    if anchor_id and dist is not None:
                        with data_lock:
                            shared_data["position"]["anchors"][anchor_id] = dist
            except Exception as e:
                print(f"Error reading from {name}: {e}")
        time.sleep(0.05)

# ------------------ BLUETOOTH COMMAND ------------------ #

def send_command(command):
    global orientation_serial
    if not orientation_serial or not orientation_serial.is_open:
        print("Not connected to serial port")
        return False
    if not command.endswith('\n'):
        command += '\n'
    orientation_serial.write(command.encode('utf-8'))
    print(f"Sent command: {command.strip()}")
    return True

def send(uart_command):
    result = send_command(uart_command)
    return "Command sent successfully" if result else "Failed to connect to serial port"

# ------------------ gRPC SERVICES ------------------ #

class PointService(point_pb2_grpc.PointServiceServicer):
    def GetPointStream(self, request, context):
        while True:
            # with data_lock:
            #     orientation = shared_data.get("orientation", {})
            #     anchors = shared_data.get("position", {}).get("anchors", {})

            # x = anchors.get("1", 0.0)
            # y = anchors.get("2", 0.0)
            # z = anchors.get("3", 0.0)
            # yaw = anchors.get("4", 0.0)  # or use orientation-derived yaw if needed
            # roll = orientation.get("quaternion", [0.0]*4)[0]
            # pitch = orientation.get("quaternion", [0.0]*4)[1]

            point_set = set()
            x_random = random.uniform(-10, 10)
            y_random = random.uniform(-10, 10)
            z_random = random.uniform(-10, 10)
            roll_random  = random.uniform(0, 360)
            pitch_random = random.uniform(0, 360)
            yaw_random = random.uniform(0, 360)
            if (x_random, y_random, z_random) in point_set:
                continue
            else:
                point_set.add((x_random, y_random, z_random))

            point = point_pb2.Point(
                x=x_random,
                y=y_random,
                z=z_random,
                roll=roll_random,
                pitch=pitch_random,
                yaw=yaw_random
            )
            yield point
            time.sleep(0.1)

class BluetoothService(point_pb2_grpc.BluetoothServiceServicer):
    def Connect(self, request, context):
        uart_command = request.uart_string
        print(f"Received BLE command: {uart_command}")
        status = send(uart_command)
        return point_pb2.BluetoothResponse(status=status)

# ------------------ SERVER BOOTSTRAP ------------------ #

def serve():
    global position_serial, orientation_serial

    orientation_serial = connect_to_serial_port(ORIENTATION_SERIAL_PORT)
    if not orientation_serial:
        print("Exiting: Failed to connect to ORIENTATION port")
        return

    position_serial = connect_to_serial_port(POSITION_SERIAL_PORT)
    if not position_serial:
        print("Exiting: Failed to connect to POSITION port")
        return

    # Start reading threads
    threading.Thread(target=read_serial_data, args=("orientation", orientation_serial), daemon=True).start()
    threading.Thread(target=read_serial_data, args=("position", position_serial), daemon=True).start()

    # gRPC Server Setup
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    point_pb2_grpc.add_PointServiceServicer_to_server(PointService(), server)
    point_pb2_grpc.add_BluetoothServiceServicer_to_server(BluetoothService(), server)

    SERVICE_NAMES = (
        point_pb2.DESCRIPTOR.services_by_name['PointService'].full_name,
        point_pb2.DESCRIPTOR.services_by_name['BluetoothService'].full_name,
        reflection.SERVICE_NAME,
    )
    reflection.enable_server_reflection(SERVICE_NAMES, server)

    server.add_insecure_port('[::]:50051')
    server.start()
    print("Server running on port 50051 with reflection enabled...")
    server.wait_for_termination()

if __name__ == '__main__':
    serve()
