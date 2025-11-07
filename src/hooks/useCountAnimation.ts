import { useState, useEffect, useRef } from 'react';

export const useCountAnimation = (target: number, duration: number = 2000) => {
  const [current, setCurrent] = useState(0);
  const startTimestampRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (target === 0) {
      setCurrent(0);
      return;
    }

    startTimestampRef.current = null;

    const easeOutQuad = (t: number) => t * (2 - t);

    const animate = (timestamp: number) => {
      if (!startTimestampRef.current) {
        startTimestampRef.current = timestamp;
      }

      const progress = Math.min((timestamp - startTimestampRef.current) / duration, 1);
      const easedProgress = easeOutQuad(progress);
      setCurrent(Math.floor(easedProgress * target));

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [target, duration]);

  return current;
};
