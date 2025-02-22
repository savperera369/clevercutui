"use client";
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeDMeshProps {
    points: THREE.Vector3[];
}

const ThreeDMesh = ({ points }: ThreeDMeshProps) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const pointsMeshRef = useRef<THREE.Points | null>(null);

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 10;
        cameraRef.current = camera;
        sceneRef.current = scene;

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        rendererRef.current = renderer;
        mountRef.current?.appendChild(renderer.domElement);

        const material = new THREE.PointsMaterial({
            color: 'white',
            size: 0.1,
            opacity: 0.7,
            transparent: true,
        });

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const pointsMesh = new THREE.Points(geometry, material);
        scene.add(pointsMesh);
        pointsMeshRef.current = pointsMesh;

        const light = new THREE.AmbientLight(0x404040, 2);
        scene.add(light);

        const directionalLight = new THREE.DirectionalLight('white', 1);
        directionalLight.position.set(10, 10, 10).normalize();
        scene.add(directionalLight);

        const animate = () => {
            requestAnimationFrame(animate);
            pointsMesh.rotation.x += 0.01;
            pointsMesh.rotation.y += 0.01;
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
        if (pointsMeshRef.current) {
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            pointsMeshRef.current.geometry.dispose();
            pointsMeshRef.current.geometry = geometry;
        }
    }, [points]);

    return <div ref={mountRef} className="w-full h-1/2"></div>;
};

export default ThreeDMesh;



