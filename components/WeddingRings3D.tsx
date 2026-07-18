'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Link2, Unlink } from 'lucide-react';

type RingMode = 'joined' | 'separated';

const JOINED = {
  a: {
    pos: new THREE.Vector3(-0.38, 0, 0),
    rot: new THREE.Euler(Math.PI / 2.35, 0, -0.35),
  },
  b: {
    pos: new THREE.Vector3(0.38, 0, 0),
    rot: new THREE.Euler(Math.PI / 2.35, 0, 0.35),
  },
};

const SEPARATED = {
  a: {
    pos: new THREE.Vector3(-1.45, 0.05, 0),
    rot: new THREE.Euler(Math.PI / 2, 0.15, -0.08),
  },
  b: {
    pos: new THREE.Vector3(1.45, 0.05, 0),
    rot: new THREE.Euler(Math.PI / 2, -0.15, 0.08),
  },
};

function lerpEuler(current: THREE.Euler, target: THREE.Euler, alpha: number) {
  current.x += (target.x - current.x) * alpha;
  current.y += (target.y - current.y) * alpha;
  current.z += (target.z - current.z) * alpha;
}

function isMobileDevice() {
  if (typeof window === 'undefined') return true;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const narrow = window.matchMedia('(max-width: 768px)').matches;
  const saveData =
    'connection' in navigator &&
    Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
  const lowCpu = (navigator.hardwareConcurrency || 4) <= 4;
  return coarse || narrow || saveData || lowCpu;
}

