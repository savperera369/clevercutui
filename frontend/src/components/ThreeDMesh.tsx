"use client";
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ConvexGeometry } from "three-stdlib";

interface ThreeDMeshProps {
    points: THREE.Vector3[];
}

const ThreeDMesh = ({ points }: ThreeDMeshProps) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const meshRef = useRef<THREE.Mesh | null>(null);

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            mountRef.current!.clientWidth / mountRef.current!.clientHeight,
            0.1,
            1000
        );
        camera.position.z = 30;
        cameraRef.current = camera;
        sceneRef.current = scene;

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(mountRef.current!.clientWidth, mountRef.current!.clientHeight);
        rendererRef.current = renderer;
        mountRef.current?.appendChild(renderer.domElement);

        const material = new THREE.MeshPhongMaterial({
            color: 'skyblue',
            opacity: 0.6,
            transparent: true,
            side: THREE.DoubleSide,
            wireframe: false,
        });

        const geometry = new ConvexGeometry(points);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        meshRef.current = mesh;

        const light = new THREE.AmbientLight(0x404040, 2);
        scene.add(light);

        const directionalLight = new THREE.DirectionalLight('white', 1);
        directionalLight.position.set(10, 10, 10).normalize();
        scene.add(directionalLight);

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };

        animate();

        const onWindowResize = () => {
            if (mountRef.current && cameraRef.current && rendererRef.current) {
                const width = mountRef.current.clientWidth;
                const height = mountRef.current.clientHeight;
                cameraRef.current.aspect = width / height;
                cameraRef.current.updateProjectionMatrix();
                rendererRef.current.setSize(width, height);
            }
        };

        const resizeObserver = new ResizeObserver(onWindowResize);
        if (mountRef.current) {
            resizeObserver.observe(mountRef.current);
        }

        return () => {
            resizeObserver.disconnect();
            renderer.dispose();
        };
    }, []);

    useEffect(() => {
        if (meshRef.current) {
            const newGeometry = new ConvexGeometry(points);
            meshRef.current.geometry.dispose();
            meshRef.current.geometry = newGeometry;
        }
    }, [points]);

    return <div ref={mountRef} className="w-full h-[500px]"></div>;
};

export default ThreeDMesh;




