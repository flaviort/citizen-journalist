"use client";

import { useState } from "react";
import { PAIRINGS } from "@/lib/fonts";

// Review tool: pick a font pairing and the page reloads with it so text splits re-measure.
export function FontSwitcher() {
  const [open, setOpen] = useState(false);
  const current = open ? document.documentElement.dataset.font : "";

  const pick = (id: string) => {
    try {
      localStorage.setItem("cj-font", id);
    } catch {}
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 z-[70] text-ink">
      {open && (
        <ul className="mb-2 w-72 overflow-hidden rounded-2xl border border-ink/15 bg-paper shadow-[0_20px_40px_-20px_rgba(0,0,0,.35)]">
          {PAIRINGS.map((p) => (
            <li key={p.id} className="border-b border-ink/10 last:border-0">
              <button
                type="button"
                onClick={() => pick(p.id)}
                data-font={p.id}
                className={`block w-full px-4 py-3 text-left transition-colors hover:bg-paper-2 ${current === p.id ? "bg-sun" : ""}`}
              >
                <span className="flex items-baseline gap-2 text-2xl leading-none tracking-[-0.02em]" style={{ fontFamily: "var(--pair-sans)" }}>
                  <span className="font-light">Newsroom</span>
                  <span className="italic" style={{ fontFamily: "var(--pair-serif)", fontSizeAdjust: "ex-height 0.5" }}>
                    filed
                  </span>
                </span>
                <span className="mono mt-1.5 block text-ink-2">
                  {p.name}: {p.sans} + {p.serif}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="mono ml-auto flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-paper shadow-lg"
      >
        <span className="serif text-base normal-case italic">Aa</span> Fonts
      </button>
    </div>
  );
}
