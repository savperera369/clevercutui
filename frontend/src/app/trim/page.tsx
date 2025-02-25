"use client"
import ThreeDMesh from "@/components/ThreeDMesh";
import { useState, useEffect } from "react";
import { Point } from "../map/page";
import * as THREE from 'three';

const TrimModePage = () => {
    const [points, setPoints] = useState<THREE.Vector3[]>([]);

    useEffect(() => {
        const getInitialMeshIfItExists = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/mesh", {
                    cache: "no-store"
                });

                const { mesh } = await res.json();
                if (mesh) {
                    setPoints(mesh?.points?.map((point: Point) => new THREE.Vector3(point.x, point.y, point.z)));
                }
            } catch (error) {
                console.log(error);
            }
        }

        getInitialMeshIfItExists();
    }, []);

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