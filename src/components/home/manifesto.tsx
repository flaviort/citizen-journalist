"use client";

import { useRef } from "react";
import { blockLabels, sections, type BlockKind } from "@/data/content";
import { Globe } from "@/components/globe";
import { gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";
import { SectionLabel } from "./stories-grid";

const dot: Record<BlockKind, string> = { reported: "bg-reported", eyewitness: "bg-eyewitness", take: "bg-take" };

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create("[data-manifesto]", { type: "words" });
        gsap.fromTo(
          split.words,
          { opacity: 0.14 },
          { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: "[data-manifesto]", start: "top 80%", end: "bottom 45%", scrub: true } }
        );
        gsap.from("[data-globe]", { scale: 0.6, rotate: -25, opacity: 0, duration: 2, scrollTrigger: { trigger: ref.current, start: "top 75%" } });
        gsap.from("[data-list] li", { y: 20, opacity: 0, stagger: 0.05, scrollTrigger: { trigger: "[data-list]", start: "top 85%" } });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="grid gap-12 px-4 py-28 sm:px-6 sm:py-40 lg:grid-cols-2">
      <div>
        <SectionLabel n="02">About</SectionLabel>
        <div data-globe className="mt-10 max-w-[460px] text-ink">
          <Globe className="w-full" />
        </div>
      </div>
      <div>
        <p data-manifesto className="text-[clamp(1.6rem,2.7vw,2.6rem)] font-light leading-[1.15] tracking-[-0.02em]">
          We don&apos;t have reporters on staff. We have commuters, clerks, engineers and creators who were standing there when it
          happened. We check every claim before it goes live, and we label every paragraph, so you always know if you&apos;re reading
          fact, a firsthand account or an opinion.
        </p>
        <div data-list className="mt-16 grid gap-10 sm:grid-cols-2">
          <div>
            <p className="mono text-ink-2">What we cover</p>
            <ul className="mt-4 space-y-1 text-lg">
              {sections.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mono text-ink-2">How we label it</p>
            <ul className="mt-4 space-y-4">
              {(Object.keys(blockLabels) as BlockKind[]).map((k) => (
                <li key={k}>
                  <span className="flex items-center gap-2 text-lg">
                    <span className={`size-2 rounded-full ${dot[k]}`} />
                    {blockLabels[k].label}
                  </span>
                  <span className="mt-1 block text-sm text-ink-2">{blockLabels[k].hint}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
