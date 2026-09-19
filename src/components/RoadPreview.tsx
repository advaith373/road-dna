import React, { useRef, useMemo, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useTelemetry } from '../data/telemetryStore';
import { AlertTriangle } from 'lucide-react';

// ── Road Mesh ──────────────────────────────────────────────
interface RoadMeshProps {
  roadProfile: number[];
  potholeDetected: boolean;
  potholeDistance: number;
  speed: number;
}

const RoadMesh: React.FC<RoadMeshProps> = ({ roadProfile, potholeDetected, potholeDistance, speed }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const offsetRef = useRef(0);
  const geo = useRef<THREE.PlaneGeometry>(null!);

  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(6, 50, 12, 64);
    return g;
  }, []);

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    // Scroll the road texture offset to simulate forward motion
    offsetRef.current += (speed / 3.6) * delta * 0.5;
    if (offsetRef.current > 1) offsetRef.current -= 1;

    // Update road profile vertex displacement
    const pos = geometry.attributes.position;
    const count = pos.count;
    for (let i = 0; i < count; i++) {
      const z = pos.getZ(i);
      const normalizedZ = (z + 25) / 50; // 0..1 along road
      const profileIdx = Math.floor(normalizedZ * (roadProfile.length - 1));
      const displacement = (roadProfile[profileIdx] || 0) * 0.8;
      // X displacement for lane bumps/potholes
      const x = pos.getX(i);
      const inLane = Math.abs(x) < 2;
      pos.setY(i, inLane ? displacement : 0);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -10]}>
      <meshStandardMaterial
        color="#1a1a1a"
        roughness={0.95}
        metalness={0}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// ── Road Lane Markings ─────────────────────────────────────
const LaneMarkings: React.FC<{ speed: number }> = ({ speed }) => {
  const groupRef = useRef<THREE.Group>(null);
  const posRef = useRef(0);
  const markings = useMemo(() => Array.from({ length: 10 }, (_, i) => i), []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    posRef.current += (speed / 3.6) * delta * 1.5;
    if (posRef.current > 4) posRef.current -= 4;
    groupRef.current.position.z = -posRef.current;
  });

  return (
    <group ref={groupRef}>
      {markings.map((i) => (
        <mesh key={i} position={[0, 0.02, -i * 4 - 2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.12, 2]} />
          <meshBasicMaterial color="#ffff00" transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
};

// ── Edge Lines ─────────────────────────────────────────────
const EdgeLines: React.FC = () => (
  <>
    {[-2.8, 2.8].map((x) => (
      <mesh key={x} position={[x, 0.02, -10]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, 50]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.25} />
      </mesh>
    ))}
  </>
);

// ── Pothole marker ─────────────────────────────────────────
const PotholeMarker: React.FC<{ distance: number }> = ({ distance }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.5 + Math.sin(clock.elapsedTime * 4) * 0.3;
  });

  // distance in meters → z position (road goes -10 to -35, 0m is bike, 50m is horizon)
  const zPos = -10 - (distance / 50) * 30;

  return (
    <mesh ref={meshRef} position={[0, 0.05, zPos]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.6, 1.0, 24]} />
      <meshBasicMaterial color="#ff3d3d" transparent opacity={0.7} side={THREE.DoubleSide} />
    </mesh>
  );
};

// ── Motorcycle Body ────────────────────────────────────────
const Motorcycle: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = 0.1 + Math.sin(clock.elapsedTime * 8) * 0.02;
  });

  return (
    <group ref={groupRef} position={[0, 0.2, 4]}>
      {/* Body */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.4, 0.25, 1.0]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Wheels */}
      {[-0.45, 0.45].map((z) => (
        <mesh key={z} position={[0, 0, z]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.18, 0.05, 8, 20]} />
          <meshStandardMaterial color="#222" roughness={0.9} />
        </mesh>
      ))}
      {/* Headlight glow */}
      <pointLight position={[0, 0.3, -0.5]} color="#00e5ff" intensity={2} distance={8} />
      <mesh position={[0, 0.3, -0.5]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color="#00e5ff" />
      </mesh>
    </group>
  );
};

