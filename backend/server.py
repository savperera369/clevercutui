import grpc
from concurrent import futures
import point_pb2
import point_pb2_grpc
import random

class PointService(point_pb2_grpc.PointServiceServicer):
    def GetPoint(self, request, context):
        x_random = random.uniform(-10, 10)
        y_random = random.uniform(-10, 10)
        z_random = random.uniform(-10, 10)
        point = point_pb2.Point(x=x_random, y=y_random, z=z_random)
        return point

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    point_pb2_grpc.add_PointServiceServicer_to_server(PointService(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    print("Server running on port 50051...")
    server.wait_for_termination()

if __name__ == '__main__':
    serve()
