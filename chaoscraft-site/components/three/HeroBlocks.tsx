"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Box, Sphere, Cone } from "@react-three/drei";
import * as THREE from "three";

/* ── helpers ── */
function useMob(startPos: [number,number,number], speed: number, range: number, off: number) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock, mouse }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    const dx = Math.sin(t * speed * .35 + off);
    group.current.position.x = startPos[0] + dx * range;
    group.current.position.y = startPos[1] + Math.sin(t * .6 + off) * .06;
    group.current.rotation.y = dx > 0 ? 0 : Math.PI;
    group.current.position.x += mouse.x * .4;
    group.current.position.y += mouse.y * .2;
  });
  return group;
}

/* ══ CREEPER ══ */
function Creeper({ startPos }: { startPos: [number,number,number] }) {
  const off   = useMemo(() => Math.random() * Math.PI * 2, []);
  const speed = useMemo(() => .28 + Math.random() * .22, []);
  const group = useMob(startPos, speed, 4.5, off);
  const legL  = useRef<THREE.Mesh>(null);
  const legR  = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!legL.current || !legR.current) return;
    const t = clock.getElapsedTime();
    legL.current.rotation.x =  Math.sin(t * speed * 3.5 + off) * .55;
    legR.current.rotation.x = -Math.sin(t * speed * 3.5 + off) * .55;
  });

  return (
    <group ref={group} position={startPos} scale={2.2}>
      {/* head */}
      <Box args={[.9,.9,.9]} position={[0,1.55,0]}>
        <meshStandardMaterial color="#4aad3a" emissive="#2a6020" emissiveIntensity={.6} roughness={.8} />
      </Box>
      <Box args={[.24,.24,.06]} position={[-.22,1.67,.46]}><meshStandardMaterial color="#111"/></Box>
      <Box args={[.24,.24,.06]} position={[.22,1.67,.46]}><meshStandardMaterial color="#111"/></Box>
      <Box args={[.16,.3,.06]} position={[0,1.34,.46]}><meshStandardMaterial color="#111"/></Box>
      {/* body */}
      <Box args={[.72,1.1,.52]} position={[0,.68,0]}>
        <meshStandardMaterial color="#3a7a28" emissive="#1a4010" emissiveIntensity={.5} roughness={.9}/>
      </Box>
      {/* legs */}
      <mesh ref={legL} position={[-.2,.03,0]}>
        <boxGeometry args={[.32,.65,.32]}/>
        <meshStandardMaterial color="#4aad3a" emissive="#2a6020" emissiveIntensity={.5} roughness={.85}/>
      </mesh>
      <mesh ref={legR} position={[.2,.03,0]}>
        <boxGeometry args={[.32,.65,.32]}/>
        <meshStandardMaterial color="#4aad3a" emissive="#2a6020" emissiveIntensity={.5} roughness={.85}/>
      </mesh>
    </group>
  );
}

