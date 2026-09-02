"use client";

import { useEffect, useRef } from "react";
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
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

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
      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Organic elegant Sakura Blossom Palette
    const petalColors = [
      "rgba(255, 183, 197, 0.8)",
      "rgba(255, 192, 203, 0.88)",
      "rgba(255, 160, 180, 0.75)",
      "rgba(248, 140, 165, 0.7)",
      "rgba(255, 215, 225, 0.92)",
    ];

    const petals: Petal[] = Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      size: 11 + Math.random() * 16,
      speedX: 0.7 + Math.random() * 1.3,
      speedY: 0.8 + Math.random() * 1.4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 1.8,
      scaleX: 0.3 + Math.random() * 0.7,
      opacity: 0.45 + Math.random() * 0.45,
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
    }));

    const sparks: Spark[] = Array.from({ length: 16 }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      size: 1.5 + Math.random() * 2.5,
      speedY: 0.35 + Math.random() * 0.6,
      maxOpacity: 0.4 + Math.random() * 0.45,
      fadeSpeed: 0.008 + Math.random() * 0.015,
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    // Draw single stylized curved Sakura Petal Path with midrib vein
    const drawPetal = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      scaleX: number,
      opacity: number,
      color: string
    ) => {
      c.save();
      c.translate(x, y);
      c.rotate((rotation * Math.PI) / 180);
      c.scale(scaleX, 1);
      c.globalAlpha = opacity;
      c.fillStyle = color;

      c.beginPath();
      c.moveTo(0, 0);
      c.bezierCurveTo(-size * 0.6, -size * 0.8, -size * 0.5, -size * 1.6, 0, -size * 2);
      c.bezierCurveTo(size * 0.5, -size * 1.6, size * 0.6, -size * 0.8, 0, 0);
      c.closePath();
      c.fill();

      // Subtle petal midrib line for high-end organic realism
      c.strokeStyle = "rgba(255, 255, 255, 0.45)";
      c.lineWidth = 0.9;
      c.beginPath();
      c.moveTo(0, -size * 0.2);
      c.lineTo(0, -size * 1.4);
      c.stroke();

      c.restore();
    };

    let tick = 0;

    const render = () => {
      tick += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // 1. Draw glowing golden firefly sparks
      for (const spark of sparks) {
        spark.y -= spark.speedY;
        spark.x += Math.sin(tick + spark.id) * 0.4;
        spark.pulsePhase += spark.fadeSpeed;
        const currentOpacity = (Math.sin(spark.pulsePhase) * 0.5 + 0.5) * spark.maxOpacity;

        if (spark.y < -10) {
          spark.y = height + 10;
          spark.x = Math.random() * width;
        }

        ctx.save();
        ctx.fillStyle = `rgba(255, 215, 140, ${currentOpacity})`;
        ctx.shadowColor = "rgba(255, 180, 80, 0.75)";
        ctx.shadowBlur = 9;
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 2. Draw & update floating sakura petals with natural breeze
      const windX = Math.sin(tick * 0.5) * 0.9 + 0.7 + mouseRef.current.x * 1.2;

      for (const petal of petals) {
        petal.x += petal.speedX + windX;
        petal.y += petal.speedY + Math.cos(tick + petal.id) * 0.45 + mouseRef.current.y * 0.7;
        petal.rotation += petal.rotationSpeed;
        petal.scaleX = Math.sin(tick * 1.5 + petal.id) * 0.7 + 0.2;

        // Wrap around viewport edges
        if (petal.y > height + 40) {
          petal.y = -30;
          petal.x = Math.random() * width;
        }
        if (petal.x > width + 40) {
          petal.x = -30;
          petal.y = Math.random() * height;
        }

        drawPetal(
          ctx,
          petal.x,
          petal.y,
          petal.size,
          petal.rotation,
          petal.scaleX,
          petal.opacity,
          petal.color
        );
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
        ref={spotlightRef}
        aria-hidden="true"
        className="absolute pointer-events-none rounded-full blur-3xl opacity-35 will-change-transform"
        style={{
          left: 0,
          top: 0,
          transform: "translate3d(50vw, 50vh, 0) translate(-50%, -50%)",
          width: "550px",
          height: "550px",
          background: "radial-gradient(circle, rgba(255, 200, 160, 0.45) 0%, rgba(230, 0, 18, 0.12) 50%, transparent 70%)",
        }}
      />

      {/* 3. Japanese Top Ribbon Banner: 最高の寿司盛り合わせ */}
      <DraggableWrapper
        id="hero-top-ribbon"
        label="Japanese Ribbon Banner"
        className="absolute top-[76px] sm:top-[84px] md:top-[90px] left-1/2 -translate-x-1/2 z-20 pointer-events-auto select-none"
      >
        <div className="bg-white/95 backdrop-blur-sm border border-black/10 px-4 sm:px-6 py-1 sm:py-1.5 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.08)] flex items-center justify-center gap-1 font-bold text-xs sm:text-sm md:text-base tracking-wider text-black">
          <span>最高の</span>
          <span className="text-[#e60012]">寿司</span>
          <span>盛り合わせ</span>
        </div>
      </DraggableWrapper>

      {/* 4. Traditional Japanese Seal Stamp */}
      <DraggableWrapper
        id="hero-seal-stamp"
        label="Traditional Red Seal"
        className="absolute top-20 sm:top-24 md:top-28 right-4 sm:right-8 md:right-14 z-20 flex flex-col items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity duration-300 pointer-events-auto select-none"
      >
        <div className="w-8 sm:w-9 md:w-10 h-22 sm:h-26 md:h-28 border-2 border-red-700/60 rounded bg-red-950/15 backdrop-blur-md flex flex-col items-center justify-center py-2 px-1 text-[11px] sm:text-[12px] md:text-[13px] font-serif font-black text-red-700 tracking-[0.35em] uppercase [writing-mode:vertical-rl] shadow-[0_8px_20px_rgba(230,0,18,0.18)] hover:scale-105 transition-transform">
          極上 鮨処
        </div>
        <span className="text-[8px] sm:text-[9px] font-mono font-bold text-neutral-600 uppercase tracking-widest">
          Est. 1988
        </span>
      </DraggableWrapper>
    </div>
  );
}
