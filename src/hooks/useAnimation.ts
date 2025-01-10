import { useState, useCallback } from 'react';

interface UseAnimationProps {
  duration?: number;
  delay?: number;
}

export function useAnimation({ duration = 300, delay = 0 }: UseAnimationProps = {}) {
  const [isAnimating, setIsAnimating] = useState(false);

  const animate = useCallback((callback?: () => void) => {
    setIsAnimating(true);

    setTimeout(() => {
      setIsAnimating(false);
      callback?.();
    }, duration + delay);
  }, [duration, delay]);

  return { isAnimating, animate };
}