/* ══ ZOMBIE ══ */
function Zombie({ startPos }: { startPos: [number,number,number] }) {
  const off   = useMemo(() => Math.random() * Math.PI * 2, []);
  const speed = useMemo(() => .18 + Math.random() * .14, []);
  const group = useMob(startPos, speed, 5, off);
  const legL  = useRef<THREE.Mesh>(null);
  const legR  = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!legL.current || !legR.current) return;
    const t = clock.getElapsedTime();
    legL.current.rotation.x =  Math.sin(t * speed * 3.2 + off) * .55;
    legR.current.rotation.x = -Math.sin(t * speed * 3.2 + off) * .55;
  });

  return (
    <group ref={group} position={startPos} scale={2.3}>
      {/* head */}
      <Box args={[.82,.82,.82]} position={[0,2.0,0]}>
        <meshStandardMaterial color="#6aaa42" roughness={.8} emissive="#2a5a10" emissiveIntensity={.7}/>
      </Box>
      <Box args={[.2,.16,.06]} position={[-.22,2.1,.42]}><meshStandardMaterial color="#ffee00" emissive="#ffee00" emissiveIntensity={3}/></Box>
      <Box args={[.2,.16,.06]} position={[.22,2.1,.42]}><meshStandardMaterial color="#ffee00" emissive="#ffee00" emissiveIntensity={3}/></Box>
      {/* body */}
      <Box args={[.78,1.1,.46]} position={[0,.98,0]}>
        <meshStandardMaterial color="#4a7030" emissive="#1a3010" emissiveIntensity={.5} roughness={.9}/>
      </Box>
      {/* outstretched arms */}
      <Box args={[.3,.88,.3]} position={[-.62,1.28,.28]} rotation={[-1.35,0,0]}>
        <meshStandardMaterial color="#6aaa42" emissive="#2a5a10" emissiveIntensity={.5} roughness={.85}/>
      </Box>
      <Box args={[.3,.88,.3]} position={[.62,1.28,.28]} rotation={[-1.35,0,0]}>
        <meshStandardMaterial color="#6aaa42" emissive="#2a5a10" emissiveIntensity={.5} roughness={.85}/>
      </Box>
      {/* legs */}
      <mesh ref={legL} position={[-.2,.17,0]}>
        <boxGeometry args={[.32,.75,.32]}/>
        <meshStandardMaterial color="#3a6020" emissive="#1a3010" emissiveIntensity={.4} roughness={.9}/>
      </mesh>
      <mesh ref={legR} position={[.2,.17,0]}>
        <boxGeometry args={[.32,.75,.32]}/>
        <meshStandardMaterial color="#3a6020" emissive="#1a3010" emissiveIntensity={.4} roughness={.9}/>
      </mesh>
    </group>
  );
}

/* ══ ENDERMAN ══ */
function Enderman({ startPos }: { startPos: [number,number,number] }) {
  const off   = useMemo(() => Math.random() * Math.PI * 2, []);
  const speed = useMemo(() => .15 + Math.random() * .1, []);
  const group = useMob(startPos, speed, 5.5, off);
  const eyeL  = useRef<THREE.Mesh>(null);
  const eyeR  = useRef<THREE.Mesh>(null);
  const legL  = useRef<THREE.Mesh>(null);
  const legR  = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!legL.current || !legR.current || !eyeL.current || !eyeR.current) return;
    const t = clock.getElapsedTime();
    legL.current.rotation.x =  Math.sin(t * speed * 3 + off) * .45;
    legR.current.rotation.x = -Math.sin(t * speed * 3 + off) * .45;
    const flicker = Math.sin(t * 14 + off) > .88;
    (eyeL.current.material as THREE.MeshStandardMaterial).emissiveIntensity = flicker ? 0 : 4;
    (eyeR.current.material as THREE.MeshStandardMaterial).emissiveIntensity = flicker ? 0 : 4;
  });

  return (
    <group ref={group} position={startPos} scale={2.1}>
      {/* head */}
      <Box args={[.72,.72,.72]} position={[0,3.6,0]}>
        <meshStandardMaterial color="#0d0d0d" roughness={.9} emissive="#1a0030" emissiveIntensity={.4}/>
      </Box>
      <mesh ref={eyeL} position={[-.18,3.7,.37]}>
        <boxGeometry args={[.18,.12,.04]}/>
        <meshStandardMaterial color="#9333ea" emissive="#9333ea" emissiveIntensity={4}/>
      </mesh>
      <mesh ref={eyeR} position={[.18,3.7,.37]}>
        <boxGeometry args={[.18,.12,.04]}/>
        <meshStandardMaterial color="#9333ea" emissive="#9333ea" emissiveIntensity={4}/>
      </mesh>
      {/* neck */}
      <Box args={[.24,.4,.24]} position={[0,3.14,0]}>
        <meshStandardMaterial color="#0a0a0a" roughness={.95}/>
      </Box>
      {/* body */}
      <Box args={[.58,1.5,.32]} position={[0,2.1,0]}>
        <meshStandardMaterial color="#0d0d0d" roughness={.95} emissive="#0a001a" emissiveIntensity={.3}/>
      </Box>
      {/* arms */}
      <Box args={[.2,1.6,.2]} position={[-.42,2.2,0]}><meshStandardMaterial color="#0a0a0a" roughness={.95}/></Box>
      <Box args={[.2,1.6,.2]} position={[.42,2.2,0]}><meshStandardMaterial color="#0a0a0a" roughness={.95}/></Box>
      {/* legs */}
      <mesh ref={legL} position={[-.17,1.1,0]}>
        <boxGeometry args={[.24,1.2,.24]}/>
        <meshStandardMaterial color="#0a0a0a" roughness={.95}/>
      </mesh>
      <mesh ref={legR} position={[.17,1.1,0]}>
        <boxGeometry args={[.24,1.2,.24]}/>
        <meshStandardMaterial color="#0a0a0a" roughness={.95}/>
      </mesh>
    </group>
  );
}

