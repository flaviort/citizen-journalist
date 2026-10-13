"use client";

import { useEffect, useRef, useState } from "react";
import { AutoVideo } from "@/components/auto-video";
import { filings, getContributor } from "@/data/content";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

function Typewriter() {
  const [i, setI] = useState(0);
  const [n, setN] = useState(0);
  const f = filings[i];
  const a = getContributor(f.author);
  const full = f.text;

  useEffect(() => {
    if (n < full.length) {
      const id = setTimeout(() => setN(n + 1), 28);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      setN(0);
      setI((i + 1) % filings.length);
    }, 2600);
    return () => clearTimeout(id);
  }, [n, full, i]);

  return (
    <div aria-live="off">
      <p className="mono text-white/70">
        {f.time} / {f.location} / {a?.name}
      </p>
      <p className="mt-2 min-h-[2.3em] max-w-[24ch] text-[clamp(1.6rem,3.6vw,3.4rem)] font-light leading-[1.05] tracking-[-0.02em]">
        {full.slice(0, n)}
        <span className="rec-dot ml-0.5 inline-block h-[0.85em] w-[0.06em] translate-y-[0.1em] bg-sun" />
      </p>
    </div>
  );
}

export function WireVideo() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo("[data-wv]", { yPercent: -12, scale: 1.15 }, { yPercent: 12, scale: 1, ease: "none", scrollTrigger: { trigger: ref.current, scrub: true } });
        gsap.fromTo(
          "[data-wv-frame]",
          { clipPath: "inset(10% 6% 10% 6%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "top 20%", scrub: true } }
        );
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="wire-live" className="mt-4">
      <div data-wv-frame className="relative h-[92vh] overflow-hidden bg-ink text-white">
        <AutoVideo data-wv className="absolute inset-0 size-full object-cover" src="/media/v/4437.mp4" poster="/media/poster/4437.jpg" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
        <div className="grain absolute inset-0 overflow-hidden" />
        <div className="relative flex h-full flex-col justify-between p-4 pt-20 sm:p-6 sm:pt-20">
          <div className="mono flex justify-between">
            <span className="flex items-center gap-2">
              <span className="rec-dot size-2 rounded-full bg-rec" /> On the wire, live
            </span>
            <span>Filings arrive every 4 min</span>
          </div>
          <Typewriter />
        </div>
      </div>
    </section>
  );
}
