"use client"
import ThreeDMesh from "@/components/ThreeDMesh";
import { Point } from "../map/page";
import * as THREE from 'three';
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import LoadingData from "@/components/LoadingData";
import {useRef, useState} from "react";

const TrimModePage = () => {
    const queryClient = useQueryClient();
    const abortControllerRef = useRef<AbortController | null>(null);
    const [rpy, setRpy] = useState(new THREE.Vector3(0, 0, 0));

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

    const stopStreamHandler = () => {
        abortControllerRef.current?.abort();
    };

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

    const getGuardLength = () => {
        if (!points || points.length === 0) {
            return 1;
        }

        const lastPoint = points[points.length - 1];
        const y = lastPoint.y;

        if (y < -5) {
            return 1;
        } else if (y >= -5 && y <= 5) {
            return 2;
        } else {
            return 3
        }
    };

    if (isLoading) {
        return <LoadingData />;
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }

    return (
        <div className="min-h-screen flex flex-col justify-between gap-y-4 mb-4 bg-black p-4">
            <div className="w-3/4 mx-auto p-4 h-full flex items-center rounded-md shadow-lg">
                <ThreeDMesh points={points} isTrim={true}/>
            </div>
            <div className="flex flex-col gap-y-4 p-4 border border-white rounded-md text-white w-3/4 mx-auto">
                <p className="text-4xl text-white font-bold text-center">TRIM Mode</p>
                <div className="p-2 flex items-center justify-center gap-x-4 flex-1">
                    <button className="bg-white rounded-md hover:bg-gray-200 text-black w-1/3 p-4 text-lg"
                        onClick={() => startStream()}
                    >
                        Start Trimming
                    </button>
                    <button className="bg-white rounded-md hover:bg-gray-200 text-black w-1/3 p-4 text-lg"
                        onClick={stopStreamHandler}
                    >
                        Stop Trimming
                    </button>
                </div>
                <span className="font-semibold mx-auto">Guard Length: {getGuardLength()}</span>
            </div>
        </div>
    );
}

export default TrimModePage;