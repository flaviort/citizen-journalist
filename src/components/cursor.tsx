"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// A small dot that grows into a labelled disc over anything with data-cursor="label".
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useGSAP(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(hover: none)").matches) return;
    const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });
    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      const next = t?.dataset.cursor ?? "";
      setLabel((prev) => (prev === next ? prev : next));
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  });

  useGSAP(
    () => {
      gsap.to(ref.current, {
        width: label ? 96 : 10,
        height: label ? 96 : 10,
        backgroundColor: label ? "#efe24a" : "#141412",
        duration: 0.5,
      });
    },
    { dependencies: [label] }
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className="cursor pointer-events-none fixed left-0 top-0 z-[100] grid size-[10px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ink"
    >
      <span className="mono text-[0.625rem] text-ink transition-opacity" style={{ opacity: label ? 1 : 0 }}>
        {label}
      </span>
    </div>
  );
}
