import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import {
  SoftShadows,
  useGLTF,
  OrbitControls,
  Stats,
  MeshReflectorMaterial,
  Environment,
  MeshTransmissionMaterial,
  CubeCamera,
} from "@react-three/drei";
import { ContactShadows } from "@react-three/drei";
import { useControls } from "leva";

import { useThree, useFrame } from "@react-three/fiber";

const CameraMouseRotation = () => {
  const { camera } = useThree();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (event) => {
      setMouse({
        x: (event.clientX / window.innerWidth) * 2 - 1, // Normalize X to [-1, 1]
        y: -(event.clientY / window.innerHeight) * 2 + 1, // Normalize Y to [-1, 1]
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

useFrame(() => {
    const rotationSpeed = 2;
  
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * rotationSpeed, 0.5);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, Math.max(mouse.y * rotationSpeed + 2, 2), 0.5);
  
    camera.lookAt(0, 2, 0);
  });
  

  return null;
};

// const ModelWithMaterials = () => {
//   const { scene } = useGLTF("/models/only_objects.glb");

//   // Apply material directly to the mesh nodes
//   const applyMaterial = (node, materialProps) => {
//     if (node.isMesh) {
//       node.material = new THREE.MeshPhysicalMaterial(materialProps);
//       node.castShadow = true;
//       node.receiveShadow = true;
//     }

//     // Recursively apply to children
//     if (node.children && node.children.length > 0) {
//       node.children.forEach((child) => applyMaterial(child, materialProps));
//     }
//   };

//   scene.children.forEach((child) => {
//     switch (child.name) {
//       case "light_material":
//         applyMaterial(child, {
//           color: 0xffffff,
//           transmission: 1,
//           opacity: 1,
//           metalness: 0,
//           roughness: 0.35,
//           ior: 1.75,
//           thickness: 1,
//           attenuationColor: new THREE.Color("#dbf6ff"),
//           attenuationDistance: 0.4,
//           specularIntensity: 1,
//           specularColor: new THREE.Color("#ffffff"),
//           envMapIntensity: 1,
//           //side:THREE.DoubleSide
//         });
//         break;

//       case "dark_material":
//         applyMaterial(child, {
//           color: 0xffffff,
//           transmission: 1,
//           opacity: 1,
//           metalness: 0,
//           roughness: 0.35,
//           ior: 1.75,
//           thickness: 1,
//           attenuationColor: new THREE.Color("#1cbcf2"),
//           attenuationDistance: 0.4,
//           specularIntensity: 1,
//           specularColor: new THREE.Color("#ffffff"),
//           //side:THREE.DoubleSide
//         });
//         break;

//       default:
//         // Fallback material
//         applyMaterial(child, { color: 0xcccccc });
//         break;
//     }
//   });

//   return <primitive object={scene} />;
// };

function Model() {
  const { nodes } = useGLTF("/models/only_objects_2.glb");

  const light_material = {
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
  };

  const background_light_material = {
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
    side:THREE.DoubleSide
  };

  const dark_material = {
    color: 0xffffff,
    transmission: 1,
    opacity: 0,
    metalness: 0,
    roughness: 0.35,
    ior: 1.4,
    thickness: 1,
    attenuationColor: new THREE.Color("#1cbcf2"),
    attenuationDistance: 0.4,
    specularIntensity: 1,
    specularColor: new THREE.Color("#ffffff"),
    //side:THREE.DoubleSide
  };

  const background_dark_material = {
    color: 0xffffff,
    transmission: 1,
    opacity: 0,
    metalness: 0,
    roughness: 0.35,
    ior: 1.4,
    thickness: 1,
    attenuationColor: new THREE.Color("#1cbcf2"),
    attenuationDistance: 0.4,
    specularIntensity: 1,
    specularColor: new THREE.Color("#ffffff"),
    side:THREE.DoubleSide
  };

  // Helper function to render children of a parent
  const renderChildren = (parent, materialProp) => {
    return parent.children.map((child, index) => (
      <mesh
        key={index}
        geometry={child.geometry}
        castShadow={true}
        receiveShadow={true}
        onClick={() => console.log(`Clicked on ${child.name}`)}
      >
        <meshPhysicalMaterial {...materialProp} />
      </mesh>
    ));
  };

  return (
    <CubeCamera frames={1}>
      {(texture) => (
        <group>
          <group name="light_material">
            {renderChildren(nodes.light_material, {
              ...light_material,
              envMap: texture,
            })}
          </group>
          <group name="dark_material">
            {renderChildren(nodes.dark_material, {
              ...dark_material,
              envMap: texture,
            })}
          </group>
          <group name="background_light">
            {renderChildren(nodes.background_light, {
              ...background_light_material,
              envMap: texture,
            })}
          </group>
          <group name="background_dark">
            {renderChildren(nodes.background_dark, {
              ...background_dark_material,
              envMap: texture,
            })}
          </group>
        </group>
      )}
    </CubeCamera>
  );
}

const App = () => {
  const { enabled, ...config } = useControls({
    enabled: true,
    size: { value: 15, min: 0, max: 50 },
    focus: { value: 0.5, min: 0, max: 2 },
    samples: { value: 6, min: 1, max: 10, step: 1 },
  });

  return (
    <Canvas
      shadows
      className="canvas"
      camera={{ position: [0, 2, 7.5], fov: 75 }}
    >
      {enabled && <SoftShadows {...config} />}
      {/* <ContactShadows position={[0, -7, 0]} opacity={0.75} scale={40} blur={1} far={9} /> */}
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
      <Model />
      {/* <ModelWithMaterials /> */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <MeshReflectorMaterial
          blur={[100, 100]} // Reduced for performance
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
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
        receiveShadow
      >
        <planeGeometry args={[30, 30]} />
        <shadowMaterial transparent opacity={0.4} />
      </mesh>
      {/* <OrbitControls target={[0, 2, 0]} maxPolarAngle={Math.PI / 2} /> */}
      <CameraMouseRotation />
      <Stats />
    </Canvas>
  );
};

export default App;
