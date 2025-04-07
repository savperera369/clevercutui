import { credentials } from '@grpc/grpc-js';
import { PointServiceClient } from '../../../../point_grpc_pb'; // Use the generated Node.js client
import { Empty } from '../../../../point_pb';

const client = new PointServiceClient('localhost:50051', credentials.createInsecure());

export async function GET() {
    const request = new Empty();

    try {
        const stream = client.getPointStream(request);
        let closed = false;

        const readableStream = new ReadableStream({
            async start(controller) {
                stream.on('data', (point) => {
                    if (closed) return;

                    const data = {
                        x: point.getX(),
                        y: point.getY(),
                        z: point.getZ(),
                        roll: point.getRoll(),
                        pitch: point.getPitch(),
                        yaw: point.getYaw(),
                    };

                    try {
                        const encoded = new TextEncoder().encode(JSON.stringify(data) + "\n");
                        controller.enqueue(encoded);
                    } catch (err) {
                        if (!closed) {
                            controller.error(err);
                            closed = true;
                        }
                    }
                });

                stream.on('end', () => {
                    if (!closed) {
                        controller.close();
                        closed = true;
                    }
                });

                stream.on('error', (err) => {
                    if (!closed) {
                        controller.error(err);
                        closed = true;
                    }
                });

                stream.on('abort', () => {
                    console.warn('Stream aborted');
                    if (!closed) {
                        controller.close();
                        closed = true;
                    }
                });
            },
        });

        return new Response(readableStream, {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        return Response.json({ error: err.message }, { status: 500 });
    }
}
