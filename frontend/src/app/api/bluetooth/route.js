import { credentials } from '@grpc/grpc-js';
import { BluetoothServiceClient } from '../../../../point_grpc_pb';
import { BluetoothRequest } from '../../../../point_pb';

const client = new BluetoothServiceClient('localhost:50051', credentials.createInsecure());

export async function GET() {
    const bleRequest = new BluetoothRequest();
    bleRequest.setUartString("rotation 90");

    // Wrap the gRPC call in a Promise
    const response = await new Promise((resolve, reject) => {
        client.connect(bleRequest, (error, resp) => {
            if (error) {
                return reject(error);
            }
            resolve(resp);
        });
    });

    const jsonResponse = { status: response.getStatus() };
    return new Response(JSON.stringify(jsonResponse), {
        headers: { "Content-Type": "application/json" },
        status: 200,
    });
}

