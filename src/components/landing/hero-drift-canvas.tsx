"use client";

import { useEffect, useRef } from "react";

export default function HeroDriftCanvas() {
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

    const rows = 28;
    const cols = 22;

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      const t = time * 0.0006;
      const cellW = width / cols;
      const cellH = height / rows;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          const driftX = Math.sin(t + idx * 0.14) * 14;
          const driftY = Math.cos(t * 0.8 + idx * 0.09) * 10;
          const x = c * cellW + cellW * 0.5 + driftX;
          const y = r * cellH + cellH * 0.5 + driftY;

          const strokeLen = 14 + Math.sin(t * 1.2 + idx) * 8;
          const angle = Math.sin(t * 0.4 + idx * 0.05) * 0.6;

          const isHighlight = idx % 7 === 0;
          const alpha = 0.05 + Math.abs(Math.sin(t + idx * 0.2)) * 0.14;

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.moveTo(-strokeLen * 0.5, 0);
          ctx.lineTo(strokeLen * 0.5, 0);

          if (isHighlight) {
            ctx.strokeStyle = `rgba(239, 189, 235, ${alpha * 1.2})`; // #EFBDEB Pink Orchid
            ctx.lineWidth = 1.5;
          } else {
            ctx.strokeStyle = `rgba(10, 129, 209, ${alpha})`; // #0A81D1 Steel Blue
            ctx.lineWidth = 1;
          }

          ctx.stroke();
          ctx.restore();
        }
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
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