/** Mobil uchun engil 3D uzuklar */
export default function WeddingRings3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<RingMode>('joined');
  const modeRef = useRef<RingMode>('joined');

  const setRingMode = (next: RingMode) => {
    modeRef.current = next;
    setMode(next);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mobile = isMobileDevice();
    const width = container.clientWidth || 280;
    const height = container.clientHeight || 220;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(1.4, 1.0, 4.0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !mobile,
      alpha: true,
      powerPreference: mobile ? 'low-power' : 'high-performance',
      stencil: false,
      depth: true,
    });
    // Mobil: pastroq pixel ratio — asosiy tezlik yutug‘i
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.75));
    renderer.setSize(width, height, false);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.domElement.style.touchAction = 'none';
    renderer.domElement.style.cursor = 'grab';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = mobile ? 0.12 : 0.08;
    controls.enablePan = false;
    controls.enableZoom = !mobile;
    controls.minDistance = 3.2;
    controls.maxDistance = 7.2;
    controls.minPolarAngle = 0.35;
    controls.maxPolarAngle = Math.PI - 0.45;
    controls.autoRotate = true;
    controls.autoRotateSpeed = mobile ? 1.0 : 1.4;
    controls.rotateSpeed = 0.85;
    controls.target.set(0, 0.05, 0);
    controls.update();

    // Env map faqat desktop (PMREM og‘ir)
    let envTex: THREE.Texture | null = null;
    if (!mobile) {
      const pmrem = new THREE.PMREMGenerator(renderer);
      envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTex;
      pmrem.dispose();
    }

    // Kamroq chiroq
    scene.add(new THREE.AmbientLight(0xffe8c0, mobile ? 0.85 : 0.55));
    const key = new THREE.DirectionalLight(0xffd89a, mobile ? 1.8 : 1.55);
    key.position.set(3, 5, 2.8);
    scene.add(key);
    if (!mobile) {
      const fill = new THREE.DirectionalLight(0xffc978, 0.7);
      fill.position.set(-3.2, 2, 1.2);
      scene.add(fill);
      scene.add(new THREE.HemisphereLight(0xfff0d8, 0xb8955a, 0.45));
    }

    // StandardMaterial — Physical dan ancha engil
    const goldMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#c9a227'),
      metalness: 0.92,
      roughness: 0.3,
      envMapIntensity: mobile ? 0.55 : 0.85,
    });
    const antiqueGoldMat = goldMat.clone();
    antiqueGoldMat.color = new THREE.Color('#b8860b');
    antiqueGoldMat.roughness = 0.34;

    const tubular = mobile ? 20 : 48;
    const radial = mobile ? 48 : 100;
    const ringGeo = new THREE.TorusGeometry(1.05, 0.145, tubular, radial);

    const ringA = new THREE.Mesh(ringGeo, goldMat);
    ringA.position.copy(JOINED.a.pos);
    ringA.rotation.copy(JOINED.a.rot);

    const ringB = new THREE.Mesh(ringGeo, antiqueGoldMat);
    ringB.position.copy(JOINED.b.pos);
    ringB.rotation.copy(JOINED.b.rot);

    // Oddiy olmos (transmission yo‘q — mobil uchun muhim)
    const diamondGeo = new THREE.OctahedronGeometry(0.2, 0);
    diamondGeo.scale(1, 1.4, 1);
    const diamondMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#eef8ff'),
      metalness: 0.15,
      roughness: 0.08,
      transparent: true,
      opacity: 0.92,
      envMapIntensity: 1.1,
    });
    const diamond = new THREE.Mesh(diamondGeo, diamondMat);
    diamond.position.set(0, 1.18, 0);
    ringA.add(diamond);

    const group = new THREE.Group();
    group.add(ringA, ringB);
    group.rotation.x = 0.12;
    scene.add(group);

    const glowGeo = new THREE.CircleGeometry(1.7, mobile ? 24 : 40);
    const glowMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#c9a227'),
      transparent: true,
      opacity: 0.14,
      depthWrite: false,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = -1.35;
    scene.add(glow);

    let resumeTimer: ReturnType<typeof setTimeout> | null = null;
    let visible = true;
    let pageVisible = true;

    const pauseAutoRotate = () => {
      controls.autoRotate = false;
      renderer.domElement.style.cursor = 'grabbing';
      if (resumeTimer) clearTimeout(resumeTimer);
    };

    const scheduleResume = () => {
      renderer.domElement.style.cursor = 'grab';
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        controls.autoRotate = true;
      }, 2200);
    };

    controls.addEventListener('start', pauseAutoRotate);
    controls.addEventListener('end', scheduleResume);

    const stopBubble = (e: Event) => e.stopPropagation();
    renderer.domElement.addEventListener('pointerdown', stopBubble);
    renderer.domElement.addEventListener('touchstart', stopBubble, { passive: true });

    let lastTap = 0;
    const onPointerUp = () => {
      const now = Date.now();
      if (now - lastTap < 320) {
        const next = modeRef.current === 'joined' ? 'separated' : 'joined';
        modeRef.current = next;
        setMode(next);
        pauseAutoRotate();
        scheduleResume();
      }
      lastTap = now;
    };
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    const onVisibility = () => {
      pageVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', onVisibility);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.15 }
    );
    io.observe(container);

    let frame = 0;
    let disposed = false;
    let lastRender = 0;
    const minFrameMs = mobile ? 1000 / 30 : 1000 / 60; // mobil: 30 FPS
    const ease = 0.08;

    const animate = (now: number) => {
      if (disposed) return;
      frame = requestAnimationFrame(animate);

      if (!visible || !pageVisible) return;
      if (now - lastRender < minFrameMs) return;
      lastRender = now;

      const pose = modeRef.current === 'joined' ? JOINED : SEPARATED;
      ringA.position.lerp(pose.a.pos, ease);
      ringB.position.lerp(pose.b.pos, ease);
      lerpEuler(ringA.rotation, pose.a.rot, ease);
      lerpEuler(ringB.rotation, pose.b.rot, ease);

      const glowTarget = modeRef.current === 'joined' ? 1 : 2.4 / 1.7;
      glow.scale.x += (glowTarget - glow.scale.x) * ease;
      glow.scale.y = glow.scale.x;
      glow.scale.z = glow.scale.x;

      controls.update();
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(animate);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 280;
      const h = container.clientHeight || 220;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      if (resumeTimer) clearTimeout(resumeTimer);
      document.removeEventListener('visibilitychange', onVisibility);
      io.disconnect();
      controls.removeEventListener('start', pauseAutoRotate);
      controls.removeEventListener('end', scheduleResume);
      renderer.domElement.removeEventListener('pointerdown', stopBubble);
      renderer.domElement.removeEventListener('touchstart', stopBubble);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      ro.disconnect();
      controls.dispose();
      ringGeo.dispose();
      diamondGeo.dispose();
      glowGeo.dispose();
      goldMat.dispose();
      antiqueGoldMat.dispose();
      diamondMat.dispose();
      glowMat.dispose();
      envTex?.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative z-10 w-full h-full flex flex-col" style={{ isolation: 'isolate' }}>
      <div
        ref={containerRef}
        className="wedding-rings-3d-root relative flex-1 w-full min-h-[180px] sm:min-h-[210px] overflow-visible bg-transparent touch-none"
        onPointerDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        role="img"
        aria-label="3D nikoh uzuklari"
      />

      <div
        className="relative z-20 flex items-center justify-center gap-2 mt-1 pointer-events-auto"
        onPointerDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setRingMode('joined')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-sans font-semibold uppercase tracking-[0.12em] transition-all cursor-pointer border ${
            mode === 'joined'
              ? 'bg-gradient-to-r from-[#b8860b] to-[#c9a227] text-white border-white/20 shadow-md shadow-primary-gold/25'
              : 'bg-white/90 text-stone-500 border-stone-200 hover:border-primary-gold/40'
          }`}
        >
          <Link2 className="w-3.5 h-3.5" />
          Birlashtirish
        </button>
        <button
          type="button"
          onClick={() => setRingMode('separated')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-sans font-semibold uppercase tracking-[0.12em] transition-all cursor-pointer border ${
            mode === 'separated'
              ? 'bg-gradient-to-r from-[#b8860b] to-[#c9a227] text-white border-white/20 shadow-md shadow-primary-gold/25'
              : 'bg-white/90 text-stone-500 border-stone-200 hover:border-primary-gold/40'
          }`}
        >
          <Unlink className="w-3.5 h-3.5" />
          Ajratish
        </button>
      </div>

      <p className="mt-1 text-center text-[9px] uppercase tracking-[0.14em] text-stone-400 font-sans pointer-events-none">
        Aylantiring · ikki marta bosing
      </p>
    </div>
  );
}