/* ══ WOLF ══ */
function Wolf({ startPos }: { startPos: [number,number,number] }) {
  const off   = useMemo(() => Math.random() * Math.PI * 2, []);
  const speed = useMemo(() => .38 + Math.random() * .25, []);
  const group = useMob(startPos, speed, 4, off);
  const legFL = useRef<THREE.Mesh>(null);
  const legFR = useRef<THREE.Mesh>(null);
  const legBL = useRef<THREE.Mesh>(null);
  const legBR = useRef<THREE.Mesh>(null);
  const tail  = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (legFL.current) legFL.current.rotation.x =  Math.sin(t * speed * 3.5 + off) * .5;
    if (legFR.current) legFR.current.rotation.x = -Math.sin(t * speed * 3.5 + off) * .5;
    if (legBL.current) legBL.current.rotation.x = -Math.sin(t * speed * 3.5 + off) * .5;
    if (legBR.current) legBR.current.rotation.x =  Math.sin(t * speed * 3.5 + off) * .5;
    if (tail.current)  tail.current.rotation.x  =  Math.sin(t * 3 + off) * .4 - .3;
  });

  return (
    <group ref={group} position={startPos} scale={2.1}>
      {/* body */}
      <Box args={[.55,.55,1.0]} position={[0,.62,0]}>
        <meshStandardMaterial color="#8a8a8a" roughness={.85}/>
      </Box>
      {/* head */}
      <Box args={[.58,.52,.58]} position={[0,.95,.6]}>
        <meshStandardMaterial color="#7a7a7a" roughness={.85}/>
      </Box>
      {/* snout */}
      <Box args={[.3,.22,.3]} position={[0,.82,.92]}>
        <meshStandardMaterial color="#aaa" roughness={.8}/>
      </Box>
      {/* eyes */}
      <Box args={[.1,.1,.04]} position={[-.16,1.0,.89]}><meshStandardMaterial color="#1a0a00"/></Box>
      <Box args={[.1,.1,.04]} position={[.16,1.0,.89]}><meshStandardMaterial color="#1a0a00"/></Box>
      {/* ears */}
      <Box args={[.14,.18,.08]} position={[-.18,1.24,.64]} rotation={[0,0,.25]}>
        <meshStandardMaterial color="#888" roughness={.9}/>
      </Box>
      <Box args={[.14,.18,.08]} position={[.18,1.24,.64]} rotation={[0,0,-.25]}>
        <meshStandardMaterial color="#888" roughness={.9}/>
      </Box>
      {/* white belly */}
      <Box args={[.4,.42,.88]} position={[0,.54,0]}>
        <meshStandardMaterial color="#d0d0d0" roughness={.9}/>
      </Box>
      {/* tail */}
      <mesh ref={tail} position={[0,.72,-.55]}>
        <boxGeometry args={[.18,.18,.55]}/>
        <meshStandardMaterial color="#9333ea" roughness={.8}/>
      </mesh>
      {/* legs */}
      <mesh ref={legFL} position={[-.2,.3,.35]}>
        <boxGeometry args={[.22,.5,.22]}/><meshStandardMaterial color="#888" roughness={.85}/>
      </mesh>
      <mesh ref={legFR} position={[.2,.3,.35]}>
        <boxGeometry args={[.22,.5,.22]}/><meshStandardMaterial color="#888" roughness={.85}/>
      </mesh>
      <mesh ref={legBL} position={[-.2,.3,-.35]}>
        <boxGeometry args={[.22,.5,.22]}/><meshStandardMaterial color="#888" roughness={.85}/>
      </mesh>
      <mesh ref={legBR} position={[.2,.3,-.35]}>
        <boxGeometry args={[.22,.5,.22]}/><meshStandardMaterial color="#888" roughness={.85}/>
      </mesh>
    </group>
  );
}

