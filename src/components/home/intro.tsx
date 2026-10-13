"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// Opening: the camera starts recording. A timecode runs, then the frame lifts.
export function Intro() {
  const ref = useRef<HTMLDivElement>(null);
  const tc = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const w = window as unknown as { __introDone?: boolean };
      w.__introDone = false;
      const done = () => {
        w.__introDone = true;
        window.dispatchEvent(new Event("intro:done"));
      };
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(ref.current, { display: "none" });
        done();
        return;
      }
      const frames = { f: 0 };
      const fmt = (n: number) => String(Math.floor(n)).padStart(2, "0");
      gsap
        .timeline()
        .from("[data-intro-line]", { scaleX: 0, transformOrigin: "left", duration: 1.4, ease: "expo.inOut" })
        .to(
          frames,
          {
            f: 62,
            duration: 1.4,
            ease: "power2.inOut",
            onUpdate: () => {
              if (tc.current) tc.current.textContent = `00:00:${fmt(frames.f / 24)}:${fmt(frames.f % 24)}`;
            },
          },
          0
        )
        .to("[data-intro-inner]", { opacity: 0, duration: 0.3 }, ">-0.05")
        .to(ref.current, { yPercent: -100, duration: 1, ease: "expo.inOut", onStart: done }, "<0.1")
        .set(ref.current, { display: "none" });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="fixed inset-0 z-[60] grid place-items-center bg-ink text-paper" aria-hidden>
      <div data-intro-inner className="w-[min(80vw,420px)]">
        <div className="mono flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="rec-dot size-2 rounded-full bg-rec" /> Rec
          </span>
          <span ref={tc}>00:00:00:00</span>
        </div>
        <div data-intro-line className="mt-3 h-px w-full bg-paper" />
        <p className="mono mt-3 text-paper/50">Citizen Journalist / Filed by the people who were there</p>
      </div>
    </div>
  );
}
