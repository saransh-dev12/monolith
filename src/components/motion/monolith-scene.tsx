"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type {
  Group,
  InstancedMesh,
  PointLight,
  Points as ThreePoints,
} from "three";
import {
  AdditiveBlending,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  EdgesGeometry,
  LineBasicMaterial,
  MathUtils,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PointsMaterial,
} from "three";

import { useReducedMotion } from "@/components/motion/use-reduced-motion";

const EMBER = new Color("#ff5429");
const EMBER_SOFT = new Color("#ff9c76");
const OBSIDIAN = "#0b0b0a";

// Module-scene singletons: the animated materials live for the page session
// (one fixed canvas), so useFrame can mutate them freely.
const edgeMaterial = new LineBasicMaterial({
  color: EMBER,
  transparent: true,
  opacity: 0.95,
  toneMapped: false,
});
const edgeHaloMaterial = new LineBasicMaterial({
  color: EMBER,
  transparent: true,
  opacity: 0.3,
  toneMapped: false,
});
const seamMaterial = new MeshBasicMaterial({
  color: EMBER,
  transparent: true,
  opacity: 0.95,
  toneMapped: false,
});

type PointerRef = { current: { x: number; y: number } };
type JourneyRef = { current: { story: number; tour: number; cta: number } };

type Pose = {
  x: number;
  y: number;
  scale: number;
  rotY: number;
  edge: number;
  seam: number;
};

// The journey: hero → workflow → product tour → CTA payoff.
const POSES: Record<"hero" | "story" | "tour" | "cta", Pose> = {
  hero: { x: -2.35, y: -0.2, scale: 1.05, rotY: -0.55, edge: 0.9, seam: 0.95 },
  story: { x: -5.4, y: -0.4, scale: 0.82, rotY: -1.5, edge: 0.45, seam: 0.4 },
  tour: { x: 4.7, y: -0.1, scale: 0.9, rotY: -0.85, edge: 0.7, seam: 0.7 },
  cta: { x: 0, y: -2.7, scale: 1.42, rotY: -0.2, edge: 1, seam: 1 },
};

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function lerpPose(a: Pose, b: Pose, t: number): Pose {
  return {
    x: MathUtils.lerp(a.x, b.x, t),
    y: MathUtils.lerp(a.y, b.y, t),
    scale: MathUtils.lerp(a.scale, b.scale, t),
    rotY: MathUtils.lerp(a.rotY, b.rotY, t),
    edge: MathUtils.lerp(a.edge, b.edge, t),
    seam: MathUtils.lerp(a.seam, b.seam, t),
  };
}

function poseAt(journey: { story: number; tour: number; cta: number }): Pose {
  const p1 = smoothstep(0.08, 0.45, journey.story);
  const p2 = smoothstep(0.06, 0.4, journey.tour);
  const p3 = smoothstep(0.04, 0.32, journey.cta);
  return lerpPose(lerpPose(lerpPose(POSES.hero, POSES.story, p1), POSES.tour, p2), POSES.cta, p3);
}

