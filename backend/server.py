import grpc
from concurrent import futures
import point_pb2
import point_pb2_grpc
import random
import time
from grpc_reflection.v1alpha import reflection

class PointService(point_pb2_grpc.PointServiceServicer):
    def GetPointStream(self, request, context):
        while True:
            x_random = random.uniform(-10, 10)
            y_random = random.uniform(-10, 10)
            z_random = random.uniform(-10, 10)
            roll_random  = random.uniform(0, 360)
            pitch_random = random.uniform(0, 360)
            yaw_random = random.uniform(0, 360)
            point = point_pb2.Point(x=x_random, y=y_random, z=z_random, roll=roll_random, pitch=pitch_random, yaw=yaw_random)
            yield point
            time.sleep(1) 

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    point_pb2_grpc.add_PointServiceServicer_to_server(PointService(), server)

    SERVICE_NAMES = (
        point_pb2.DESCRIPTOR.services_by_name['PointService'].full_name,
        reflection.SERVICE_NAME,
    )
    reflection.enable_server_reflection(SERVICE_NAMES, server)

    server.add_insecure_port('[::]:50051')
    server.start()
    print("Server running on port 50051 with reflection enabled...")
    server.wait_for_termination()

if __name__ == '__main__':
    serve()
