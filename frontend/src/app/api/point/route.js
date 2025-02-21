import { credentials } from '@grpc/grpc-js';
import { PointServiceClient } from '../../../../point_grpc_pb'; // Use the generated Node.js client
import { Empty } from '../../../../point_pb';

const client = new PointServiceClient('localhost:50051', credentials.createInsecure());

export async function GET() {
    const request = new Empty();

    try {
        const response = await new Promise((resolve, reject) => {
            client.getPoint(request, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(response);
                }
            });
        });

        return Response.json({
            x: response.getX(),
            y: response.getY(),
            z: response.getZ(),
        });
    } catch (err) {
        return Response.json({ error: err.message }, { status: 500 });
    }
}