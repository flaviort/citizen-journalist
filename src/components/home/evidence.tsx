"use client";

import { useRef } from "react";
import { gifs } from "@/data/content";
import { Draggable, gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { SectionLabel } from "./stories-grid";

type Item =
  | { kind: "gif"; src: string; label: string; x: number; y: number; r: number; w: number }
  | { kind: "photo"; src: string; label: string; x: number; y: number; r: number; w: number }
  | { kind: "note"; text: string; x: number; y: number; r: number; w: number };

// Positions are percentages of the board, widths in vw (clamped in CSS).
const ITEMS: Item[] = [
  { kind: "gif", ...gifs[0], x: 4, y: 8, r: -6, w: 22 },
  { kind: "photo", src: "/media/img/phones-crowd.jpg", label: "Concert, Lisbon, 23:41", x: 28, y: 2, r: 4, w: 17 },
  { kind: "note", text: "Council vote pushed to next week. Ask why.", x: 49, y: 10, r: -3, w: 15 },
  { kind: "gif", ...gifs[1], x: 67, y: 4, r: 7, w: 24 },
  { kind: "gif", ...gifs[2], x: 6, y: 46, r: 5, w: 21 },
  { kind: "photo", src: "/media/img/lagos-2.jpg", label: "Oworonshoki, Lagos, 07:02", x: 36, y: 38, r: -8, w: 15 },
  { kind: "gif", ...gifs[3], x: 49, y: 42, r: -4, w: 20 },
  { kind: "note", text: "63% of boardings on routes that aren't on the map.", x: 79, y: 52, r: 6, w: 15 },
  { kind: "gif", ...gifs[5], x: 24, y: 62, r: 3, w: 17 },
  { kind: "photo", src: "/media/img/protest-3.jpg", label: "City hall steps, 18:20", x: 60, y: 60, r: -5, w: 19 },
];

export function Evidence() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-ev]");
      let z = 10;
      Draggable.create(items, {
        bounds: "[data-board]",
        inertia: true,
        onPress() {
          z += 1;
          gsap.set(this.target, { zIndex: z });
          gsap.to(this.target, { scale: 1.05, rotate: "+=2", duration: 0.3, ease: "power3" });
        },
        onRelease() {
          gsap.to(this.target, { scale: 1, duration: 0.5, ease: "back.out(2)" });
        },
      });
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Each note is pressed onto the board, then its tape goes on.
        const tl = gsap.timeline({ scrollTrigger: { trigger: "[data-board]", start: "top 65%" } });
        gsap.utils.shuffle([...items]).forEach((it, i) => {
          const at = i * 0.12;
          tl.from(it, { scale: 1.18, opacity: 0, y: -14, duration: 0.55, ease: "back.out(2.2)" }, at)
            .from(it.querySelector("[data-shadow]"), { boxShadow: "0 40px 60px -20px rgba(0,0,0,.45)", duration: 0.55, ease: "power2.out" }, at)
            .from(it.querySelector("[data-tape]"), { scaleX: 0, opacity: 0, duration: 0.35, ease: "power3.out" }, at + 0.32);
        });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="px-4 pt-32 sm:px-6 sm:pt-44">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <SectionLabel n="04">Seen this week</SectionLabel>
          <h2 className="mt-5 text-[clamp(2.4rem,5.5vw,5.8rem)] font-light leading-[0.95] tracking-[-0.035em]">
            The evidence <span className="serif italic">board.</span>
          </h2>
        </div>
        <p className="mono max-w-[30ch] text-ink-2">Raw footage and notes from reporters, before they become stories. Drag things around.</p>
      </div>

      <div data-board className="relative mt-10 h-[260vw] overflow-hidden rounded-[2rem] bg-paper-2 md:h-[54vw] md:max-h-[860px]">
        <div
          className="absolute inset-0 opacity-50"
          style={{ backgroundImage: "radial-gradient(#14141233 1px, transparent 1px)", backgroundSize: "22px 22px" }}
        />
        {ITEMS.map((it, i) => (
          <div
            key={i}
            data-ev
            data-cursor="Drag"
            className="absolute touch-none select-none"
            style={{ left: `${it.x}%`, top: `${it.y}%`, width: `clamp(150px, ${it.w}vw, 340px)`, rotate: `${it.r}deg` }}
          >
            <span data-tape className="absolute -top-3 left-1/2 z-10 h-6 w-20 origin-left -translate-x-1/2 rotate-[-4deg] bg-sun/80" />
            {it.kind === "note" ? (
              <div data-shadow className="bg-sun p-5 shadow-[0_18px_30px_-18px_rgba(0,0,0,.45)]">
                <p className="serif text-[clamp(1.3rem,1.8vw,1.9rem)] italic leading-[1.05]">{it.text}</p>
                <p className="mono mt-4 text-ink/60">Desk note</p>
              </div>
            ) : (
              <figure data-shadow className="bg-white p-2.5 pb-3 shadow-[0_18px_30px_-18px_rgba(0,0,0,.45)]">
                {/* eslint-disable-next-line @next/next/no-img-element -- animated GIFs and draggable photos stay as plain img */}
                <img src={it.src} alt="" draggable={false} className="aspect-[4/3] w-full object-cover" loading="lazy" />
                <figcaption className="mono mt-2 flex items-center justify-between">
                  <span>{it.label}</span>
                  {it.kind === "gif" && <span className="rounded bg-ink px-1 text-paper">gif</span>}
                </figcaption>
              </figure>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