/** 1 : 4 : 9 — the proportions. Obsidian slab with razor ember edges. */
function Monolith({
  journeyRef,
  pointerRef,
  reduce,
  shardSpreadRef,
}: {
  journeyRef: JourneyRef;
  pointerRef: PointerRef;
  reduce: boolean;
  shardSpreadRef: { current: number };
}) {
  const group = useRef<Group>(null);
  const spin = useRef(0);

  const edgeGeometry = useMemo(() => {
    const box = new BoxGeometry(1.5, 6.1, 0.4);
    const edgesGeo = new EdgesGeometry(box);
    box.dispose();
    return edgesGeo;
  }, []);

  useEffect(() => {
    return () => {
      edgeGeometry.dispose();
    };
  }, [edgeGeometry]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const pose = poseAt(journeyRef.current);
    const pointer = pointerRef.current;
    const t = state.clock.elapsedTime;

    spin.current += delta * (reduce ? 0 : 0.055);
    const targetY = spin.current + pose.rotY + pointer.x * 0.12;
    const targetX = (reduce ? 0 : Math.sin(t * 0.32) * 0.02) + pointer.y * 0.06;

    shardSpreadRef.current = pose.scale < 1 ? 1.25 : 1;

    if (reduce) {
      g.position.set(pose.x, pose.y, 0);
      g.scale.setScalar(pose.scale);
      g.rotation.set(targetX, targetY, 0);
      return;
    }

    g.position.x = MathUtils.damp(g.position.x, pose.x + pointer.x * 0.22, 1.8, delta);
    g.position.y = MathUtils.damp(
      g.position.y,
      pose.y + Math.sin(t * 0.55) * 0.14,
      1.8,
      delta,
    );
    g.scale.setScalar(MathUtils.damp(g.scale.x, pose.scale, 1.8, delta));
    g.rotation.y = MathUtils.damp(g.rotation.y, targetY, 2.2, delta);
    g.rotation.x = MathUtils.damp(g.rotation.x, targetX, 2.2, delta);

    edgeMaterial.opacity = MathUtils.damp(edgeMaterial.opacity, pose.edge, 2.4, delta);
    edgeHaloMaterial.opacity = MathUtils.damp(
      edgeHaloMaterial.opacity,
      pose.edge * 0.35,
      2.4,
      delta,
    );
    seamMaterial.opacity = MathUtils.damp(seamMaterial.opacity, pose.seam, 2.4, delta);
  });

  return (
    <group ref={group} position={[POSES.hero.x, POSES.hero.y, 0]} rotation={[0, POSES.hero.rotY, 0]}>
      <mesh>
        <boxGeometry args={[1.5, 6.1, 0.4]} />
        <meshStandardMaterial
          color={OBSIDIAN}
          metalness={0.55}
          roughness={0.34}
          envMapIntensity={0.6}
        />
      </mesh>
      {/* Double ember edge — a bold rim with a soft halo */}
      <lineSegments geometry={edgeGeometry} material={edgeMaterial} scale={1.002} />
      <lineSegments geometry={edgeGeometry} material={edgeHaloMaterial} scale={1.007} />
      {/* Molten core seam behind the slab */}
      <mesh position={[0, 0, -0.24]} material={seamMaterial}>
        <boxGeometry args={[0.07, 5.6, 0.05]} />
      </mesh>
    </group>
  );
}

