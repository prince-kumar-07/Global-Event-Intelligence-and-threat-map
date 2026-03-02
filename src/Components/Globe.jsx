import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, useTexture } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import Attacks from "./Attacks";

function Earth() {
  const texture = useTexture("/textures/earth.jpg");
  const earthRef = useRef();

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.0008;
    }
  });

  return (
    <group ref={earthRef}>
      {/* Earth */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial map={texture} />
      </mesh>

      {/* Cyber grid */}
      <mesh>
        <sphereGeometry args={[1.01, 64, 64]} />
        <meshBasicMaterial
          color="#00ffff"
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>

      {/* Atmospheric glow */}
      <mesh>
        <sphereGeometry args={[1.08, 64, 64]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.05} />
      </mesh>
    </group>
  );
}

function Globe() {
  return (
    <Canvas
      camera={{ position: [0, 0, 2] }}
      style={{ width: "100vw", height: "100vh", background: "#020617" }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={2} />

      <Stars radius={300} depth={60} count={20000} factor={7} fade />

      <Earth />
      <Attacks />

      <OrbitControls autoRotate autoRotateSpeed={0.3} enableZoom={false} />
    </Canvas>
  );
}

export default Globe;
