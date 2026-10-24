"use client";

import { useEffect, useRef } from "react";

export default function SeasonContourCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize, { passive: true });

    const numLines = 22;

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      const t = time * 0.0004;
      const stepY = height / (numLines + 2);

      for (let i = 0; i < numLines; i++) {
        const baseY = (i + 1.5) * stepY;
        const isOrchid = i % 5 === 0;
        const isAzure = i % 5 === 2;

        ctx.beginPath();
        const segments = 40;
        for (let s = 0; s <= segments; s++) {
          const x = (s / segments) * width;
          const nx = (x / width) * Math.PI * 3;
          const wave1 = Math.sin(nx + t * 1.5 + i * 0.35) * 22;
          const wave2 = Math.sin(nx * 0.5 - t * 0.8 + i * 0.2) * 12;
          const y = baseY + wave1 + wave2;

          if (s === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        if (isOrchid) {
          ctx.strokeStyle = "rgba(239, 189, 235, 0.75)"; // #EFBDEB Pink Orchid
          ctx.lineWidth = 1.6;
        } else if (isAzure) {
          ctx.strokeStyle = "rgba(10, 129, 209, 0.55)"; // #0A81D1 Steel Blue
          ctx.lineWidth = 1.2;
        } else {
          ctx.strokeStyle = "rgba(100, 97, 160, 0.22)"; // #6461A0 Dusty Grape
          ctx.lineWidth = 1;
        }

        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        transform: "translateY(var(--season-y)) scale(var(--season-scale))",
        transformOrigin: "center center",
      }}
    />
  );
}
