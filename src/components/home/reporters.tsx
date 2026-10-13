"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { contributors } from "@/data/content";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { SectionLabel } from "./stories-grid";

export function Reporters() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and (min-width: 768px)`, () => {
        const el = track.current!;
        const dist = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: { trigger: "[data-pin]", start: "top top", end: () => `+=${dist()}`, scrub: 1, pin: true, invalidateOnRefresh: true },
        });
        // A sideways trackpad swipe moves the pinned track too, by scrolling the page.
        const pin = ref.current!.querySelector<HTMLElement>("[data-pin]")!;
        const onWheel = (e: WheelEvent) => {
          if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || !tween.scrollTrigger?.isActive) return;
          e.preventDefault();
          const lenis = (window as unknown as { lenis?: { scrollTo: (y: number, o?: object) => void; targetScroll: number } }).lenis;
          if (lenis) lenis.scrollTo(lenis.targetScroll + e.deltaX);
          else window.scrollBy(0, e.deltaX);
        };
        pin.addEventListener("wheel", onWheel, { passive: false });
        gsap.utils.toArray<HTMLElement>("[data-card-img]").forEach((img) => {
          gsap.fromTo(img, { xPercent: -8 }, { xPercent: 8, ease: "none", scrollTrigger: { trigger: img, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
        });
        return () => pin.removeEventListener("wheel", onWheel);
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="reporters" className="pt-28 sm:pt-40">
      <div data-pin data-lenis-prevent-horizontal className="flex min-h-[100svh] flex-col justify-center overflow-hidden">
        <div className="flex flex-wrap items-end justify-between gap-6 px-4 sm:px-6">
          <div>
            <SectionLabel n="03">The people filing</SectionLabel>
            <h2 className="mt-5 text-[clamp(2.4rem,5.5vw,5.8rem)] font-light leading-[0.95] tracking-[-0.035em]">
              1,284 reporters. <span className="serif italic">None on staff.</span>
            </h2>
          </div>
          <p className="mono max-w-[30ch] text-ink-2">Every reporter has a public record: beat, filing history and every correction we made.</p>
        </div>
        <div
          ref={track}
          className="mt-10 flex w-max gap-4 px-4 max-md:w-auto max-md:snap-x max-md:snap-mandatory max-md:overflow-x-auto sm:px-6"
        >
          {contributors.map((c, i) => (
            <Link
              key={c.slug}
              href={`/reporters/${c.slug}`}
              data-cursor="Profile"
              className="group w-[78vw] shrink-0 snap-start md:w-[30vw] lg:w-[24vw]"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-paper-2">
                <div data-card-img className="absolute -inset-x-[10%] inset-y-0">
                  <Image
                    src={c.photo}
                    alt={`Portrait of ${c.name}`}
                    fill
                    sizes="(min-width: 1024px) 28vw, (min-width: 768px) 34vw, 80vw"
                    className="object-cover grayscale transition-[filter,transform] duration-700 group-hover:scale-[1.04] group-hover:grayscale-0"
                  />
                </div>
                <span className="mono absolute left-3 top-3 text-white mix-blend-difference">
                  {String(i + 1).padStart(2, "0")} / {String(contributors.length).padStart(2, "0")}
                </span>
                <span className="mono absolute bottom-3 left-3 rounded-full bg-paper px-2.5 py-1">{c.role}</span>
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-3">
                <p className="serif text-[2rem] leading-none">{c.name}</p>
                <p className="mono text-ink-2">{c.location.split(",")[0]}</p>
              </div>
              <p className="mt-1 text-ink-2">{c.beat}</p>
            </Link>
          ))}
          <div className="flex w-[60vw] shrink-0 items-center md:w-[26vw]">
            <p className="text-[clamp(2rem,3.5vw,3.5rem)] font-light leading-[1] tracking-[-0.03em]">
              And 1,278 <span className="serif italic">more.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
