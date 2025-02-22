CleverCUT UI
Important Commands
- Run this in Backend Directory
- python3 -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. point.proto
- python3 server.py runs the server

- Run this in Frontend Directory
- npx grpc_tools_node_protoc   --proto_path=../backend   --js_out=import_style=commonjs,binary:.   --grpc_out=grpc_js:.   --plugin=protoc-gen-grpc=./node_modules/.bin/grpc_tools_node_protoc_plugin   ../backend/point.proto
- npm run dev starts frontend