/* ══ FOX ══ */
function Fox({ startPos }: { startPos: [number,number,number] }) {
  const off   = useMemo(() => Math.random() * Math.PI * 2, []);
  const speed = useMemo(() => .45 + Math.random() * .3, []);
  const group = useMob(startPos, speed, 3.5, off);
  const legFL = useRef<THREE.Mesh>(null);
  const legFR = useRef<THREE.Mesh>(null);
  const legBL = useRef<THREE.Mesh>(null);
  const legBR = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (legFL.current) legFL.current.rotation.x =  Math.sin(t * speed * 4 + off) * .55;
    if (legFR.current) legFR.current.rotation.x = -Math.sin(t * speed * 4 + off) * .55;
    if (legBL.current) legBL.current.rotation.x = -Math.sin(t * speed * 4 + off) * .55;
    if (legBR.current) legBR.current.rotation.x =  Math.sin(t * speed * 4 + off) * .55;
  });

  return (
    <group ref={group} position={startPos} scale={1.9}>
      <Box args={[.48,.48,.88]} position={[0,.58,0]}>
        <meshStandardMaterial color="#e07820" roughness={.8}/>
      </Box>
      {/* head */}
      <Box args={[.52,.46,.5]} position={[0,.9,.52]}>
        <meshStandardMaterial color="#e07820" roughness={.8}/>
      </Box>
      {/* pointy snout */}
      <Box args={[.24,.2,.36]} position={[0,.76,.8]}>
        <meshStandardMaterial color="#cc6010" roughness={.8}/>
      </Box>
      {/* nose */}
      <Box args={[.1,.1,.06]} position={[0,.76,.99]}><meshStandardMaterial color="#111"/></Box>
      {/* eyes */}
      <Box args={[.1,.1,.04]} position={[-.16,.96,.78]}><meshStandardMaterial color="#1a0a00"/></Box>
      <Box args={[.1,.1,.04]} position={[.16,.96,.78]}><meshStandardMaterial color="#1a0a00"/></Box>
      {/* pointy ears */}
      <Box args={[.14,.26,.06]} position={[-.2,1.22,.6]} rotation={[0,0,.2]}>
        <meshStandardMaterial color="#e07820" roughness={.8}/>
      </Box>
      <Box args={[.14,.26,.06]} position={[.2,1.22,.6]} rotation={[0,0,-.2]}>
        <meshStandardMaterial color="#e07820" roughness={.8}/>
      </Box>
      {/* white chest */}
      <Box args={[.34,.36,.78]} position={[0,.52,0]}>
        <meshStandardMaterial color="#f0e0c0" roughness={.85}/>
      </Box>
      {/* tail — purple tipped */}
      <Box args={[.2,.2,.6]} position={[0,.62,-.54]}>
        <meshStandardMaterial color="#e07820" roughness={.8}/>
      </Box>
      <Box args={[.22,.22,.22]} position={[0,.64,-.85]}>
        <meshStandardMaterial color="#f5f5f5" roughness={.8}/>
      </Box>
      {/* legs */}
      <mesh ref={legFL} position={[-.18,.26,.3]}>
        <boxGeometry args={[.18,.44,.18]}/><meshStandardMaterial color="#e07820" roughness={.8}/>
      </mesh>
      <mesh ref={legFR} position={[.18,.26,.3]}>
        <boxGeometry args={[.18,.44,.18]}/><meshStandardMaterial color="#e07820" roughness={.8}/>
      </mesh>
      <mesh ref={legBL} position={[-.18,.26,-.3]}>
        <boxGeometry args={[.18,.44,.18]}/><meshStandardMaterial color="#e07820" roughness={.8}/>
      </mesh>
      <mesh ref={legBR} position={[.18,.26,-.3]}>
        <boxGeometry args={[.18,.44,.18]}/><meshStandardMaterial color="#e07820" roughness={.8}/>
      </mesh>
    </group>
  );
}

