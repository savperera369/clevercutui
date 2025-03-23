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
        <div className="px-4 py-4 min-h-screen flex flex-col justify-center gap-y-4 mb-4">
            <p className="text-2xl font-bold text-center">
                Trim Mode
            </p>
            <div className="p-4 bg-gray-100 rounded-md w-full shadow-md flex flex-col gap-y-4">
                <div className="w-3/4 mx-auto p-4 h-full flex items-center">
                    <ThreeDMesh points={points} />
                </div>
            </div>
            <p className="text-md font-medium text-center">
                Pictured above is the latest saved mesh. Every time you generate a new mesh in MAP
                Mode and save it, that is what will be rendered on this page.
            </p>
        </div>
    );
}

export default TrimModePage;