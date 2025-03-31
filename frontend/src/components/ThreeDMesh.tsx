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
    const latestPointRef = useRef<THREE.Mesh | null>(null);

    const getColorForRegion = (point: THREE.Vector3) => {
        if (point.z < -5) {
            return new THREE.Color(0xff0000); // Red
        } else if (point.z >= -5 && point.z < 5) {
            return new THREE.Color(0xffff00); // Yellow
        } else {
            return new THREE.Color(0x00ff00); // Green
        }
    };

    useEffect(() => {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);
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
            vertexColors: true,
            opacity: 0.6,
            transparent: true,
            side: THREE.DoubleSide,
            wireframe: false,
        });

        if (points.length > 0) {
            const geometry = new ConvexGeometry(points);

            // Apply colors to each vertex based on position
            const colors: number[] = [];
            for (let i = 0; i < geometry.attributes.position.count; i++) {
                const vertex = new THREE.Vector3().fromBufferAttribute(geometry.attributes.position, i);
                const color = getColorForRegion(vertex);
                colors.push(color.r, color.g, color.b); // Push RGB components of color
            }
            geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));

            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
            meshRef.current = mesh;
        }

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
        if (meshRef.current && points.length > 0) {
            const newGeometry = new ConvexGeometry(points);

            // Apply colors to each vertex based on position again if points change
            const colors: number[] = [];
            for (let i = 0; i < newGeometry.attributes.position.count; i++) {
                const vertex = new THREE.Vector3().fromBufferAttribute(newGeometry.attributes.position, i);
                const color = getColorForRegion(vertex);
                colors.push(color.r, color.g, color.b);
            }
            newGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));

            meshRef.current.geometry.dispose();
            meshRef.current.geometry = newGeometry;
        }

        if (sceneRef.current && points.length > 0) {
            if (latestPointRef.current) {
                sceneRef.current.remove(latestPointRef.current);
            }

            const latestPoint = points[points.length - 1];
            const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);
            const sphereMaterial = new THREE.MeshBasicMaterial({
                color: getColorForRegion(latestPoint), // Use the color based on region
            });
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.set(latestPoint.x, latestPoint.y, latestPoint.z);
            sceneRef.current.add(sphere);
            latestPointRef.current = sphere;
        }
    }, [points]);

    return <div ref={mountRef} className="w-full h-[500px] rounded-md shadow-lg"></div>;
};

export default ThreeDMesh;





