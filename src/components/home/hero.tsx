"use client";

import { useEffect, useRef, useState } from "react";
import { AutoVideo } from "@/components/auto-video";
import { gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";

function Timecode() {
  const [t, setT] = useState("00:00:00");
  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const s = Math.floor((Date.now() - start) / 1000);
      setT(`00:${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <span>{t}</span>;
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const cleanups: (() => void)[] = [];
      gsap.set("[data-phone]", { xPercent: -50, yPercent: -50 });
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create("[data-hero-title]", { type: "lines,words", linesClass: "split-line", mask: "lines" });
        gsap.set(split.words, { yPercent: 110 });
        gsap.set("[data-phone-reveal]", { clipPath: "inset(100% 0% 0% 0%)" });

        const enter = () =>
          gsap
            .timeline()
            .to(split.words, { yPercent: 0, stagger: 0.025, duration: 1.3 })
            .to("[data-phone-reveal]", { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" }, 0.25)
            .from("[data-phone]", { scale: 0.7, duration: 1.6, ease: "expo.inOut" }, 0.25)
            .from("[data-hero-meta]", { opacity: 0, y: 12, stagger: 0.08, duration: 1 }, 0.6);

        const w = window as unknown as { __introDone?: boolean };
        const onDone = contextSafe!(() => enter());
        if (w.__introDone) onDone();
        else window.addEventListener("intro:done", onDone, { once: true });
        cleanups.push(() => window.removeEventListener("intro:done", onDone));

        // The phone recording grows into the full frame as you scroll.
        const tl = gsap.timeline({
          scrollTrigger: { trigger: ref.current, start: "top top", end: "+=160%", scrub: 1, pin: true },
          defaults: { ease: "none" },
        });
        tl.to("[data-phone]", { width: "100vw", height: "100vh", top: "50%", borderRadius: 0, duration: 1 }, 0)
          .to("[data-hero-copy]", { yPercent: -60, opacity: 0, duration: 0.6 }, 0)
          .to("[data-phone-ui]", { opacity: 0, duration: 0.3 }, 0.1)
          .fromTo("[data-full-ui]", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.7)
          .from("[data-full-line]", { yPercent: 110, stagger: 0.05, duration: 0.3 }, 0.7);
      });
      return () => {
        cleanups.forEach((f) => f());
        mm.revert();
      };
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="relative h-[100svh] overflow-hidden">
      <div data-hero-copy className="relative z-10 px-4 pt-28 text-center sm:px-6 sm:pt-32">
        <h1
          data-hero-title
          className="mx-auto max-w-[17ch] text-[clamp(2.3rem,5.4vw,6rem)] font-light leading-[0.98] tracking-[-0.035em]"
        >
          Citizen Journalist is a newsroom with no newsroom, <span className="serif italic">filed by the people who were there</span>
        </h1>
        <div className="mono mx-auto mt-6 flex max-w-xl justify-between text-ink-2">
          <span data-hero-meta>Est. 2026</span>
          <span data-hero-meta>1,284 reporters</span>
          <span data-hero-meta>0 press passes</span>
        </div>
      </div>

      <div
        data-phone
        data-cursor="Scroll"
        className="absolute left-1/2 top-[76%] z-0 h-[36vh] w-[20.25vh] overflow-hidden rounded-[28px] bg-ink sm:top-[77%] sm:h-[38vh] sm:w-[21.4vh]"
      >
        <div data-phone-reveal className="absolute inset-0">
        <AutoVideo className="absolute inset-0 size-full object-cover" src="/media/v/22427.mp4" poster="/media/poster/22427.jpg" />
        <div className="grain absolute inset-0 overflow-hidden" />
        <div data-phone-ui className="mono absolute inset-0 flex flex-col justify-between p-3 text-white">
          <div className="flex justify-between">
            <span className="flex items-center gap-1.5 rounded bg-rec px-1.5 py-0.5">
              <span className="rec-dot size-1.5 rounded-full bg-white" />
              <Timecode />
            </span>
            <span>4K</span>
          </div>
          <div className="mx-auto size-10 rounded-full border-[3px] border-white/90 p-0.5">
            <div className="size-full rounded-full bg-rec" />
          </div>
        </div>
        <div data-full-ui className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 text-white opacity-0 sm:p-6">
          <div className="mono flex justify-between pt-12">
            <span className="flex items-center gap-2">
              <span className="rec-dot size-2 rounded-full bg-rec" /> Rec <Timecode />
            </span>
            <span>Filmed on a phone / Lisbon / 23:41</span>
          </div>
          <div className="pb-2">
            <p className="text-[clamp(2.6rem,8vw,9rem)] font-light leading-[0.9] tracking-[-0.04em]">
              <span className="block overflow-hidden"><span data-full-line className="block">Everyone is</span></span>
              <span className="block overflow-hidden"><span data-full-line className="serif block italic">holding a camera.</span></span>
            </p>
            <p className="mono mt-4 max-w-sm text-white/80">We turn what you film into reporting that holds up. Checked, labelled and published under your name.</p>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
