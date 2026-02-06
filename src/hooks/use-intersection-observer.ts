"use client";

import { useEffect, useRef } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
  onIntersect: () => void;
}

export function useIntersectionObserver({
  threshold = 0,
  rootMargin = "0px 0px 400px 0px",
  enabled = true,
  onIntersect,
}: UseIntersectionObserverOptions) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onIntersect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, threshold, rootMargin, onIntersect]);

  return ref;
}
