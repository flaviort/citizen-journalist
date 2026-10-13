"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Globe } from "@/components/globe";
import { gsap, useGSAP } from "@/lib/gsap";

const NAV = [
  { href: "/#stories", sans: "Latest", serif: "stories" },
  { href: "/#reporters", sans: "The", serif: "reporters" },
  { href: "/#wire", sans: "On the", serif: "wire" },
  { href: "/#file", sans: "File a", serif: "story" },
];

function Clock() {
  const [t, setT] = useState("--:--:--");
  useEffect(() => {
    const f = () => setT(new Date().toLocaleTimeString("en-GB", { hour12: false }));
    f();
    const id = setInterval(f, 1000);
    return () => clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>{t}</span>;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline>(null);

  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ paused: true })
        .set(menu.current, { display: "flex" })
        .fromTo(menu.current, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "expo.inOut" })
        .from("[data-menu-item]", { yPercent: 110, stagger: 0.06, duration: 0.9 }, "-=0.35")
        .from("[data-menu-fade]", { opacity: 0, duration: 0.6 }, "<0.2");
    },
    { scope: menu }
  );

  useEffect(() => {
    if (open) tl.current?.timeScale(1).play();
    else tl.current?.timeScale(1.6).reverse();
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 text-white mix-blend-difference">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="text-[0.95rem] font-medium uppercase tracking-[0.14em]" aria-label="Citizen Journalist, home">
            Citizen<span className="mx-1">&middot;</span>Journalist
          </Link>
          <div className="flex items-center gap-6">
            <span className="mono hidden items-center gap-2 sm:flex">
              <span className="rec-dot size-2 rounded-full bg-white" />
              Live <Clock />
            </span>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="group flex items-center gap-3"
            >
              <span className="mono">{open ? "Close" : "Menu"}</span>
              <span className="relative block h-3 w-7">
                <span className={`absolute left-0 top-0 h-px w-full bg-white transition-transform duration-500 ${open ? "translate-y-1.5 rotate-45" : ""}`} />
                <span className={`absolute bottom-0 left-0 h-px w-full bg-white transition-transform duration-500 ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="site-menu"
        ref={menu}
        className="fixed inset-0 z-40 hidden flex-col justify-between bg-sun px-4 pb-6 pt-24 sm:px-6"
        aria-hidden={!open}
      >
        <nav aria-label="Main">
          <ul>
            {NAV.map((n) => (
              <li key={n.href} className="overflow-hidden border-b border-ink/20">
                <Link
                  href={n.href}
                  data-menu-item
                  onClick={() => setOpen(false)}
                  className="group flex items-baseline gap-4 py-2 text-[clamp(2.75rem,8vw,7.5rem)] leading-[0.95] tracking-[-0.03em]"
                >
                  <span className="font-light">{n.sans}</span>
                  <span className="serif italic transition-transform duration-500 group-hover:translate-x-4">{n.serif}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div data-menu-fade className="flex items-end justify-between gap-6">
          <p className="mono max-w-xs">A newsroom with no newsroom. Filed from 41 cities today.</p>
          <Globe className="size-24 text-ink sm:size-32" dots={false} speed={0.3} />
        </div>
      </div>
    </>
  );
}
