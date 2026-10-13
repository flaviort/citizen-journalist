"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Globe } from "@/components/globe";
import { getContributor, stories } from "@/data/content";
import { Draggable, gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

export function WireCarousel() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const t = track.current!;
      const update = function (this: Draggable) {
        const p = this.minX ? this.x / this.minX : 0;
        gsap.set(bar.current, { scaleX: 0.15 + p * 0.85 });
      };
      const [drag] = Draggable.create(t, {
        type: "x",
        bounds: "[data-viewport]",
        inertia: true,
        edgeResistance: 0.85,
        onDrag: update,
        onThrowUpdate: update,
      });
      gsap.set(bar.current, { scaleX: 0.15 });

      // Sideways trackpad swipes move the carousel; vertical ones keep scrolling the page.
      const vp = ref.current!.querySelector<HTMLElement>("[data-viewport]")!;
      const xTo = gsap.quickTo(t, "x", { duration: 0.6, ease: "power3", onUpdate: () => update.call(drag.update()) });
      let target = 0;
      const onWheel = (e: WheelEvent) => {
        if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
        e.preventDefault();
        drag.update();
        if (!gsap.isTweening(t)) target = drag.x;
        target = gsap.utils.clamp(drag.minX, 0, target - e.deltaX);
        xTo(target);
      };
      vp.addEventListener("wheel", onWheel, { passive: false });
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-pill]", { scaleX: 0.3, opacity: 0, duration: 1.6, scrollTrigger: { trigger: ref.current, start: "top 75%" } });
        gsap.from("[data-wire-card]", { x: 160, opacity: 0, stagger: 0.08, duration: 1.4, scrollTrigger: { trigger: t, start: "top 85%" } });
      });
      return () => {
        vp.removeEventListener("wheel", onWheel);
        mm.revert();
      };
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="wire" className="mt-32 bg-sun py-6 sm:mt-44 sm:py-8">
      <div className="px-4 sm:px-6">
        <h2
          data-pill
          className="flex items-center justify-center gap-[0.18em] rounded-full border-[0.05em] border-ink px-[0.4em] py-[0.06em] text-[clamp(2.6rem,11vw,12rem)] font-light uppercase leading-none tracking-[-0.03em]"
        >
          On the
          <span className="flex gap-[0.04em]" aria-hidden>
            <Globe className="size-[0.78em]" dots={false} speed={0.5} />
            <Globe className="size-[0.78em]" dots={false} speed={-0.5} />
          </span>
          Wire
        </h2>
      </div>
      <div data-viewport data-lenis-prevent-horizontal className="mt-6 overflow-hidden">
        <div ref={track} data-cursor="Drag" data-draggable className="flex w-max gap-4 px-4 sm:px-6">
          {[...stories, ...stories.slice(0, 2)].map((s, i) => {
            const a = getContributor(s.author)!;
            return (
              <article key={`${s.slug}-${i}`} data-wire-card className="w-[78vw] shrink-0 border-r border-ink/25 pr-4 sm:w-[30vw] lg:w-[22vw]">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={s.gallery[0] ?? s.cover} alt="" fill sizes="(min-width: 1024px) 22vw, 78vw" className="pointer-events-none object-cover" draggable={false} />
                </div>
                <h3 className="mt-3 text-xl leading-[1.15] tracking-[-0.01em]">
                  <Link href={`/stories/${s.slug}`} className="hover:underline" draggable={false}>
                    {s.title}
                  </Link>
                </h3>
                <p className="mono mt-3">{s.date.replace(", 2026", "")} / {s.filedAt}</p>
                <p className="mt-6 text-sm">
                  {a.name}, <span className="serif text-base italic">{s.location}</span>
                </p>
              </article>
            );
          })}
        </div>
      </div>
      <div className="mx-auto mt-8 h-[3px] w-40 overflow-hidden rounded-full bg-ink/20">
        <span ref={bar} className="block h-full origin-left bg-ink" />
      </div>
    </section>
  );
}
