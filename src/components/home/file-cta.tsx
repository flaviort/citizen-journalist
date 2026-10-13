"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";

const STEPS = [
  ["Film it, count it, read it", "Send what you saw, what you counted or the documents you found."],
  ["An editor checks every claim", "We confirm sources and label each paragraph as reported, eyewitness or take."],
  ["It goes out under your name", "You keep the rights. Your record grows with every story."],
];

export function FileCta() {
  const ref = useRef<HTMLElement>(null);
  const btn = useRef<HTMLAnchorElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create("[data-cta-title]", { type: "chars,lines", mask: "lines" });
        gsap.from(split.chars, {
          yPercent: 120,
          rotate: 8,
          stagger: 0.018,
          duration: 1.2,
          scrollTrigger: { trigger: ref.current, start: "top 70%" },
        });
        gsap.from("[data-step]", { y: 30, opacity: 0, stagger: 0.12, scrollTrigger: { trigger: "[data-steps]", start: "top 85%" } });
      });

      // Magnetic button
      const el = btn.current!;
      const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      const move = contextSafe!((e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.35);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
      });
      const leave = contextSafe!(() => {
        xTo(0);
        yTo(0);
      });
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
        mm.revert();
      };
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="file" className="px-4 pt-32 sm:px-6 sm:pt-44">
      <h2 data-cta-title className="text-[clamp(3.4rem,13vw,15rem)] font-light leading-[0.86] tracking-[-0.05em]">
        You were there.
        <br />
        <span className="serif italic">File it.</span>
      </h2>
      <div className="mt-12 grid items-end gap-12 lg:grid-cols-[1fr_auto]">
        <ol data-steps className="grid gap-8 sm:grid-cols-3">
          {STEPS.map(([t, d], i) => (
            <li key={t} data-step className="border-t border-ink pt-4">
              <p className="mono text-ink-2">Step {i + 1}</p>
              <p className="mt-3 text-xl leading-tight">{t}</p>
              <p className="mt-2 text-ink-2">{d}</p>
            </li>
          ))}
        </ol>
        <Link
          ref={btn}
          href="/#file"
          className="grid size-44 place-items-center rounded-full bg-ink text-center text-paper transition-colors hover:bg-rec sm:size-52"
        >
          <span className="text-lg leading-tight">
            Start
            <br />
            <span className="serif text-3xl italic">filing</span>
          </span>
        </Link>
      </div>
    </section>
  );
}
