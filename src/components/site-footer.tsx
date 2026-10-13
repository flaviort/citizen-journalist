"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Globe } from "@/components/globe";
import { contributors, sections } from "@/data/content";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

const CLOCKS = [
  ["Lagos", "Africa/Lagos"],
  ["Belem", "America/Belem"],
  ["Osaka", "Asia/Tokyo"],
  ["Detroit", "America/Detroit"],
  ["Marseille", "Europe/Paris"],
  ["Mexico City", "America/Mexico_City"],
] as const;

function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);
  return now;
}

function WorldClocks() {
  const now = useNow();
  return (
    <ul className="grid grid-cols-2 border-y border-paper/15 sm:grid-cols-3 lg:grid-cols-6">
      {CLOCKS.map(([city, tz]) => {
        const parts = now ? new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(now) : [];
        const h = parts.find((p) => p.type === "hour")?.value ?? "--";
        const m = parts.find((p) => p.type === "minute")?.value ?? "--";
        const awake = Number(h) >= 6 && Number(h) < 23;
        return (
          <li key={city} className="border-paper/15 px-4 py-5 sm:px-6 [&:not(:last-child)]:border-r">
            <p className="serif text-xl italic leading-none">{city}</p>
            <p className="mt-3 text-[clamp(2rem,3.4vw,3.2rem)] font-light leading-none tracking-[-0.03em] tabular-nums">
              {h}
              <span className="rec-dot">:</span>
              {m}
            </p>
            <p className="mono mt-3 flex items-center gap-1.5 text-paper/50">
              <span className={`size-1.5 rounded-full ${awake ? "bg-rec" : "bg-paper/30"}`} />
              {awake ? "Filing now" : "Night desk"}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

function Newsletter() {
  const [sent, setSent] = useState(false);
  return (
    <div className="rounded-3xl bg-paper p-6 text-ink sm:p-8">
      <p className="mono flex items-center gap-2">
        <span className="size-2 rounded-full bg-sun ring-1 ring-ink/30" /> The Morning Wire
      </p>
      <p className="mt-4 text-2xl font-light leading-tight tracking-[-0.02em]">
        Five filings from five cities, in your inbox at <span className="serif italic">7am your time.</span>
      </p>
      {sent ? (
        <p className="mono mt-8 border-b border-ink pb-3">Thanks. This is a prototype, so nothing was sent.</p>
      ) : (
        <form
          className="mt-8 flex items-center gap-3 border-b border-ink"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <label htmlFor="nl-email" className="sr-only">
            Email address
          </label>
          <input
            id="nl-email"
            type="email"
            required
            placeholder="you@example.com"
            className="min-w-0 flex-1 bg-transparent py-3 text-lg outline-none placeholder:text-ink/35"
          />
          <button type="submit" className="mb-2 grid size-10 shrink-0 place-items-center rounded-full bg-ink text-paper transition-colors hover:bg-rec" aria-label="Subscribe">
            &rarr;
          </button>
        </form>
      )}
    </div>
  );
}

// Giant wordmark, sized to fill the width exactly, one span per letter.
function Wordmark() {
  const box = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const fit = () => {
      const b = box.current;
      const t = text.current;
      if (!b || !t) return;
      t.style.fontSize = "100px";
      t.style.fontSize = `${(100 * b.clientWidth) / t.scrollWidth}px`;
      ScrollTrigger.refresh();
    };
    fit();
    void document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(fit);
    if (box.current) ro.observe(box.current);
    return () => ro.disconnect();
  }, []);

  const word = "CITIZEN·JOURNALIST";
  return (
    <div ref={box} data-wordmark className="overflow-hidden px-2 sm:px-3" aria-label="Citizen Journalist">
      <p ref={text} aria-hidden className="inline-flex w-max whitespace-nowrap font-light uppercase leading-[0.8] tracking-[-0.02em]">
        {word.split("").map((ch, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.06em]">
            <span data-letter className="inline-block">
              <span className="inline-block transition-[color,transform] duration-300 hover:-translate-y-[0.08em] hover:text-sun">{ch}</span>
            </span>
          </span>
        ))}
      </p>
    </div>
  );
}

export function SiteFooter() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-letter]", {
          yPercent: 100,
          stagger: 0.035,
          duration: 1.2,
          // The footer lives in the layout and mounts before page pins exist, so refresh it last.
          scrollTrigger: { trigger: "[data-wordmark]", start: "top 92%", refreshPriority: -1 },
        });
        gsap.from("[data-foot-in]", { y: 40, opacity: 0, stagger: 0.1, scrollTrigger: { trigger: ref.current, start: "top 80%", refreshPriority: -1 } });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  const top = () => {
    const lenis = (window as unknown as { lenis?: { scrollTo: (y: number, o?: object) => void } }).lenis;
    if (lenis) lenis.scrollTo(0, { duration: 2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer ref={ref} className="relative mt-32 overflow-hidden rounded-t-[2rem] bg-ink text-paper sm:rounded-t-[3rem]">
      <Globe className="pointer-events-none absolute -right-[12vw] top-[18%] w-[52vw] max-w-[760px] text-paper/15" speed={0.06} dots={false} />

      <div className="relative grid gap-12 px-4 pb-16 pt-20 sm:px-6 lg:grid-cols-[1.3fr_1fr] lg:pt-28">
        <div data-foot-in>
          <h2 className="text-[clamp(2.8rem,6.4vw,7rem)] font-light leading-[0.92] tracking-[-0.04em]">
            Tips, footage, corrections.
            <br />
            <span className="serif italic text-sun">The desk is open.</span>
          </h2>
          <a href="mailto:desk@citizenjournalist.news" className="group mt-10 inline-flex items-center gap-4 text-xl sm:text-2xl">
            <span className="relative">
              desk@citizenjournalist.news
              <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-100 bg-paper transition-transform duration-500 group-hover:origin-left group-hover:scale-x-0" />
            </span>
            <span className="transition-transform duration-500 group-hover:translate-x-2">&rarr;</span>
          </a>
          <p className="mono mt-4 text-paper/50">Every tip is read by a person. We reply within a day.</p>
        </div>
        <div data-foot-in className="lg:pt-4">
          <Newsletter />
        </div>
      </div>

      <div data-foot-in className="relative">
        <WorldClocks />
      </div>

      <div className="relative grid grid-cols-2 gap-10 px-4 py-16 sm:px-6 md:grid-cols-4">
        <nav data-foot-in aria-label="Sections">
          <p className="mono text-paper/50">Read</p>
          <ul className="mt-4 space-y-1.5 text-lg">
            {sections.map((s) => (
              <li key={s}>
                <Link href="/#stories" className="transition-colors hover:text-sun">
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav data-foot-in aria-label="Reporters">
          <p className="mono text-paper/50">Reporters</p>
          <ul className="mt-4 space-y-1.5 text-lg">
            {contributors.map((c) => (
              <li key={c.slug}>
                <Link href={`/reporters/${c.slug}`} className="transition-colors hover:text-sun">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav data-foot-in aria-label="Standards">
          <p className="mono text-paper/50">Standards</p>
          <ul className="mt-4 space-y-1.5 text-lg">
            <li><Link href="/#stories" className="transition-colors hover:text-sun">How we label claims</Link></li>
            <li><Link href="/#stories" className="transition-colors hover:text-sun">Corrections log</Link></li>
            <li><Link href="/#file" className="transition-colors hover:text-sun">File a story</Link></li>
            <li><Link href="/#reporters" className="transition-colors hover:text-sun">Become a reporter</Link></li>
          </ul>
        </nav>
        <div data-foot-in>
          <p className="mono text-paper/50">Today</p>
          <p className="mt-4 text-[3.5rem] font-light leading-none tracking-[-0.04em]">214</p>
          <p className="text-paper/60">filings from 41 cities</p>
          <p className="mt-6 text-[3.5rem] font-light leading-none tracking-[-0.04em]">0</p>
          <p className="text-paper/60">press passes</p>
        </div>
      </div>

      <Wordmark />

      <div className="mono relative flex flex-wrap items-center justify-between gap-4 px-4 py-5 text-paper/50 sm:px-6">
        <span>&copy; 2026 Citizen Journalist</span>
        <span>Prototype. People and stories are fictional. Photos Unsplash, video Mixkit.</span>
        <button type="button" onClick={top} className="flex items-center gap-2 text-paper transition-colors hover:text-sun">
          Back to top <span aria-hidden>&uarr;</span>
        </button>
      </div>
    </footer>
  );
}
