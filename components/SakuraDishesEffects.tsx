"use client";

import { useEffect, useRef } from "react";
import type { DishesPage } from "./SakuraExperience";

interface SmokeParticle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  maxOpacity: number;
  growth: number;
}

export default function SakuraDishesEffects({
  page,
}: {
  page: DishesPage;
  onSelectPage?: (newPage: DishesPage) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const w = (canvas.width = 1920);
    const h = (canvas.height = 1080);

    // Steam origins:
    // Top dish origin (Ramen / Udon / Yakitori skewers)
    const topOrigin = { x: 1360, y: 340 };
    // Bottom dish origin (Okonomiyaki / Tempura / Nigiri)
    const bottomOrigin = { x: 280, y: 720 };

    // Create smoke particles for both dishes
    const particles: SmokeParticle[] = [
      ...Array.from({ length: 22 }, () => ({
        x: topOrigin.x + (Math.random() - 0.5) * 180,
        y: topOrigin.y + Math.random() * 80,
        originX: topOrigin.x,
        originY: topOrigin.y,
        size: 20 + Math.random() * 28,
        speedY: 0.7 + Math.random() * 1.0,
        speedX: (Math.random() - 0.5) * 0.6,
        opacity: 0,
        maxOpacity: 0.16 + Math.random() * 0.16,
        growth: 0.35 + Math.random() * 0.45,
      })),
      ...Array.from({ length: 18 }, () => ({
        x: bottomOrigin.x + (Math.random() - 0.5) * 200,
        y: bottomOrigin.y + Math.random() * 80,
        originX: bottomOrigin.x,
        originY: bottomOrigin.y,
        size: 22 + Math.random() * 32,
        speedY: 0.6 + Math.random() * 0.9,
        speedX: (Math.random() - 0.5) * 0.5,
        opacity: 0,
        maxOpacity: 0.14 + Math.random() * 0.14,
        growth: 0.35 + Math.random() * 0.45,
      })),
    ];

    let tick = 0;

    const render = () => {
      tick += 0.02;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.y -= p.speedY;
        p.x += p.speedX + Math.sin(tick + p.size) * 0.8;
        p.size += p.growth;

        // Smooth fade-in near origin, fade-out as it rises into air
        if (p.y > p.originY - 140) {
          p.opacity = Math.min(p.maxOpacity, p.opacity + 0.008);
        } else {
          p.opacity = Math.max(0, p.opacity - 0.004);
        }

        // Reset particle once dissipated
        if (p.opacity <= 0 || p.y < p.originY - 320) {
          p.x = p.originX + (Math.random() - 0.5) * 180;
          p.y = p.originY + Math.random() * 40;
          p.size = 20 + Math.random() * 24;
          p.opacity = 0;
        }

        ctx.save();
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        grad.addColorStop(0, `rgba(255, 255, 255, ${p.opacity})`);
        grad.addColorStop(0.5, `rgba(255, 245, 235, ${p.opacity * 0.6})`);
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [page]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden select-none">
      {/* Pristine 60 FPS Culinary Smoke & Steam Simulation */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}
