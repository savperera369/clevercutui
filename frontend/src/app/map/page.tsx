"use client";
import ThreeDMesh from "@/components/ThreeDMesh";
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingData from "@/components/LoadingData";

export type Point = {
    x: number;
    y: number;
    z: number;
    roll: number;
    pitch: number;
    yaw: number;
}

const MapModePage = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const abortControllerRef = useRef<AbortController | null>(null);
    const [rpy, setRpy] = useState(new THREE.Vector3(0, 0, 0));

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
            queryClient.setQueryData(['streamPoints'], []);
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
                setRpy(new THREE.Vector3(point.roll, point.pitch, point.yaw));

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

    const { mutate: startStream, isPending } = useMutation({
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

    const getGuardLength = () => {
        if (!points || points.length === 0) {
            return 1;
        }

        const lastPoint = points[points.length - 1];
        const z = lastPoint.z;

        if (z < -5) {
            return 1;
        } else if (z >= -5 && z <= 5) {
            return 2;
        } else {
            return 3
        }
    };

    if (isLoading) {
        return <LoadingData />;
    }

    if (isError) {
        return <span>Error: {error.message}</span>;
    }

    return (
        <div className="p-4 min-h-screen flex flex-col items-center gap-y-2 bg-black">
            <div className="flex flex-col items-center gap-y-4 w-full mt-4">
                <div className="w-3/4 max-h-1/2 rounded-md h-full">
                    <ThreeDMesh points={points} roll_pitch_yaw={rpy}/>
                </div>
                <div className="border border-white rounded-md shadow-lg p-4 w-3/4 max-h-1/2">
                    <p className="text-center font-semibold text-xl text-white">
                        Manual Point Capture
                    </p>
                    <div className="flex items-center justify-center p-4 gap-x-4 mt-2">
                        <button className="w-1/2 px-4 py-4 rounded-lg text-md font-medium bg-white transition-all hover:bg-gray-200"
                                onClick={() => startStream()}
                        >
                            { isPending ? "Streaming Points..." : "Get Points"}
                        </button>
                        <button className="w-1/2 px-4 py-4 rounded-lg text-md font-medium bg-white transition-all hover:bg-gray-200"
                                onClick={stopStreamHandler}
                        >
                            Stop
                        </button>
                        <button className="w-1/2 px-4 py-4 rounded-lg text-md font-medium bg-white transition-all hover:bg-gray-200"
                                onClick={() => saveMesh()}
                        >
                            { isSaving ? "Saving..." : "Save" }
                        </button>
                        <button className="w-1/2 px-4 py-4 rounded-lg text-md font-medium bg-white transition-all hover:bg-gray-200"
                                onClick={resetPoints}
                        >
                            Reset
                        </button>
                    </div>
                </div>
                <div className="border border-white rounded-md shadow-lg p-4 text-white">
                    <span className="font-semibold">Guard Length: {getGuardLength()}</span>
                </div>
            </div>
        </div>
    );
}

export default MapModePage;
