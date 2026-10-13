"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";

// Generic scroll motion driven by data attributes, so server-rendered pages can opt in:
// data-split (lines rise in), data-reveal (media unmasks), data-parallax (inner drifts),
// data-fade (fades up), data-progress (reading progress bar).
export function PageMotion({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el, i) => {
          const s = SplitText.create(el, { type: "lines", mask: "lines" });
          gsap.from(s.lines, {
            yPercent: 110,
            stagger: 0.07,
            duration: 1.3,
            delay: el.dataset.split === "now" ? 0.15 + i * 0.05 : 0,
            scrollTrigger: el.dataset.split === "now" ? undefined : { trigger: el, start: "top 88%" },
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.fromTo(el, { clipPath: "inset(16% 10% 16% 10%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, scrollTrigger: { trigger: el, start: "top 88%" } });
        });
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const amt = Number(el.dataset.parallax || 10);
          gsap.fromTo(el, { yPercent: -amt, scale: 1.15 }, { yPercent: amt, scale: 1.15, ease: "none", scrollTrigger: { trigger: el.parentElement, scrub: true, start: "top bottom", end: "bottom top" } });
        });
        gsap.utils.toArray<HTMLElement>("[data-fade]").forEach((el) => {
          gsap.from(el, { y: 28, opacity: 0, duration: 1.2, scrollTrigger: { trigger: el, start: "top 90%" } });
        });
      });
      const bar = ref.current?.querySelector("[data-progress]");
      if (bar) gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom bottom", scrub: true } });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
