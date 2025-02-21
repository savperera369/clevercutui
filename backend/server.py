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
