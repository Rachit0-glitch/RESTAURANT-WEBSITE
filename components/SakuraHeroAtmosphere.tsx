"use client";

import { useEffect, useRef, useState } from "react";
import DraggableWrapper from "./DraggableWrapper";

interface Petal {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  scaleX: number;
  opacity: number;
  color: string;
}

interface Spark {
  id: number;
  x: number;
  y: number;
  size: number;
  speedY: number;
  maxOpacity: number;
  fadeSpeed: number;
  pulsePhase: number;
}

export default function SakuraHeroAtmosphere({
  isRevealed,
  onExploreScroll,
}: {
  isRevealed: boolean;
  onExploreScroll: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / width - 0.5) * 2;
      mouseRef.current.targetY = (e.clientY / height - 0.5) * 2;
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const sparks: Spark[] = Array.from({ length: 14 }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      size: 1.2 + Math.random() * 2,
      speedY: 0.25 + Math.random() * 0.45,
      maxOpacity: 0.25 + Math.random() * 0.3,
      fadeSpeed: 0.006 + Math.random() * 0.012,
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    let tick = 0;

    const render = () => {
      tick += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Subtle ambient warm ember sparks
      for (const spark of sparks) {
        spark.y -= spark.speedY;
        spark.x += Math.sin(tick + spark.id) * 0.3;
        spark.pulsePhase += spark.fadeSpeed;
        const currentOpacity = (Math.sin(spark.pulsePhase) * 0.5 + 0.5) * spark.maxOpacity;

        if (spark.y < -10) {
          spark.y = height + 10;
          spark.x = Math.random() * width;
        }

        ctx.save();
        ctx.fillStyle = `rgba(255, 215, 160, ${currentOpacity})`;
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-30 overflow-hidden transition-opacity duration-1000 ${
        isRevealed ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* 1. Full-bleed 60 FPS Procedural Sakura Petals and Golden Sparks Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* 2. Interactive Cursor Spotlight Light Follower */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none transition-transform duration-200 ease-out -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-35"
        style={{
          left: `${mousePos.x}%`,
          top: `${mousePos.y}%`,
          width: "550px",
          height: "550px",
          background: "radial-gradient(circle, rgba(255, 200, 160, 0.45) 0%, rgba(230, 0, 18, 0.12) 50%, transparent 70%)",
        }}
      />

      {/* 3. Japanese Top Ribbon Banner: 最高の寿司盛り合わせ */}
      <DraggableWrapper
        id="hero-top-ribbon"
        label="Japanese Ribbon Banner"
        className="absolute top-[72px] sm:top-[80px] md:top-[88px] left-1/2 -translate-x-1/2 z-20 pointer-events-auto select-none"
      >
        <div className="bg-white/95 backdrop-blur-sm border border-black/10 px-4 sm:px-6 py-1 sm:py-1.5 rounded shadow-[0_4px_16px_rgba(0,0,0,0.08)] flex items-center justify-center gap-1 font-bold text-xs sm:text-sm md:text-base tracking-wider text-black">
          <span>最高の</span>
          <span className="text-[#e60012]">寿司</span>
          <span>盛り合わせ</span>
        </div>
      </DraggableWrapper>

      {/* 4. Traditional Japanese Seal Stamp */}
      <DraggableWrapper
        id="hero-seal-stamp"
        label="Traditional Red Seal"
        className="absolute top-20 sm:top-24 md:top-28 right-4 sm:right-8 md:right-14 z-20 flex flex-col items-center gap-1 opacity-90 hover:opacity-100 transition-opacity duration-300 pointer-events-auto select-none"
      >
        <div className="w-7 sm:w-8 md:w-9 h-18 sm:h-22 md:h-24 border border-red-700/60 rounded bg-red-950/5 flex flex-col items-center justify-center py-1 px-1 text-[10px] sm:text-[11px] md:text-[12px] font-serif font-black text-red-700 tracking-[0.35em] uppercase [writing-mode:vertical-rl]">
          極上 鮨処
        </div>
        <span className="text-[7px] sm:text-[8px] md:text-[9px] font-mono font-bold text-neutral-600 uppercase tracking-widest">
          Est. 1988
        </span>
      </DraggableWrapper>
    </div>
  );
}
