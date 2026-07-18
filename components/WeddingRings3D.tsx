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

/** Faqat haqiqiy kichik telefon / save-data */
function isPhone() {
  if (typeof window === 'undefined') return false;
  const narrow = window.matchMedia('(max-width: 640px)').matches;
  const saveData =
    'connection' in navigator &&
    Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
  return narrow || saveData;
}

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

    const phone = isPhone();
    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    // Telefon: to‘g‘ridan-to‘g‘ri, markazlangan, yaqinroq — chiroyli kadr
    camera.position.set(phone ? 0.55 : 1.35, phone ? 0.85 : 1.05, phone ? 3.55 : 4.0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, phone ? 1.75 : 2));
    renderer.setSize(width, height, false);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    renderer.domElement.style.touchAction = 'none';
    renderer.domElement.style.cursor = 'grab';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.09;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minDistance = 2.8;
    controls.maxDistance = 6.5;
    controls.minPolarAngle = 0.4;
    controls.maxPolarAngle = Math.PI - 0.5;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.15;
    controls.rotateSpeed = 0.9;
    controls.zoomSpeed = 0.65;
    controls.target.set(0, 0.08, 0);
    controls.update();

    // Env map — oltin metall uchun majburiy (telefonda ham)
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), phone ? 0.08 : 0.04).texture;
    scene.environment = envTex;
    pmrem.dispose();

    scene.add(new THREE.AmbientLight(0xfff0d8, 0.62));
    const key = new THREE.DirectionalLight(0xffe2a8, 1.75);
    key.position.set(2.8, 4.8, 3);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffd27a, 0.85);
    fill.position.set(-3, 2.2, 1.4);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xfff6e0, 0.7);
    rim.position.set(0, -0.5, 4);
    scene.add(rim);
    scene.add(new THREE.HemisphereLight(0xfff8ec, 0xc4a35a, 0.5));
    const spark = new THREE.PointLight(0xfff0c0, 1.3, 10);
    spark.position.set(0.4, 1.6, 2.2);
    scene.add(spark);

    const goldMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#d4af37'),
      metalness: 1,
      roughness: 0.22,
      clearcoat: 0.55,
      clearcoatRoughness: 0.15,
      envMapIntensity: 1.15,
      sheen: 0.25,
      sheenColor: new THREE.Color('#ffe7a0'),
      sheenRoughness: 0.45,
    });

    const antiqueGoldMat = goldMat.clone();
    antiqueGoldMat.color = new THREE.Color('#c49a1a');
    antiqueGoldMat.roughness = 0.26;
    antiqueGoldMat.envMapIntensity = 1.05;

    const tubular = phone ? 36 : 56;
    const radial = phone ? 80 : 120;
    const ringGeo = new THREE.TorusGeometry(1.05, 0.148, tubular, radial);

    const ringA = new THREE.Mesh(ringGeo, goldMat);
    ringA.position.copy(JOINED.a.pos);
    ringA.rotation.copy(JOINED.a.rot);

    const ringB = new THREE.Mesh(ringGeo, antiqueGoldMat);
    ringB.position.copy(JOINED.b.pos);
    ringB.rotation.copy(JOINED.b.rot);

    const diamondGeo = new THREE.OctahedronGeometry(0.2, 0);
    diamondGeo.scale(1, 1.4, 1);
    const diamondMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#ffffff'),
      metalness: 0.05,
      roughness: 0.04,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      transparent: true,
      opacity: 0.88,
      envMapIntensity: 1.6,
      // transmission o‘chirilgan — telefonda sekin va xira chiqardi
    });
    const diamond = new THREE.Mesh(diamondGeo, diamondMat);
    diamond.position.set(0, 1.18, 0);
    ringA.add(diamond);

    const sparkleGeo = new THREE.SphereGeometry(0.028, 10, 10);
    const sparkleMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
    });
    const sparkle = new THREE.Mesh(sparkleGeo, sparkleMat);
    sparkle.position.set(0.05, 1.3, 0.08);
    ringA.add(sparkle);

    const group = new THREE.Group();
    group.add(ringA, ringB);
    group.rotation.x = 0.1;
    group.scale.setScalar(phone ? 1.08 : 1);
    scene.add(group);

    const glowGeo = new THREE.CircleGeometry(1.75, 36);
    const glowMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#d4af37'),
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = -1.32;
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
      { threshold: 0.12 }
    );
    io.observe(container);

    let frame = 0;
    let disposed = false;
    let lastRender = 0;
    let t = 0;
    // Telefon: 45 FPS — silliq, lekin ortiqcha emas
    const minFrameMs = phone ? 1000 / 45 : 1000 / 60;
    const ease = 0.08;

    const animate = (now: number) => {
      if (disposed) return;
      frame = requestAnimationFrame(animate);

      if (!visible || !pageVisible) return;
      if (now - lastRender < minFrameMs) return;
      lastRender = now;
      t += 0.016;

      const pose = modeRef.current === 'joined' ? JOINED : SEPARATED;
      ringA.position.lerp(pose.a.pos, ease);
      ringB.position.lerp(pose.b.pos, ease);
      lerpEuler(ringA.rotation, pose.a.rot, ease);
      lerpEuler(ringB.rotation, pose.b.rot, ease);

      const glowTarget = modeRef.current === 'joined' ? 1 : 2.4 / 1.7;
      glow.scale.x += (glowTarget - glow.scale.x) * ease;
      glow.scale.y = glow.scale.x;
      glow.scale.z = glow.scale.x;

      sparkleMat.opacity = 0.45 + Math.sin(t * 4.2) * 0.4;
      sparkle.scale.setScalar(0.85 + Math.sin(t * 4.2) * 0.28);

      controls.update();
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(animate);

    const onResize = () => {
      if (!container) return;
      const w = Math.max(container.clientWidth, 1);
      const h = Math.max(container.clientHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    const ro = new ResizeObserver(onResize);
    ro.observe(container);
    // Birinchi kadrda o‘lchamni qayta o‘lchash (mobil layout kechikishi)
    requestAnimationFrame(onResize);

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
      sparkleGeo.dispose();
      glowGeo.dispose();
      goldMat.dispose();
      antiqueGoldMat.dispose();
      diamondMat.dispose();
      sparkleMat.dispose();
      glowMat.dispose();
      envTex.dispose();
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
        className="wedding-rings-3d-root relative flex-1 w-full min-h-[200px] sm:min-h-[220px] overflow-visible bg-transparent touch-none"
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
