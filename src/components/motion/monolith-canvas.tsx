"use client";

import { useEffect, useRef } from "react";

/** A quiet stream of ember filaments; the canvas never intercepts input. */
export function MonolithCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let frame = 0;
    let start = 0;
    let lastDraw = 0;
    let hidden = document.hidden;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // The stream is drawn in document coordinates, so scrolling reveals new
    // portions of one path rather than repeating the same viewport decoration.
    const draw = (now: number) => {
      if (!motion.matches && now - lastDraw < 32) {
        if (!hidden) frame = requestAnimationFrame(draw);
        return;
      }
      lastDraw = now;
      if (!start) start = now;
      const time = motion.matches ? 0 : (now - start) / 1000;
      const scroll = window.scrollY;
      const pageHeight = Math.max(document.documentElement.scrollHeight, height);
      const scrollRange = Math.max(pageHeight - height, 1);
      const progress = Math.max(0, Math.min(1, scroll / scrollRange));
      // The head starts in the hero and reaches the page end with the reader.
      const headY = height * (0.12 + 0.88 * progress);
      const head = scroll + headY;
      const lanes = width < 640 ? 30 : 44;
      const laneSpacing = Math.min(width * 0.015, 8);
      const pathX = (documentY: number, lane: number) => {
        const position = Math.max(0, Math.min(1, documentY / pageHeight));
        const bend = Math.cos(position * Math.PI * 2 + 0.5);
        const filament = Math.sin(position * Math.PI * 5 + lane * 0.37) * Math.min(width * 0.012, 12);
        const drift = motion.matches ? 0 : Math.sin(time * 0.24 + lane * 0.3) * 4;
        return width * (0.5 + 0.41 * bend) + lane * laneSpacing + filament + drift;
      };
      ctx.clearRect(0, 0, width, height);
      const radius = Math.min(width * 0.34, 420);
      const glowX = pathX(head, 0);
      // Keep a soft ambient wash along the whole ribbon; the moving head below
      // remains brighter so progress is still easy to follow while scrolling.
      for (const fraction of [0.1, 0.4, 0.7, 1]) {
        const y = height * fraction;
        const x = pathX(scroll + y, 0);
        const ambient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        ambient.addColorStop(0, "rgba(255,84,41,0.10)");
        ambient.addColorStop(0.45, "rgba(255,84,41,0.045)");
        ambient.addColorStop(1, "rgba(255,84,41,0)");
        ctx.fillStyle = ambient;
        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
      }
      const wash = ctx.createRadialGradient(glowX, headY, 0, glowX, headY, radius);
      wash.addColorStop(0, "rgba(255,84,41,0.24)");
      wash.addColorStop(0.4, "rgba(255,84,41,0.11)");
      wash.addColorStop(1, "rgba(255,84,41,0)");
      ctx.fillStyle = wash;
      ctx.fillRect(glowX - radius, headY - radius, radius * 2, radius * 2);

      // Brightness follows the leading light; the path ahead stays quiet.
      const light = ctx.createLinearGradient(0, headY - height * 0.85, 0, headY + height * 0.12);
      light.addColorStop(0, "rgba(255,84,41,0.11)");
      light.addColorStop(0.55, "rgba(255,84,41,0.22)");
      light.addColorStop(0.88, "rgba(255,84,41,0.58)");
      light.addColorStop(1, "rgba(255,84,41,0.11)");
      ctx.save();
      ctx.strokeStyle = light;
      ctx.shadowColor = "rgba(255,84,41,0.5)";
      ctx.shadowBlur = width < 640 ? 8 : 14;
      ctx.filter = `blur(${width < 640 ? 10 : 16}px)`;
      ctx.lineCap = "round";
      ctx.lineWidth = width < 640 ? 13 : 20;
      for (const lane of [-14, -8, -2, 4, 10, 16]) {
        ctx.beginPath();
        for (let j = 0; j <= 40; j++) {
          const y = -80 + (height + 160) * j / 40;
          const x = pathX(scroll + y, lane);
          if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.restore();
      for (let i = 0; i < lanes; i++) {
        const lane = i - (lanes - 1) / 2;
        ctx.beginPath();
        for (let j = 0; j <= 40; j++) {
          const y = -80 + (height + 160) * j / 40;
          const x = pathX(scroll + y, lane);
          if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.save();
        ctx.globalAlpha = i % 5 === 0 ? 0.65 : 0.28;
        ctx.strokeStyle = light;
        ctx.lineWidth = i % 7 === 0 ? 1.5 : 0.75;
        ctx.stroke();
        ctx.restore();
        for (let j = 0; j < 2; j++) {
          const distance = ((i * 0.137 + j * 0.48 - time * 0.025 + 1000) % 1) * height * 0.75;
          const particleY = headY - distance;
          const particleX = pathX(scroll + particleY, lane);
          const alpha = Math.max(0, 1 - distance / (height * 0.75));
          ctx.beginPath();
          ctx.moveTo(pathX(scroll + particleY - 15, lane), particleY - 15);
          ctx.lineTo(particleX, particleY);
          ctx.strokeStyle = `rgba(255,84,41,${alpha * 0.65})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(particleX, particleY, i % 5 === 0 ? 1.5 : 0.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,84,41,${alpha * 0.8})`;
          ctx.fill();
        }
      }
      const tip = ctx.createRadialGradient(glowX, headY, 0, glowX, headY, 24);
      tip.addColorStop(0, "rgba(255,84,41,0.8)");
      tip.addColorStop(0.2, "rgba(255,84,41,0.32)");
      tip.addColorStop(1, "rgba(255,84,41,0)");
      ctx.fillStyle = tip;
      ctx.fillRect(glowX - 24, headY - 24, 48, 48);
      if (!motion.matches && !hidden) frame = requestAnimationFrame(draw);
    };
    const render = () => {
      cancelAnimationFrame(frame);
      resize();
      start = 0;
      lastDraw = 0;
      draw(performance.now());
    };
    const onScroll = () => { if (motion.matches && !hidden) draw(performance.now()); };
    const visibility = () => { hidden = document.hidden; if (hidden) cancelAnimationFrame(frame); else render(); };
    window.addEventListener("resize", render);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    motion.addEventListener("change", render);
    render();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", render);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", visibility);
      motion.removeEventListener("change", render);
    };
  }, []);

  return <canvas ref={canvasRef} id="site-3d" aria-hidden="true" className="pointer-events-none fixed inset-0 z-0" />;
}
