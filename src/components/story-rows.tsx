"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { Story } from "@/data/content";
import { gsap, useGSAP } from "@/lib/gsap";

// List of stories with a preview image that trails the cursor.
export function StoryRows({ items }: { items: Story[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const prev = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useGSAP(
    () => {
      const el = prev.current!;
      const x = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
      const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
      const move = (e: PointerEvent) => {
        x(e.clientX);
        y(e.clientY);
      };
      window.addEventListener("pointermove", move);
      return () => window.removeEventListener("pointermove", move);
    },
    { scope: ref }
  );

  useGSAP(() => {
    gsap.to(prev.current, { scale: active === null ? 0 : 1, rotate: active === null ? -8 : 0, duration: 0.6 });
  }, { dependencies: [active] });

  return (
    <div ref={ref} onPointerLeave={() => setActive(null)}>
      <ul className="border-t border-ink">
        {items.map((s, i) => (
          <li key={s.slug} className="border-b border-ink/25">
            <Link
              href={`/stories/${s.slug}`}
              onPointerEnter={() => setActive(i)}
              className="grid grid-cols-[1fr_auto] items-baseline gap-4 py-6 transition-[padding] duration-500 hover:pl-4 md:grid-cols-[8rem_1fr_auto]"
            >
              <span className="mono hidden text-ink-2 md:block">{s.section}</span>
              <span className="text-[clamp(1.4rem,2.6vw,2.4rem)] font-light leading-[1.05] tracking-[-0.02em]">{s.title}</span>
              <span className="mono text-ink-2">{s.date.replace(", 2026", "")}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div
        ref={prev}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-30 hidden aspect-[4/3] w-72 -translate-x-1/2 -translate-y-1/2 scale-0 overflow-hidden md:block"
      >
        {items.map((s, i) => (
          <Image key={s.slug} src={s.cover} alt="" fill sizes="288px" className={`object-cover transition-opacity duration-300 ${active === i ? "opacity-100" : "opacity-0"}`} />
        ))}
      </div>
    </div>
  );
}
