// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var point_pb = require('./point_pb.js');

function serialize_point_pb2_Empty(arg) {
  if (!(arg instanceof point_pb.Empty)) {
    throw new Error('Expected argument of type point_pb2.Empty');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_point_pb2_Empty(buffer_arg) {
  return point_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_point_pb2_Point(arg) {
  if (!(arg instanceof point_pb.Point)) {
    throw new Error('Expected argument of type point_pb2.Point');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_point_pb2_Point(buffer_arg) {
  return point_pb.Point.deserializeBinary(new Uint8Array(buffer_arg));
}


var PointServiceService = exports.PointServiceService = {
  getPoint: {
    path: '/point_pb2.PointService/GetPoint',
    requestStream: false,
    responseStream: false,
    requestType: point_pb.Empty,
    responseType: point_pb.Point,
    requestSerialize: serialize_point_pb2_Empty,
    requestDeserialize: deserialize_point_pb2_Empty,
    responseSerialize: serialize_point_pb2_Point,
    responseDeserialize: deserialize_point_pb2_Point,
  },
};

exports.PointServiceClient = grpc.makeGenericClientConstructor(PointServiceService, 'PointService');