// ── Scene Setup ────────────────────────────────────────────
const Scene: React.FC<RoadMeshProps> = (props) => {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 2.5, 8);
    camera.lookAt(0, 0, -15);
  }, [camera]);

  return (
    <>
      {/* Ambient + directional lighting */}
      <ambientLight intensity={0.3} color="#1a1a2e" />
      <directionalLight position={[0, 10, -5]} intensity={0.5} color="#4a9eff" />
      <directionalLight position={[5, 5, 5]} intensity={0.3} color="#ffffff" />
      {/* Fog for depth */}
      <fog attach="fog" args={['#09090f', 25, 55]} />
      {/* Road */}
      <RoadMesh {...props} />
      <LaneMarkings speed={props.speed} />
      <EdgeLines />
      {/* Pothole marker */}
      {props.potholeDetected && props.potholeDistance > 0 && (
        <PotholeMarker distance={props.potholeDistance} />
      )}
      {/* Motorcycle */}
      <Motorcycle />
      {/* Ground plane extension */}
      <mesh position={[0, -0.02, -25]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 60]} />
        <meshStandardMaterial color="#0d0d12" roughness={1} />
      </mesh>
      {/* Side barriers / landscape hints */}
      {[-4, 4].map((x) => (
        <mesh key={x} position={[x, 0.3, -20]}>
          <boxGeometry args={[0.5, 0.6, 40]} />
          <meshStandardMaterial color="#111118" roughness={0.9} />
        </mesh>
      ))}
    </>
  );
};

// ── Main Component ─────────────────────────────────────────
export const RoadPreview: React.FC = () => {
  const { road, gps } = useTelemetry();

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      background: '#09090f',
      border: '1px solid rgba(0,229,255,0.15)',
      overflow: 'hidden',
    }}>
      {/* Panel header */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        padding: '8px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10,
        background: 'linear-gradient(to bottom, rgba(9,9,15,0.95) 60%, transparent)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 6, height: 6, background: '#00e5ff', boxShadow: '0 0 6px #00e5ff' }} />
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.12em', color: '#6a6a82', fontWeight: 600 }}>
            ROAD PREVIEW — 50m SCAN
          </span>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#5a5a72' }}>
            {gps.speed.toFixed(1)} km/h
          </span>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#5a5a72' }}>
            HEADING {Math.round(gps.heading)}°
          </span>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        gl={{ antialias: true, alpha: false }}
        style={{ width: '100%', height: '100%', background: '#09090f' }}
        dpr={[1, 1.5]}
      >
        <Scene
          roadProfile={road.roadProfile}
          potholeDetected={road.potholeDetected}
          potholeDistance={road.potholeDistance}
          speed={gps.speed}
        />
      </Canvas>

      {/* Pothole HUD overlay */}
      {road.potholeDetected && road.potholeDistance > 0 && (
        <div style={{
          position: 'absolute',
          top: '50%',
          right: 16,
          transform: 'translateY(-50%)',
          padding: '10px 14px',
          background: 'rgba(255,61,61,0.1)',
          border: '1px solid rgba(255,61,61,0.5)',
          animation: 'danger-pulse 1s ease-in-out infinite',
          zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <AlertTriangle size={12} color="#ff3d3d" />
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#ff3d3d', fontWeight: 700, letterSpacing: '0.1em' }}>
              POTHOLE DETECTED
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#ff6060' }}>
              DIST: <span style={{ color: '#ff3d3d', fontWeight: 700 }}>{road.potholeDistance.toFixed(1)} m</span>
            </div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#ff6060' }}>
              ETA: <span style={{ color: '#ff3d3d', fontWeight: 700 }}>{road.potholeEta.toFixed(1)} s</span>
            </div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#ff9800', marginTop: 3, letterSpacing: '0.06em' }}>
              ↑ DAMPING +18%
            </div>
          </div>
        </div>
      )}

      {/* Scanning line effect */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: 80,
        background: 'linear-gradient(to top, rgba(0,229,255,0.04), transparent)',
        pointerEvents: 'none',
      }} />

      {/* Bottom speed indicator */}
      <div style={{
        position: 'absolute',
        bottom: 10,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 20,
        zIndex: 10,
      }}>
        {[
          { label: 'SURFACE', value: road.surface.toUpperCase() },
          { label: 'CONDITION', value: road.condition.toUpperCase() },
          { label: 'QUALITY', value: `${road.quality}/100` },
        ].map((item) => (
          <div key={item.label} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: '#5a5a72', letterSpacing: '0.1em' }}>{item.label}</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#9090a8', fontWeight: 600 }}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
