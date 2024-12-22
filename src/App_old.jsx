import React from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { SoftShadows, useGLTF, OrbitControls, Stats, MeshReflectorMaterial, Environment} from "@react-three/drei";
import { useControls } from "leva"

const ModelWithMaterials = () => {
  const { scene } = useGLTF("/models/only_objects.glb");

  // Apply material directly to the mesh nodes
  const applyMaterial = (node, materialProps) => {
    if (node.isMesh) {
      node.material = new THREE.MeshPhysicalMaterial(materialProps);
      node.castShadow = true;
      node.receiveShadow = true;
    }

    // Recursively apply to children
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => applyMaterial(child, materialProps));
    }
  };

  scene.children.forEach((child) => {
    switch (child.name) {
      case "light_material":
        applyMaterial(child, {
          color: 0xffffff,
          transmission: 1,
          opacity: 1,
          metalness: 0,
          roughness: 0.35,
          ior: 1.75,
          thickness: 1,
          attenuationColor: new THREE.Color("#dbf6ff"),
          attenuationDistance: 0.4,
          specularIntensity: 1,
          specularColor: new THREE.Color("#ffffff"),
          envMapIntensity: 1,
          //side:THREE.DoubleSide
        });
        break;

      case "dark_material":
        applyMaterial(child, {
          color: 0xffffff,
          transmission: 1,
          opacity: 1,
          metalness: 0,
          roughness: 0.35,
          ior: 1.75,
          thickness: 1,
          attenuationColor: new THREE.Color("#1cbcf2"),
          attenuationDistance: 0.4,
          specularIntensity: 1,
          specularColor: new THREE.Color("#ffffff"),
          //side:THREE.DoubleSide
        });
        break;

      default:
        // Fallback material
        applyMaterial(child, { color: 0xcccccc });
        break;
    }
  });

  return <primitive object={scene} />;
};

const App = () => {
  const { enabled, ...config } = useControls({
    enabled: true,
    size: { value: 15, min: 0, max: 50 },
    focus: { value: 0.5, min: 0, max: 2 },
    samples: { value: 6, min: 1, max: 10, step: 1 },
  });

  return (
    <Canvas shadows className="canvas">
      {enabled && <SoftShadows {...config} />}
      <Environment
        files="/hdri/royal_esplanade_1k.hdr"
        background
        backgroundBlurriness={0.5}
      />
      <ambientLight intensity={0.5} />
      <directionalLight
        castShadow
        position={[-10, 10, 5]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <ModelWithMaterials />
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <MeshReflectorMaterial
          blur={[100,100]} // Reduced for performance
          resolution={1024}
          mixBlur={1}
          mixStrength={180}
          roughness={0.5}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#050505" //"#8f8d8d"
          metalness={0.0}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <shadowMaterial transparent opacity={0.4} />
      </mesh>
      <OrbitControls />
      <Stats />
    </Canvas>
  );
};

export default App;
