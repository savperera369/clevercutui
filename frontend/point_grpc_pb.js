// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var point_pb = require('./point_pb.js');

function serialize_point_pb2_BluetoothRequest(arg) {
  if (!(arg instanceof point_pb.BluetoothRequest)) {
    throw new Error('Expected argument of type point_pb2.BluetoothRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_point_pb2_BluetoothRequest(buffer_arg) {
  return point_pb.BluetoothRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_point_pb2_BluetoothResponse(arg) {
  if (!(arg instanceof point_pb.BluetoothResponse)) {
    throw new Error('Expected argument of type point_pb2.BluetoothResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_point_pb2_BluetoothResponse(buffer_arg) {
  return point_pb.BluetoothResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

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
  getPointStream: {
    path: '/point_pb2.PointService/GetPointStream',
    requestStream: false,
    responseStream: true,
    requestType: point_pb.Empty,
    responseType: point_pb.Point,
    requestSerialize: serialize_point_pb2_Empty,
    requestDeserialize: deserialize_point_pb2_Empty,
    responseSerialize: serialize_point_pb2_Point,
    responseDeserialize: deserialize_point_pb2_Point,
  },
};

exports.PointServiceClient = grpc.makeGenericClientConstructor(PointServiceService, 'PointService');
var BluetoothServiceService = exports.BluetoothServiceService = {
  connect: {
    path: '/point_pb2.BluetoothService/Connect',
    requestStream: false,
    responseStream: false,
    requestType: point_pb.BluetoothRequest,
    responseType: point_pb.BluetoothResponse,
    requestSerialize: serialize_point_pb2_BluetoothRequest,
    requestDeserialize: deserialize_point_pb2_BluetoothRequest,
    responseSerialize: serialize_point_pb2_BluetoothResponse,
    responseDeserialize: deserialize_point_pb2_BluetoothResponse,
  },
};

exports.BluetoothServiceClient = grpc.makeGenericClientConstructor(BluetoothServiceService, 'BluetoothService');
