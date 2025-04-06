import asyncio
import grpc
from concurrent import futures
import random
import time
from grpc_reflection.v1alpha import reflection
import serial
import point_pb2
import point_pb2_grpc

POSITION_SERIAL_PORT = "COM7"
ORIENTATION_SERIAL_PORT = "COM4"
DEFAULT_BAUDRATE = 115200  # Set your desired baud rate
position_serial = None
orientation_serial = None

# Asynchronous BLE functions
def connect_to_serial_port(serial_port, baudrate=DEFAULT_BAUDRATE):
    global orientation_serial
    try:
        print(f"Connecting to serial port {serial_port}...")
        orientation_serial = serial.Serial(serial_port, baudrate, timeout=1)
        print(f"Connected to {serial_port} with baudrate {baudrate}")
        return True
    except Exception as e:
        print(f"Failed to connect to serial port {serial_port}: {e}")
        return False

def send_command(command):
    global orientation_serial
    if not orientation_serial or not orientation_serial.is_open:
        print("Not connected to serial port")
        return False

    # Append newline if needed
    if not command.endswith('\n'):
        command += '\n'

    # Send the command via serial
    orientation_serial.write(command.encode('utf-8'))
    print(f"Sent command: {command.strip()}")
    return True

async def send(uart_command):
    result = send_command(uart_command)
    if(result):
        return "Command sent successfully"
    else:
        return "Failed to connect to serial port"


# gRPC Service Implementations

class PointService(point_pb2_grpc.PointServiceServicer):
    def GetPointStream(self, request, context):
        point_set = set()
        while True:
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

def serve():

    connected = connect_to_serial_port(ORIENTATION_SERIAL_PORT)
    if not connected:
        print("Exiting due to failure to connect to serial port.")
        return
    
    connected = connect_to_serial_port(POSITION_SERIAL_PORT)
    if not connected:
        print("Exiting due to failure to connect to serial port.")
        return
 

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
