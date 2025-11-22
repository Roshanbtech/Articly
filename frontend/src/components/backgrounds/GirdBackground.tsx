import { useEffect, useRef } from 'react';

interface GridBackgroundProps {
  gridSize?: number;
  lineWidth?: number;
  glowIntensity?: number;
}

export default function GridBackground({
  gridSize = 50,
  lineWidth = 1,
  glowIntensity = 0.05,
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

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = `rgba(212, 175, 55, ${glowIntensity})`;
      ctx.lineWidth = lineWidth;

      // Vertical lines
      for (let x = 0; x <= canvas.width; x += gridSize) {
        const distanceFromMouse = Math.abs(mouseRef.current.x - x);
        const opacity = Math.max(glowIntensity, Math.min(0.3, 1 - distanceFromMouse / 300));
        
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.strokeStyle = `rgba(212, 175, 55, ${opacity})`;
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y <= canvas.height; y += gridSize) {
        const distanceFromMouse = Math.abs(mouseRef.current.y - y);
        const opacity = Math.max(glowIntensity, Math.min(0.3, 1 - distanceFromMouse / 300));
        
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.strokeStyle = `rgba(212, 175, 55, ${opacity})`;
        ctx.stroke();
      }

      // Draw glow around mouse
      const gradient = ctx.createRadialGradient(
        mouseRef.current.x,
        mouseRef.current.y,
        0,
        mouseRef.current.x,
        mouseRef.current.y,
        150
      );
      gradient.addColorStop(0, 'rgba(212, 175, 55, 0.15)');
      gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('mousemove', handleMouseMove);
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
