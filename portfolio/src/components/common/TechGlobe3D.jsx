import { useEffect, useRef } from "react";

export default function TechGlobe3D() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // Handle high DPI displays
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Track mouse position over the window (focused on hero area)
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const canvasCenterX = rect.left + rect.width / 2;
      const canvasCenterY = rect.top + rect.height / 2;

      // Normalised coordinates (-1 to 1) relative to canvas center
      mouseRef.current.targetX = (e.clientX - canvasCenterX) / (window.innerWidth / 2);
      mouseRef.current.targetY = (e.clientY - canvasCenterY) / (window.innerHeight / 2);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Initialize 3D points in a sphere
    const pointCount = 90;
    const points = [];
    const radius = 120; // sphere radius

    for (let i = 0; i < pointCount; i++) {
      // Uniform distribution on a sphere (Fibonacci lattice)
      const phi = Math.acos(-1 + (2 * i) / pointCount);
      const theta = Math.sqrt(pointCount * Math.PI) * phi;

      points.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
      });
    }

    // 3D rotation angles
    let angleX = 0;
    let angleY = 0;
    const fov = 350; // Camera distance / Field of view

    // Main render loop
    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Dampen mouse movement for inertia
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Base rotation speed + mouse influence
      angleX += 0.0035 + mouseRef.current.y * 0.01;
      angleY += 0.0045 + mouseRef.current.x * 0.01;

      // Precalculate trig values
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      const projectedPoints = points.map((p) => {
        // Rotate around Y axis
        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.x * sinY + p.z * cosY;

        // Rotate around X axis
        let y2 = p.y * cosX - z1 * sinX;
        let z2 = p.y * sinX + z1 * cosX;

        // Perspective Projection
        const scale = fov / (fov + z2);
        const screenX = width / 2 + x1 * scale;
        const screenY = height / 2 + y2 * scale;

        return {
          x: screenX,
          y: screenY,
          z: z2,
          scale: scale,
        };
      });

      // Render lines between nearby points
      ctx.lineWidth = 0.8;
      const maxDistanceSq = 75 * 75;

      for (let i = 0; i < projectedPoints.length; i++) {
        const p1 = projectedPoints[i];
        
        for (let j = i + 1; j < projectedPoints.length; j++) {
          const p2 = projectedPoints[j];

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistanceSq) {
            const distance = Math.sqrt(distSq);
            const opacity = (1 - distance / 75) * 0.18;

            // Fade lines based on depth
            const avgZ = (p1.z + p2.z) / 2;
            const depthOpacity = Math.max(0.1, 1 - (avgZ + radius) / (radius * 2));

            ctx.strokeStyle = `rgba(27, 27, 27, ${opacity * depthOpacity * 0.35})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw points (sorted by depth Z descending)
      const sortedPoints = [...projectedPoints].sort((a, b) => b.z - a.z);

      sortedPoints.forEach((p) => {
        const size = Math.max(0.5, p.scale * 2.2);
        const colorFactor = (p.z + radius) / (radius * 2);
        const alpha = Math.max(0.15, 1.0 - colorFactor);
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        
        if (p.z < -20) {
          ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.6})`;
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.4})`;
          ctx.shadowBlur = 0;
        }
        
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="tech-globe-canvas"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}
