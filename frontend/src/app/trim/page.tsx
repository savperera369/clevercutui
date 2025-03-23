"use client"
import ThreeDMesh from "@/components/ThreeDMesh";
import { Point } from "../map/page";
import * as THREE from 'three';
import { useQuery } from "@tanstack/react-query";

const TrimModePage = () => {
    const getInitialMeshIfItExists = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/mesh", {
                cache: "no-store"
            });

            const { mesh } = await res.json();
            return mesh;
        } catch (error) {
            console.log(error);
        }
    }

    const { isLoading, isError, error, data } = useQuery({
        queryKey: ["getLatestMesh"],
        queryFn: getInitialMeshIfItExists
    });

    if (isLoading) {
        return <span>Loading Latest Mesh...</span>;
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }

    const points: THREE.Vector3[] = data?.points?.map((point: Point) => new THREE.Vector3(point.x, point.y, point.z));

    return (
        <div className="min-h-screen flex flex-col justify-center gap-y-4 mb-4 bg-gray-900 p-4">
            <div className="w-3/4 mx-auto p-4 h-full flex items-center rounded-md shadow-lg">
                <ThreeDMesh points={points} />
            </div>
        </div>
    );
}

export default TrimModePage;