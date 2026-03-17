import { useEffect, useState, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { locations } from "./data";
import { latLonToVector3 } from "./latlong";

const attackTypes = [
  { name: "Malware", color: "#ff2a2a" },
  { name: "Phishing", color: "#a020f0" },
  { name: "Exploit", color: "#ffb000" },
];

function Explosion({ position, color }) {
  const mesh = useRef();
  const life = useRef(0);

  useFrame(() => {
    if (!mesh.current) return;

    life.current += 0.03;

    mesh.current.scale.setScalar(1 + life.current * 2);
    mesh.current.material.opacity = 0.6 - life.current;
  });

  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[0.04, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} />
    </mesh>
  );
}

function AttackArc({ arc }) {
  const particle = useRef();
  const progress = useRef(0);
  const [explode, setExplode] = useState(false);

  const curve = useMemo(() => {
    const mid = arc.start.clone().lerp(arc.end, 0.5).multiplyScalar(1.5);

    return new THREE.QuadraticBezierCurve3(arc.start, mid, arc.end);
  }, [arc]);

  const geometry = useMemo(() => {
    const points = curve.getPoints(80);
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [curve]);

  useFrame(() => {
    progress.current += 0.012;

    if (progress.current >= 1) {
      progress.current = 0;
      setExplode(true);
    }

    if (particle.current) {
      const pos = curve.getPoint(progress.current);
      particle.current.position.copy(pos);
    }
  });

  return (
    <group>
      <line geometry={geometry}>
        <lineBasicMaterial color={arc.color} transparent opacity={0.25} />
      </line>

      <line geometry={geometry}>
        <lineBasicMaterial color={arc.color} />
      </line>

      <mesh ref={particle}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshBasicMaterial color={arc.color} />
      </mesh>

      {explode && <Explosion position={arc.end} color={arc.color} />}
    </group>
  );
}

export default function Attacks() {
  const [arcs, setArcs] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const attackCount = Math.floor(Math.random() * 5) + 1;

      for (let i = 0; i < attackCount; i++) {
        const from = locations[Math.floor(Math.random() * locations.length)];
        const to = locations[Math.floor(Math.random() * locations.length)];

        const type =
          attackTypes[Math.floor(Math.random() * attackTypes.length)];

        const start = latLonToVector3(from.lat, from.lon);
        const end = latLonToVector3(to.lat, to.lon);

        setArcs((prev) => [
          ...prev.slice(-80),
          {
            start,
            end,
            color: type.color,
            id: Date.now() + Math.random(),
          },
        ]);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {arcs.map((arc) => (
        <AttackArc key={arc.id} arc={arc} />
      ))}
    </>
  );
}