/* ══ CHICKEN ══ */
function Chicken({ startPos }: { startPos: [number,number,number] }) {
  const off   = useMemo(() => Math.random() * Math.PI * 2, []);
  const speed = useMemo(() => .55 + Math.random() * .4, []);
  const group = useMob(startPos, speed, 3, off);
  const legL  = useRef<THREE.Mesh>(null);
  const legR  = useRef<THREE.Mesh>(null);
  const head  = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (legL.current) legL.current.rotation.x =  Math.sin(t * speed * 5 + off) * .7;
    if (legR.current) legR.current.rotation.x = -Math.sin(t * speed * 5 + off) * .7;
    // head bob
    if (head.current) {
      head.current.position.z = .38 + Math.abs(Math.sin(t * speed * 5 + off)) * .12;
    }
  });

  return (
    <group ref={group} position={startPos} scale={1.8}>
      {/* body */}
      <Box args={[.52,.5,.7]} position={[0,.58,0]}>
        <meshStandardMaterial color="#f5f5f0" roughness={.85}/>
      </Box>
      {/* wing tufts */}
      <Box args={[.62,.28,.5]} position={[0,.62,0]}>
        <meshStandardMaterial color="#e8e8e0" roughness={.9}/>
      </Box>
      {/* head */}
      <group ref={head} position={[0,.92,.38]}>
        <Box args={[.38,.38,.38]} position={[0,0,0]}>
          <meshStandardMaterial color="#f5f5f0" roughness={.8}/>
        </Box>
        {/* beak */}
        <Box args={[.1,.12,.18]} position={[0,-.04,.28]}>
          <meshStandardMaterial color="#f59e0b" roughness={.7}/>
        </Box>
        {/* wattle */}
        <Box args={[.08,.14,.06]} position={[0,-.14,.22]}>
          <meshStandardMaterial color="#ef4444" roughness={.7}/>
        </Box>
        {/* comb */}
        <Box args={[.08,.18,.14]} position={[0,.24,.04]}>
          <meshStandardMaterial color="#ef4444" roughness={.7}/>
        </Box>
        {/* eyes */}
        <Box args={[.08,.08,.04]} position={[-.19,.06,.18]}><meshStandardMaterial color="#111"/></Box>
        <Box args={[.08,.08,.04]} position={[.19,.06,.18]}><meshStandardMaterial color="#111"/></Box>
      </group>
      {/* legs */}
      <mesh ref={legL} position={[-.14,.17,0]}>
        <boxGeometry args={[.12,.44,.12]}/><meshStandardMaterial color="#f59e0b" roughness={.7}/>
      </mesh>
      <mesh ref={legR} position={[.14,.17,0]}>
        <boxGeometry args={[.12,.44,.12]}/><meshStandardMaterial color="#f59e0b" roughness={.7}/>
      </mesh>
    </group>
  );
}

/* ══ SKELETON ══ */
function Skeleton({ startPos }: { startPos: [number,number,number] }) {
  const off   = useMemo(() => Math.random() * Math.PI * 2, []);
  const speed = useMemo(() => .22 + Math.random() * .18, []);
  const group = useMob(startPos, speed, 4.5, off);
  const legL  = useRef<THREE.Mesh>(null);
  const legR  = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (legL.current) legL.current.rotation.x =  Math.sin(t * speed * 3 + off) * .5;
    if (legR.current) legR.current.rotation.x = -Math.sin(t * speed * 3 + off) * .5;
  });

  return (
    <group ref={group} position={startPos} scale={2.15}>
      <Box args={[.72,.78,.66]} position={[0,1.95,0]}>
        <meshStandardMaterial color="#ddddd0" roughness={.7}/>
      </Box>
      <Box args={[.22,.22,.06]} position={[-.2,2.04,.34]}><meshStandardMaterial color="#111"/></Box>
      <Box args={[.22,.22,.06]} position={[.2,2.04,.34]}><meshStandardMaterial color="#111"/></Box>
      <Box args={[.56,.95,.26]} position={[0,1.0,0]}>
        <meshStandardMaterial color="#ddddd0" roughness={.75}/>
      </Box>
      <Box args={[.24,.92,.24]} position={[-.44,1.1,0]}><meshStandardMaterial color="#ddddd0" roughness={.75}/></Box>
      <Box args={[.24,.92,.24]} position={[.44,1.1,0]}><meshStandardMaterial color="#ddddd0" roughness={.75}/></Box>
      <mesh ref={legL} position={[-.18,.22,0]}>
        <boxGeometry args={[.24,.72,.24]}/><meshStandardMaterial color="#ddddd0" roughness={.75}/>
      </mesh>
      <mesh ref={legR} position={[.18,.22,0]}>
        <boxGeometry args={[.24,.72,.24]}/><meshStandardMaterial color="#ddddd0" roughness={.75}/>
      </mesh>
    </group>
  );
}

