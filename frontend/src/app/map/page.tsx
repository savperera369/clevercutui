"use client";
import ThreeDMesh from "@/components/ThreeDMesh";
import { useRef } from 'react';
import * as THREE from 'three';
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type Point = {
    x: number;
    y: number;
    z: number;
}

const MapModePage = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const abortControllerRef = useRef<AbortController | null>(null);

    const stopStreamHandler = () => {
        abortControllerRef.current?.abort();
    };

    const getInitialMeshIfItExists = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/mesh", {
                cache: "no-store"
            });

            const { mesh } = await res.json();
            if (mesh) {
                return mesh.points.map((point: Point) =>
                    new THREE.Vector3(point.x, point.y, point.z)
                );
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    }

    const {  data: points = [], isLoading, isError, error } = useQuery({
        queryKey: ["streamPoints"],
        queryFn: getInitialMeshIfItExists
    });

    const fetchPoints = async () => {
        try {
            const controller = new AbortController();
            abortControllerRef.current = controller;
            const response = await fetch('http://localhost:3000/api/point', {
                signal: controller.signal,
            });
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader?.read() || {};
                if (done) break;

                const chunk = decoder.decode(value);
                const point: Point = JSON.parse(chunk);
                const threePoint = new THREE.Vector3(point.x, point.y, point.z);

                queryClient.setQueryData<THREE.Vector3[]>(['streamPoints'], (prevPoints = []) => {
                    return [...prevPoints, threePoint];
                });
            }
        } catch (err: any) {
            if (err.name === 'AbortError') {
                console.log('Stream aborted');
            } else {
                console.error('Error fetching point stream:', err);
            }
        }
    };

    const { mutate: startStream } = useMutation({
        mutationFn: fetchPoints,
    });

    const saveMeshHandler = async () => {
        try {
            if (!points || points.length === 0) {
                console.log("No points to save");
                return;
            }

            const meshPoints = points?.map((point: Point) => ({
                x: point.x,
                y: point.y,
                z: point.z,
            }));

            const newMesh = {
                name: "mesh",
                points: meshPoints,
            };

            const res = await fetch("http://localhost:3000/api/mesh", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newMesh),
            });

            if (!res.ok) {
                console.log("Failed to create mesh");
            }
        } catch (error) {
            console.error(error);
            throw new Error("Failed to save mesh.");
        }
    }

    const { mutate: saveMesh, isPending: isSaving } = useMutation({
        mutationFn: saveMeshHandler,
        onSuccess: async () => {
            console.log("Mesh saved successfully");
            await queryClient.invalidateQueries({ queryKey: ["streamPoints"] });
            router.push('/trim');
        },
        onError: (error) => {
            console.error("Error saving mesh:", error);
        },
    })

    const resetPoints = () => {
        queryClient.setQueryData(['streamPoints'], []);
    };

    if (isLoading) {
        return <span>Loading....</span>;
    }

    if (isError) {
        return <span>Error: {error.message}</span>;
    }

    return (
        <div className="p-8 min-h-screen flex flex-col items-center gap-y-2 mt-4">
            <h2 className="text-center font-bold text-2xl mb-4">MAP Mode</h2>
            <div className="flex items-start justify-center gap-x-4 w-full mt-4">
                <div className="flex flex-col items-center border border-black rounded-md bg-gray-100 shadow-md p-4 w-3/4 max-h-1/2">
                    <p className="font-semibold text-xl mb-4">
                        3D Mesh Visualization
                    </p>
                    <div className="w-full rounded-md h-full">
                        <ThreeDMesh points={points}/>
                    </div>
                </div>
                <div className="border border-black rounded-md bg-gray-100 shadow-md p-4 w-1/4 max-h-1/2 mb-4 mt-auto mb-auto">
                    <p className="text-center font-semibold text-xl">
                        Manual Point Capture
                    </p>
                    <div className="flex flex-col items-center p-4 gap-y-4 mt-2">
                        <button className="w-1/2 px-4 py-4 rounded-lg text-md font-medium bg-gray-500 text-white transition-all hover:bg-gray-900"
                                onClick={() => startStream()}
                        >
                            Get Points
                        </button>
                        <p className="text-sm font-medium mb-4">Get a continuous stream of points from GRPC server.</p>
                        <button className="w-1/2 px-4 py-4 rounded-lg text-md font-medium bg-gray-500 text-white transition-all hover:bg-gray-900"
                                onClick={stopStreamHandler}
                        >
                            Stop
                        </button>
                        <p className="text-sm font-medium mb-4">Stop the stream of points from the server.</p>
                        <button className="w-1/2 px-4 py-4 rounded-lg text-md font-medium bg-gray-500 text-white transition-all hover:bg-gray-900"
                                onClick={() => saveMesh()}
                        >
                            { isSaving ? "Saving..." : "Save" }
                        </button>
                        <p className="text-sm font-medium mb-4">Save the generated mesh.</p>
                        <button className="w-1/2 px-4 py-4 rounded-lg text-md font-medium bg-gray-500 text-white transition-all hover:bg-gray-900"
                                onClick={resetPoints}
                        >
                            Reset
                        </button>
                        <p className="text-sm font-medium mb-4">Clear Mesh.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MapModePage;
