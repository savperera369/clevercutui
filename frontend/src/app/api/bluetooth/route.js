import { credentials } from '@grpc/grpc-js';
import { BluetoothServiceClient } from '../../../../point_grpc_pb';
import { BluetoothRequest } from '../../../../point_pb';

const client = new BluetoothServiceClient('localhost:50051', credentials.createInsecure());

export async function GET(req) {
    const url = new URL(req.url);
    const angle = url.searchParams.get("angle");

    if (!angle || isNaN(Number(angle))) {
        return new Response(JSON.stringify({ error: "Invalid or missing angle parameter" }), {
            headers: { "Content-Type": "application/json" },
            status: 400,
        });
    }

    const bleRequest = new BluetoothRequest();
    bleRequest.setUartString(`SERVO:${angle}`);

    try {
        const response = await new Promise((resolve, reject) => {
            client.connect(bleRequest, (error, resp) => {
                if (error) {
                    return reject(error);
                }
                resolve(resp);
            });
        });

        const jsonResponse = { status: (response).getStatus() };
        return new Response(JSON.stringify(jsonResponse), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            headers: { "Content-Type": "application/json" },
            status: 500,
        });
    }
}