/* ══ Purple particle orbs ══ */
function Orb({ pos }: { pos: [number,number,number] }) {
  const ref = useRef<THREE.Mesh>(null);
  const off = useMemo(() => Math.random() * Math.PI * 2, []);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = pos[1] + Math.sin(t * 1.8 + off) * .4;
    ref.current.position.x = pos[0] + Math.cos(t * 1.2 + off) * .3;
    const s = .7 + Math.sin(t * 3 + off) * .3;
    ref.current.scale.setScalar(s);
    (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 2 + Math.sin(t * 5 + off);
  });
  return (
    <mesh ref={ref} position={pos}>
      <sphereGeometry args={[.1, 8, 8]}/>
      <meshStandardMaterial color="#9333ea" emissive="#9333ea" emissiveIntensity={3} roughness={0}/>
    </mesh>
  );
}

/* ══ SCENE ══ */
export function HeroBlocks() {
  return (
    <Canvas className="absolute inset-0" camera={{ position: [0, 2.5, 11], fov: 75 }} gl={{ antialias: true, alpha: true }}>
      {/* bright front lighting so mobs are clearly visible */}
      <ambientLight intensity={1.2} color="#ffffff" />
      <pointLight position={[0, 5, 8]}   intensity={18}  color="#ffffff" />
      <pointLight position={[-6, 3, 6]}  intensity={12}  color="#c084fc" />
      <pointLight position={[6, 3, 6]}   intensity={12}  color="#9333ea" />
      <pointLight position={[0, -2, 7]}  intensity={8}   color="#7c3aed" />
      <pointLight position={[10, 1, 4]}  intensity={6}   color="#a855f7" />
      <pointLight position={[-10, 1, 4]} intensity={6}   color="#7c3aed" />
      <pointLight position={[0, 8, 3]}   intensity={10}  color="#c026d3" />

      {/* Mobs — pulled toward center so vignette doesn't hide them */}
      <Creeper  startPos={[-4.5,  0.0,  2]} />
      <Creeper  startPos={[ 3.5, -0.2,  1]} />
      <Creeper  startPos={[ 0,    0.0, -1]} />
      <Zombie   startPos={[-2.0, -0.1,  2]} />
      <Zombie   startPos={[ 5,    0.1,  1]} />
      <Enderman startPos={[-5.5,  1.8,  0]} />
      <Enderman startPos={[ 4.5,  1.9,  1]} />
      <Skeleton startPos={[ 1.5,  0.0,  1]} />
      <Skeleton startPos={[-3.5,  0.0,  0]} />
      <Wolf     startPos={[-1.0, -0.3,  2]} />
      <Wolf     startPos={[ 6,   -0.1,  0]} />
      <Fox      startPos={[ 3,   -0.4,  2]} />
      <Fox      startPos={[-4.0, -0.2,  1]} />
      <Chicken  startPos={[ 0.5, -0.5,  3]} />
      <Chicken  startPos={[-2.5, -0.4,  2]} />
      <Chicken  startPos={[ 5,   -0.5,  0]} />

      {/* Floating purple orbs */}
      {([[-5,3,-2],[4,4,-3],[-2,4,-3],[7,2,-2],[-8,1,-2],[3,-1,-2],[0,5,-3],[-6,-1,-2],[9,3,-3]] as [number,number,number][]).map((p,i) => (
        <Orb key={i} pos={p} />
      ))}
    </Canvas>
  );
}
