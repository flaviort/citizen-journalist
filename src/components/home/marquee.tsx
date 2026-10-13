"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

const CITIES = ["Lagos", "Belem", "Osaka", "Detroit", "Marseille", "Mexico City", "Nairobi", "Tbilisi"];

// Endless city ticker. Scroll speed pushes it faster, scroll direction flips it.
export function CityMarquee() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const loop = gsap.to("[data-track]", { xPercent: -50, ease: "none", duration: 28, repeat: -1 });
        let dir = 1;
        ScrollTrigger.create({
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            if (self.direction !== dir) dir = self.direction;
            const v = Math.min(Math.abs(self.getVelocity()) / 250, 5);
            gsap.to(loop, { timeScale: dir * (1 + v), duration: 0.3, overwrite: true });
            gsap.to(loop, { timeScale: dir, duration: 1.2, delay: 0.3 });
          },
        });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  const row = (
    <span className="flex shrink-0 items-center">
      {CITIES.map((c) => (
        <span key={c} className="flex items-center">
          <span className="px-[0.35em]">{c}</span>
          <span className="inline-block size-[0.14em] rounded-full bg-rec" />
        </span>
      ))}
    </span>
  );

  return (
    <div ref={ref} className="overflow-hidden border-y border-ink py-3" aria-label={`Filing today from ${CITIES.join(", ")}`}>
      <div data-track className="flex w-max text-[clamp(3rem,9vw,9.5rem)] font-light uppercase leading-none tracking-[-0.03em]" aria-hidden>
        {row}
        {row}
      </div>
    </div>
  );
}
