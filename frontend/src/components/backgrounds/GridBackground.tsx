import { useEffect, useRef } from 'react';

interface GridBackgroundProps {
  gridSize?: number;
  lineWidth?: number;
  glowIntensity?: number;
}

/**
 * Articly error / 404 themed background
 * - Golden grid
 * - Animated scanline
 * - Glitch bars
 * - Mouse-follow glow
 */
export default function GridBackground({
  gridSize = 52,
  lineWidth = 1,
  glowIntensity = 0.06,
}: GridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Default mouse focus to center if user hasn’t moved yet
      mouseRef.current = {
        x: canvas.width / 2,
        y: canvas.height / 2,
      };
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;

    const animate = (time: number) => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // === 1) Base radial background (black → smoky gold) ===
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.max(width, height);

      const bgGradient = ctx.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        radius
      );
      bgGradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
      bgGradient.addColorStop(0.4, 'rgba(10, 8, 3, 0.96)');
      bgGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');

      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // === 2) Golden grid with slight dynamic brightness ===
      ctx.lineWidth = lineWidth;

      const timeFactor = (time || 0) * 0.0006;

      // Vertical lines
      for (let x = 0; x <= width; x += gridSize) {
        const distanceFromMouse = Math.abs(mouseRef.current.x - x);
        const baseOpacity = Math.max(
          glowIntensity,
          Math.min(0.25, 1 - distanceFromMouse / 450)
        );
        const flicker = 0.03 * Math.sin(timeFactor * 8 + x * 0.02);
        const opacity = Math.min(0.32, Math.max(glowIntensity, baseOpacity + flicker));

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.strokeStyle = `rgba(212, 175, 55, ${opacity})`;
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y <= height; y += gridSize) {
        const distanceFromMouse = Math.abs(mouseRef.current.y - y);
        const baseOpacity = Math.max(
          glowIntensity,
          Math.min(0.25, 1 - distanceFromMouse / 450)
        );
        const flicker = 0.03 * Math.cos(timeFactor * 8 + y * 0.02);
        const opacity = Math.min(0.32, Math.max(glowIntensity, baseOpacity + flicker));

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.strokeStyle = `rgba(212, 175, 55, ${opacity})`;
        ctx.stroke();
      }

      // === 3) Error scanline sweeping down the screen ===
      const scanY =
        ((time * 0.08) % (height + 220)) - 110; // move slowly from top to bottom

      const scanGradient = ctx.createLinearGradient(0, scanY, 0, scanY + 140);
      scanGradient.addColorStop(0, 'rgba(248, 113, 113, 0)');
      scanGradient.addColorStop(0.4, 'rgba(248, 113, 113, 0.10)');
      scanGradient.addColorStop(0.5, 'rgba(212, 175, 55, 0.20)');
      scanGradient.addColorStop(0.6, 'rgba(248, 113, 113, 0.10)');
      scanGradient.addColorStop(1, 'rgba(248, 113, 113, 0)');

      ctx.fillStyle = scanGradient;
      ctx.fillRect(0, scanY, width, 140);

      // === 4) Glitch bars (random horizontal & vertical highlights) ===
      const glitchCount = 6;
      for (let i = 0; i < glitchCount; i++) {
        const gx = Math.random() * width;
        const gy = Math.random() * height;
        const gw = 40 + Math.random() * 110;
        const gh = 3 + Math.random() * 10;

        ctx.fillStyle = 'rgba(212, 175, 55, 0.13)';
        ctx.fillRect(gx, gy, gw, gh);

        // Occasionally draw a vertical glitch shard
        if (Math.random() > 0.6) {
          const vh = 40 + Math.random() * 120;
          ctx.fillRect(gx, gy, 2, vh);
        }
      }

      // === 5) Mouse-follow glow (gold + subtle red edge) ===
      const pointerGradient = ctx.createRadialGradient(
        mouseRef.current.x,
        mouseRef.current.y,
        0,
        mouseRef.current.x,
        mouseRef.current.y,
        180
      );
      pointerGradient.addColorStop(0, 'rgba(212, 175, 55, 0.20)');
      pointerGradient.addColorStop(0.5, 'rgba(212, 175, 55, 0.07)');
      pointerGradient.addColorStop(1, 'rgba(248, 113, 113, 0)');

      ctx.fillStyle = pointerGradient;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gridSize, lineWidth, glowIntensity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
}
