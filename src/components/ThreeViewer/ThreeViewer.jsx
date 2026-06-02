import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function createModelMesh(model) {
  const color = model?.color || "#3b82f6";
  let geometry;

  const material = new THREE.MeshStandardMaterial({
    color,
    metalness: 0.3,
    roughness: 0.6,
  });

  const type = model?.type || "box";
  if (model?.isObject3D) {
    return model;
  }

  switch (type) {
    case "sphere":
      geometry = new THREE.SphereGeometry(model.radius || 0.9, 32, 24);
      break;
    case "cylinder":
      geometry = new THREE.CylinderGeometry(model.radiusTop || 0.6, model.radiusBottom || 0.6, model.height || 1.4, 24);
      break;
    case "box":
    default:
      geometry = new THREE.BoxGeometry(
        model.dimensions?.x || 1.4,
        model.dimensions?.y || 0.8,
        model.dimensions?.z || 0.8
      );
  }

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 0, 0);
  mesh.rotation.set(model.rotation?.x || 0, model.rotation?.y || 0, model.rotation?.z || 0);
  return mesh;
}

export default function ThreeViewer({ model, className = "", style }) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const resizeObserverRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(2.5, 1.8, 3.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(3, 5, 2);
    scene.add(directionalLight);

    const mesh = createModelMesh(model);
    scene.add(mesh);
    const meshGeometry = mesh.geometry;

    const gridHelper = new THREE.GridHelper(8, 12, 0x888888, 0x222222);
    gridHelper.position.y = -1.05;
    scene.add(gridHelper);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.screenSpacePanning = false;
    controls.minDistance = 1.8;
    controls.maxDistance = 8;
    controls.autoRotate = false;
    controls.target.set(0, 0, 0);
    controls.update();

    const animate = () => {
      mesh.rotation.y += 0.002;
      mesh.rotation.x += 0.0005;
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    resize();
    animate();

    resizeObserverRef.current = new ResizeObserver(resize);
    resizeObserverRef.current.observe(container);

    return () => {
      resizeObserverRef.current?.disconnect();
      controls.dispose();
      renderer.dispose();
      scene.remove(mesh);
      if (meshGeometry) meshGeometry.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [model]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden rounded-3xl border border-gray-200 bg-slate-950 ${className}`}
      style={{ minHeight: 280, ...style }}
    />
  );
}
