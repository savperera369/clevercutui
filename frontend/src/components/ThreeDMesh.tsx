"use client"
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const generateRandomPoints = (numPoints: number) => {
    const points = [];
    for (let i = 0; i < numPoints; i++) {
        const x = Math.random() * 10 - 5;
        const y = Math.random() * 10 - 5;
        const z = Math.random() * 10 - 5;
        points.push(new THREE.Vector3(x, y, z));
    }
    return points;
};

const ThreeDMesh = () => {
    const mountRef = useRef<HTMLDivElement>(null); // To attach the WebGLRenderer
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null); // Keep track of the renderer

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight); // Initial size
        rendererRef.current = renderer;
        mountRef.current?.appendChild(renderer.domElement); // Attach renderer to the DOM

        // Create a material for the points
        const material = new THREE.PointsMaterial({
            color: 'white',
            size: 0.1, // Size of the points
            opacity: 0.7,
            transparent: true,
        });

        // Generate 1000 random points
        const points = generateRandomPoints(1000);

        // Create a geometry from the points
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        // Create a points mesh
        const pointsMesh = new THREE.Points(geometry, material);
        scene.add(pointsMesh);

        // Create a lighting setup
        const light = new THREE.AmbientLight(0x404040, 2); // Ambient light
        scene.add(light);

        const directionalLight = new THREE.DirectionalLight('white', 1);
        directionalLight.position.set(10, 10, 10).normalize();
        scene.add(directionalLight);

        // Position the camera
        camera.position.z = 10;

        const animate = () => {
            requestAnimationFrame(animate);
            pointsMesh.rotation.x += 0.01;
            pointsMesh.rotation.y += 0.01;
            renderer.render(scene, camera);
        };

        animate();

        const onWindowResize = () => {
            if (mountRef.current) {
                const width = mountRef.current.clientWidth;
                const height = mountRef.current.clientHeight;
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height); // Adjust renderer size to the container size
            }
        };

        // Use ResizeObserver to handle dynamic resizing of the container
        const resizeObserver = new ResizeObserver(onWindowResize);
        if (mountRef.current) {
            resizeObserver.observe(mountRef.current);
        }

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', onWindowResize);
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} className="w-full h-1/2"></div>;
};

export default ThreeDMesh;



