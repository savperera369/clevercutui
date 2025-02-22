import { credentials } from '@grpc/grpc-js';
import { PointServiceClient } from '../../../../point_grpc_pb'; // Use the generated Node.js client
import { Empty } from '../../../../point_pb';

const client = new PointServiceClient('localhost:50051', credentials.createInsecure());

export async function GET() {
    const request = new Empty();

    try {
        // Create a stream to receive points
        const stream = client.getPointStream(request);

        // Create a ReadableStream to send data to the client
        const readableStream = new ReadableStream({
            async start(controller) {
                // Handle each point received from the server
                stream.on('data', (point) => {
                    const data = {
                        x: point.getX(),
                        y: point.getY(),
                        z: point.getZ(),
                    };
                    // Enqueue the point data to the ReadableStream
                    controller.enqueue(new TextEncoder().encode(JSON.stringify(data) + '\n'));
                });

                // Handle the end of the stream
                stream.on('end', () => {
                    controller.close();
                });

                // Handle errors
                stream.on('error', (err) => {
                    controller.error(err);
                });

                stream.on('abort', () => {
                    console.error('Stream was aborted');
                });
            },
        });

        // Return the ReadableStream as the response
        return new Response(readableStream, {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        return Response.json({ error: err.message }, { status: 500 });
    }
}