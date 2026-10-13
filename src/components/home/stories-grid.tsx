"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { getContributor, stories } from "@/data/content";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

export function SectionLabel({ n, children, className = "" }: { n: string; children: React.ReactNode; className?: string }) {
  return (
    <p className={`mono flex items-center gap-3 ${className}`}>
      <span className="text-ink-2">({n})</span>
      {children}
    </p>
  );
}

export function StoriesGrid() {
  const ref = useRef<HTMLElement>(null);
  const picks = stories.slice(0, 4);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>("[data-tile]").forEach((tile) => {
          const media = tile.querySelector("[data-media]");
          const inner = tile.querySelector("[data-inner]");
          gsap.fromTo(
            media,
            { clipPath: "inset(18% 12% 18% 12%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: tile, start: "top 85%" } }
          );
          gsap.fromTo(inner, { scale: 1.35 }, { scale: 1.05, duration: 2, ease: "expo.out", scrollTrigger: { trigger: tile, start: "top 85%" } });
          gsap.fromTo(inner, { yPercent: -4 }, { yPercent: 4, ease: "none", scrollTrigger: { trigger: tile, scrub: true } });
          gsap.from(tile.querySelectorAll("[data-cap]"), {
            y: 24,
            opacity: 0,
            stagger: 0.08,
            scrollTrigger: { trigger: tile, start: "top 70%" },
          });
        });
        gsap.from("[data-all-rule]", { scaleX: 0, transformOrigin: "left", duration: 1.6, scrollTrigger: { trigger: "[data-all-rule]", start: "top 90%" } });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  const play = (e: React.PointerEvent<HTMLElement>, on: boolean) => {
    const v = e.currentTarget.querySelector("video");
    if (!v) return;
    v.muted = true;
    if (on) void v.play().catch(() => {});
    else v.pause();
    gsap.to(v, { opacity: on ? 1 : 0, duration: 0.5 });
  };

  return (
    <section ref={ref} id="stories" className="relative z-10 bg-paper px-4 pt-24 sm:px-6 sm:pt-32">
      <div className="flex items-end justify-between">
        <SectionLabel n="01">Latest stories</SectionLabel>
        <p className="mono text-ink-2">Updated 14:02</p>
      </div>
      <ol className="mt-6 grid gap-x-4 gap-y-14 md:grid-cols-2">
        {picks.map((s, i) => {
          const a = getContributor(s.author)!;
          return (
            <li key={s.slug} data-tile>
              <Link
                href={`/stories/${s.slug}`}
                data-cursor={s.video ? "Play" : "Read"}
                onPointerEnter={(e) => play(e, true)}
                onPointerLeave={(e) => play(e, false)}
                className="group block"
              >
                <div data-media className="relative aspect-[4/3] overflow-hidden bg-paper-2">
                  <div data-inner className="absolute inset-0">
                    <Image src={s.cover} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" priority={i < 2} />
                    {s.video && <video src={s.video} muted loop playsInline preload="none" className="absolute inset-0 size-full object-cover opacity-0" />}
                  </div>
                  <span className="mono absolute left-3 top-3 rounded-full bg-paper px-2.5 py-1">{s.section}</span>
                </div>
                <div className="mt-3 grid grid-cols-[1fr_auto] items-start gap-4">
                  <h3 data-cap className="max-w-[28ch] text-[1.35rem] leading-[1.12] tracking-[-0.015em] sm:text-[1.6rem]">
                    {s.title}
                  </h3>
                  <p data-cap className="text-right">
                    <span className="serif block text-xl italic">{a.name}</span>
                    <span className="mono text-ink-2">{s.location}</span>
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
      <Link href="/#wire" className="group mt-16 block">
        <span data-all-rule className="block h-px bg-ink" />
        <span className="flex items-center gap-4 py-4 text-3xl font-light tracking-[-0.02em] sm:text-4xl">
          <span className="transition-transform duration-500 group-hover:translate-x-3">&rarr;</span>
          All <span className="serif -ml-2 italic">stories</span>
        </span>
        <span className="block h-px bg-ink/30" />
      </Link>
    </section>
  );
}