/** Orbiting obsidian shards. The spread breathes with the journey. */
function Shards({
  reduce,
  shardSpreadRef,
}: {
  reduce: boolean;
  shardSpreadRef: { current: number };
}) {
  const mesh = useRef<InstancedMesh>(null);
  const COUNT = 42;

  const shards = useMemo(() => {
    const dummy = new Object3D();
    return Array.from({ length: COUNT }, (_, i) => {
      const rng = (seed: number) => {
        const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
        return x - Math.floor(x);
      };
      const angle = rng(1) * Math.PI * 2;
      return {
        angle,
        radius: 2.6 + rng(2) * 3.4,
        y: (rng(3) - 0.5) * 5.4,
        scale: 0.05 + rng(4) * 0.22,
        speed: 0.04 + rng(5) * 0.1,
        wobble: rng(6) * Math.PI * 2,
        tilt: (rng(7) - 0.5) * 0.7,
        dummy,
      };
    });
  }, []);

  const geometry = useMemo(() => new BoxGeometry(1, 1, 0.42), []);
  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        color: OBSIDIAN,
        metalness: 0.5,
        roughness: 0.4,
      }),
    [],
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const spread = shardSpreadRef.current;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < shards.length; i++) {
      const s = shards[i];
      const drift = reduce ? 0 : t * s.speed;
      const a = s.angle + drift;
      const radius = s.radius * spread;
      s.dummy.position.set(
        Math.cos(a) * radius,
        s.y + (reduce ? 0 : Math.sin(t * 0.5 + s.wobble) * 0.16),
        Math.sin(a) * radius * 0.6 - 1.2,
      );
      s.dummy.rotation.set(
        a * 1.4 + s.tilt,
        a * 0.9,
        reduce ? s.tilt : t * s.speed * 1.6,
      );
      s.dummy.scale.setScalar(s.scale);
      s.dummy.updateMatrix();
      m.setMatrixAt(i, s.dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={mesh} args={[geometry, material, COUNT]} />;
}

/** Deterministic pseudo-random so the field is stable across renders. */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** Ember dust. Cheap additive points, slow rise. */
function Dust({ reduce }: { reduce: boolean }) {
  const points = useRef<ThreePoints>(null);
  const COUNT = 240;

  const geometry = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (seededRandom(i * 3 + 1) - 0.5) * 14;
      positions[i * 3 + 1] = (seededRandom(i * 3 + 2) - 0.5) * 9;
      positions[i * 3 + 2] = (seededRandom(i * 3 + 3) - 0.5) * 6 - 1;
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(positions, 3));
    return geo;
  }, []);

  const material = useMemo(
    () =>
      new PointsMaterial({
        color: EMBER_SOFT,
        size: 0.035,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.55,
        blending: AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((state) => {
    const p = points.current;
    if (!p || reduce) return;
    const t = state.clock.elapsedTime;
    p.rotation.y = t * 0.014;
    p.position.y = (t * 0.05) % 0.8;
  });

  return <points ref={points} geometry={geometry} material={material} />;
}

function SceneContent({
  journeyRef,
  pointerRef,
  reduce,
}: {
  journeyRef: JourneyRef;
  pointerRef: PointerRef;
  reduce: boolean;
}) {
  const emberKey = useRef<PointLight>(null);
  const shardSpreadRef = useRef(1);

  useFrame((state, delta) => {
    // The key light breathes — the structure is never fully still.
    if (emberKey.current && !reduce) {
      emberKey.current.intensity =
        55 + Math.sin(state.clock.elapsedTime * 0.7) * 9;
    }
    // Camera pulls back slightly as the CTA approaches.
    const pose = poseAt(journeyRef.current);
    const camera = state.camera;
    camera.position.z = MathUtils.damp(
      camera.position.z,
      9.6 + pose.scale * 0.6,
      1.4,
      delta,
    );
  });

  return (
    <>
      <ambientLight intensity={0.3} color="#2a1a14" />
      {/* Warm-white front-left key: separates the two faces */}
      <directionalLight position={[-7, 3, 6]} intensity={0.95} color="#f4f0e8" />
      {/* Ember rakes the right face */}
      <directionalLight position={[8, -1, 2]} intensity={1.5} color={EMBER} />
      {/* Ember rim from behind — the burning edge */}
      <pointLight
        ref={emberKey}
        position={[2.6, 3.4, -1.2]}
        intensity={55}
        distance={24}
        decay={2}
        color={EMBER}
      />
      <pointLight
        position={[-5, -2.2, 2.4]}
        intensity={13}
        distance={18}
        decay={2}
        color={EMBER_SOFT}
      />
      <directionalLight position={[7, 2, -6]} intensity={0.6} color={EMBER} />
      <Monolith
        journeyRef={journeyRef}
        pointerRef={pointerRef}
        reduce={reduce}
        shardSpreadRef={shardSpreadRef}
      />
      <Shards reduce={reduce} shardSpreadRef={shardSpreadRef} />
      <Dust reduce={reduce} />
    </>
  );
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function MonolithScene() {
  const reduce = useReducedMotion();
  const [supported, setSupported] = useState(true);
  const [pageHidden, setPageHidden] = useState(false);
  const journeyRef = useRef({ story: 0, tour: 0, cta: 0 });
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setSupported(hasWebGL()));
    return () => window.cancelAnimationFrame(id);
  }, []);

  // Journey progress from the real section positions.
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const vh = window.innerHeight;
      const seg = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        return MathUtils.clamp((vh - rect.top) / (vh + rect.height), 0, 1);
      };
      journeyRef.current = {
        story: seg("story"),
        tour: seg("product"),
        cta: seg("start"),
      };
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  // Pointer parallax on window so the canvas stays pointer-events-none.
  useEffect(() => {
    if (reduce) return;
    const onMove = (event: PointerEvent) => {
      pointerRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -((event.clientY / window.innerHeight) * 2 - 1),
      };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce]);

  // One fixed canvas is always in the viewport: gate on tab visibility only.
  useEffect(() => {
    const onVisibility = () => setPageHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  if (!supported) return null;

  return (
    <Canvas
      frameloop={pageHidden ? "never" : reduce ? "demand" : "always"}
      dpr={[1, 1.75]}
      camera={{ fov: 40, position: [0, 0.3, 9.6] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent", pointerEvents: "none" }}
    >
      <SceneContent journeyRef={journeyRef} pointerRef={pointerRef} reduce={Boolean(reduce)} />
    </Canvas>
  );
}
