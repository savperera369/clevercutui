# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# NO CHECKED-IN PROTOBUF GENCODE
# source: point.proto
# Protobuf Python Version: 5.29.0
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import runtime_version as _runtime_version
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
_runtime_version.ValidateProtobufRuntimeVersion(
    _runtime_version.Domain.PUBLIC,
    5,
    29,
    0,
    '',
    'point.proto'
)
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x0bpoint.proto\x12\tpoint_pb2\"\x07\n\x05\x45mpty\"R\n\x05Point\x12\t\n\x01x\x18\x01 \x01(\x02\x12\t\n\x01y\x18\x02 \x01(\x02\x12\t\n\x01z\x18\x03 \x01(\x02\x12\x0c\n\x04roll\x18\x04 \x01(\x02\x12\r\n\x05pitch\x18\x05 \x01(\x02\x12\x0b\n\x03yaw\x18\x06 \x01(\x02\"\'\n\x10\x42luetoothRequest\x12\x13\n\x0buart_string\x18\x01 \x01(\t\"#\n\x11\x42luetoothResponse\x12\x0e\n\x06status\x18\x01 \x01(\t2F\n\x0cPointService\x12\x36\n\x0eGetPointStream\x12\x10.point_pb2.Empty\x1a\x10.point_pb2.Point0\x01\x32X\n\x10\x42luetoothService\x12\x44\n\x07\x43onnect\x12\x1b.point_pb2.BluetoothRequest\x1a\x1c.point_pb2.BluetoothResponseb\x06proto3')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'point_pb2', _globals)
if not _descriptor._USE_C_DESCRIPTORS:
  DESCRIPTOR._loaded_options = None
  _globals['_EMPTY']._serialized_start=26
  _globals['_EMPTY']._serialized_end=33
  _globals['_POINT']._serialized_start=35
  _globals['_POINT']._serialized_end=117
  _globals['_BLUETOOTHREQUEST']._serialized_start=119
  _globals['_BLUETOOTHREQUEST']._serialized_end=158
  _globals['_BLUETOOTHRESPONSE']._serialized_start=160
  _globals['_BLUETOOTHRESPONSE']._serialized_end=195
  _globals['_POINTSERVICE']._serialized_start=197
  _globals['_POINTSERVICE']._serialized_end=267
  _globals['_BLUETOOTHSERVICE']._serialized_start=269
  _globals['_BLUETOOTHSERVICE']._serialized_end=357
# @@protoc_insertion_point(module_scope)
