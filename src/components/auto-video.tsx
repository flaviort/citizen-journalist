"use client";

import { useEffect, useRef } from "react";

// React does not render the `muted` attribute on the server, which makes browsers
// block autoplay. This sets it on the element and plays only while on screen.
export function AutoVideo({ src, poster, className = "", ...rest }: { src: string; poster?: string; className?: string } & Record<`data-${string}`, string | boolean>) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) void v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: "200px" }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return <video ref={ref} src={src} poster={poster} muted loop playsInline preload="metadata" className={className} {...rest} />;
}
