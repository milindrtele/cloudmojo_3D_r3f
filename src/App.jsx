import React, { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import {
  Stats,
  OrbitControls,
  Environment,
  useGLTF,
  MeshReflectorMaterial,
  BakeShadows,
} from "@react-three/drei";

const ModelWithMaterials = () => {
  // Load the GLTF model
  const { scene } = useGLTF("/models/material_saperated_2.glb");

  // // Light Material
  // const lightMaterialProp = {
  //   color: 0xffffff,
  //   transmission: 1,
  //   opacity: 1,
  //   metalness: 0,
  //   roughness: 0.35,
  //   ior: 1.75,
  //   thickness: 1,
  //   attenuationColor: "#dbf6ff",
  //   attenuationDistance: 0.4,
  //   specularIntensity: 1,
  //   specularColor: "#ffffff",
  //   envMapIntensity: 1,
  //   //side: THREE.DoubleSide,
  //   // thicknessMap: thicknessTexture,
  //   // aoMap: thicknessTexture,
  //   // envMap: envtexture,
  //   //envMap: cubeRenderTargetRef.current.texture,
  // };

  // // Dark Material
  // const darkMaterialProp = {
  //   transparent: false,
  //   color: 0xffffff,
  //   transmission: 1,
  //   opacity: 1,
  //   metalness: 0,
  //   roughness: 0.35,
  //   ior: 1.75,
  //   thickness: 1,
  //   attenuationColor: "#ff6969",//"#1cbcf2",
  //   attenuationDistance: 0.4,
  //   specularIntensity: 1,
  //   specularColor: "#ffffff",
  //   //envMapIntensity: 1,
  //   // side: THREE.DoubleSide,
  //   // thicknessMap: thicknessTexture,
  //   // aoMap: thicknessTexture,
  //   // envMap: envtexture,
  //   //envMap: cubeRenderTargetRef.current.texture,
  // };

  // Light Material
  const lightMaterial = new THREE.MeshPhysicalMaterial({
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
  });

  // Dark Material
  const darkMaterial = new THREE.MeshPhysicalMaterial({
    transparent: false,
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
    side: THREE.DoubleSide,
  });

  // Traverse and apply materials
  scene.traverse((child) => {
    console.log(child);
    if (child) {
      // Apply different materials based on the mesh name or other properties
      switch (child.name) {
        case "light_material":
          child.children.forEach((object) => {
            console.log("light" + object);
            object.castShadow = true;
            object.material = lightMaterial;//<meshPhysicalMaterial {...lightMaterialProp} />;
          });
          break;
        case "dark_material":
          child.children.forEach((object) => {
            object.castShadow = true;
            object.material = darkMaterial;//<meshPhysicalMaterial {...darkMaterialProp} />;
          });
          break;
        case "Plane":
          child.visible = false;
          break;
        default:
          //   child.material = <meshReflectorMaterial
          //   resolution={1024}
          //   mixBlur={1}
          //   mixStrength={50}
          //   roughness={0.1}
          //   depthScale={0.01}
          //   mirror={0.75}
          //   color="#ffffff"
          // />;
          break;
      }
    }
  });

  // Add the processed scene to the component
  return <primitive object={scene} />;
};

const App = () => (
  <Canvas shadows className="canvas">
    <Environment
      files="/hdri/royal_esplanade_1k.hdr"
      background
      backgroundBlurriness={0.5}
    />
    <ambientLight intensity={0.5} />
    <directionalLight castShadow position={[10, 10, 5]} />
    <ModelWithMaterials />
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[30, 30]} />
      <MeshReflectorMaterial
        blur={[300, 30]}
        resolution={1024}
        mixBlur={1}
        mixStrength={180}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#202020"
        metalness={0.8}
      />
    </mesh>
    <OrbitControls />
    <Stats />
    <BakeShadows />
  </Canvas>
);

export default App;
