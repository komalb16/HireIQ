"use client";

import React, { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
}

export function VibeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    const particleCount = 120; // High Density Node Mesh
    let theme = 'lavender';

    const resize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const getThemeSettings = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'lavender';
      const isLight = ['white','light','lavender','pink'].includes(currentTheme);
      return {
        isLight,
        alpha: isLight ? 0.4 : 0.8, // More prominent on both
        connectionAlpha: isLight ? 0.15 : 0.25,
        distLimit: isLight ? 120 : 180
      };
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.6, // Higher velocity
          vy: (Math.random() - 0.5) * 0.4 - 0.2, // Drifting upwards
          size: Math.random() * 3 + 1,
          life: Math.random() * 0.5 + 0.5
        });
      }
    };

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const settings = getThemeSettings();
      const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#3b82f6';
      
      ctx.fillStyle = accentColor;
      ctx.strokeStyle = accentColor;

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle (Neural Node)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.globalAlpha = settings.alpha * p.life;
        ctx.fill();

        // High Density Mesh Connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < settings.distLimit) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            const midX = (p.x + p2.x) / 2 + Math.sin(Date.now() / 2000 + i) * 10;
            const midY = (p.y + p2.y) / 2 + Math.cos(Date.now() / 2000 + j) * 10;
            ctx.quadraticCurveTo(midX, midY, p2.x, p2.y);
            ctx.globalAlpha = (1 - dist / settings.distLimit) * settings.connectionAlpha;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    };

    // Theme Recalibration Observer
    const observer = new MutationObserver(() => {
      // Re-fetch current theme properties on attribute change
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    window.addEventListener('resize', resize);
    resize();
    initParticles();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-[-1] pointer-events-none transition-opacity duration-1000"
      style={{ opacity: 1 }}
    />
  );
}
