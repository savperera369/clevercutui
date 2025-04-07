import asyncio
import grpc
from concurrent import futures
import random
import time
from grpc_reflection.v1alpha import reflection

from bleak import BleakClient, BleakScanner

import point_pb2
import point_pb2_grpc

# BLE Settings and Globals
DEFAULT_DEVICE_NAME = "ESP32_Sensors"
UART_RX_CHAR_UUID = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E"  # Write to ESP32
ble_client = None

# Asynchronous BLE functions
async def connect_to_device(device_name=DEFAULT_DEVICE_NAME):
    global ble_client
    print(f"Looking for {device_name}...")
    device = await BleakScanner.find_device_by_name(device_name)
    if not device:
        print(f"Device not found: {device_name}")
        return False
    print(f"Connecting to {device_name}...")
    ble_client = BleakClient(device)
    await ble_client.connect()
    print("Connected to BLE device")
    return True

async def send_command(command):
    global ble_client
    if not ble_client or not ble_client.is_connected:
        print("Not connected")
        return False

    # Append newline if needed
    if not command.endswith('\n'):
        command += '\n'

    # Send the command via BLE
    await ble_client.write_gatt_char(UART_RX_CHAR_UUID, command.encode('utf-8'))
    print(f"Sent command: {command.strip()}")
    return True

async def ble_connect_and_send(uart_command):
    # Connect to BLE device if not already connected
    if not ble_client or not ble_client.is_connected:
        connected = await connect_to_device()
        if not connected:
            return "Failed to connect to BLE device"
    # Send the command
    result = await send_command(uart_command)
    # Optionally disconnect after sending (or keep connection alive)
    if result:
        await ble_client.disconnect()
        return "Command sent successfully"
    else:
        return "Failed to send command"


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
        # request.uart_string contains the UART command to send
        uart_command = request.uart_string
        print(f"Received BLE command: {uart_command}")
        # Run the async BLE function in this synchronous context
        status = asyncio.run(ble_connect_and_send(uart_command))
        # Return a response message (make sure your proto defines a field like 'status')
        return point_pb2.BluetoothResponse(status=status)

def serve():
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
