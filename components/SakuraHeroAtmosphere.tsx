"use client";

import { useEffect, useRef, useState } from "react";

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

      {/* 3. Traditional Japanese Seal Stamp */}
      <div className="absolute top-28 right-8 sm:right-16 hidden lg:flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity duration-300 pointer-events-auto select-none">
        <div className="w-10 h-28 border-2 border-red-700/60 rounded bg-red-950/15 backdrop-blur-md flex flex-col items-center justify-center py-2 px-1 text-[13px] font-serif font-black text-red-700 tracking-[0.35em] uppercase [writing-mode:vertical-rl] shadow-[0_8px_20px_rgba(230,0,18,0.18)] hover:scale-105 transition-transform">
          極上 鮨処
        </div>
        <span className="text-[9px] font-mono font-bold text-neutral-600 uppercase tracking-widest">
          Est. 1988
        </span>
      </div>

      {/* 4. Interactive Floating "Scroll to Explore" Beacon */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto flex flex-col items-center gap-2 select-none group cursor-pointer z-40">
        <button
          type="button"
          onClick={onExploreScroll}
          className="flex items-center gap-3 px-6 py-2.5 rounded-full backdrop-blur-xl bg-black/40 hover:bg-black/60 border border-white/30 hover:border-white/60 text-white transition-all duration-300 shadow-[0_12px_32px_rgba(0,0,0,0.25)] hover:scale-105 active:scale-95"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#e60012] animate-ping" />
          <span className="text-xs font-black tracking-[0.22em] uppercase text-white">
            Scroll to Explore
          </span>
          <svg
            className="w-4 h-4 stroke-current stroke-2 fill-none animate-bounce"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
