import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MixBar } from "@/components/mix-bar";
import { PageMotion } from "@/components/page-motion";
import { StoryRows } from "@/components/story-rows";
import { contributors, filings, getContributor, getStoriesBy, stories } from "@/data/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return contributors.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getContributor((await params).slug);
  return c ? { title: `${c.name} / Citizen Journalist`, description: c.bio } : {};
}

export default function ReporterPage({ params }: Props) {
  return (
    <Suspense>
      <Reporter params={params} />
    </Suspense>
  );
}

async function Reporter({ params }: Props) {
  const c = getContributor((await params).slug);
  if (!c) notFound();
  const own = getStoriesBy(c.slug);
  const others = stories.filter((s) => s.author !== c.slug).slice(0, 3);
  const wire = filings.filter((f) => f.author === c.slug);
  const [first, ...rest] = c.name.split(" ");

  return (
    <PageMotion>
      <section className="grid min-h-[100svh] lg:grid-cols-2">
        <div className="relative h-[80svh] overflow-hidden bg-ink lg:sticky lg:top-0 lg:h-[100svh]">
          <div data-parallax="6" className="absolute inset-0">
            <Image src={c.photo} alt={`Portrait of ${c.name}`} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="grain absolute inset-0 overflow-hidden" />
          <p className="mono absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-paper px-3 py-1.5">
            <span className={`size-2 rounded-full ${c.verified ? "bg-reported" : "bg-eyewitness"}`} />
            {c.verified ? "Identity confirmed by the desk" : "Identity check in progress"}
          </p>
        </div>

        <div className="px-4 pb-20 pt-24 sm:px-6 lg:pt-32">
          <p data-fade className="mono text-ink-2">
            {c.role} / {c.beat}
          </p>
          <h1 data-split="now" className="mt-6 text-[clamp(3.4rem,8vw,8.5rem)] font-light leading-[0.88] tracking-[-0.05em]">
            {first}
            <br />
            <span className="serif italic">{rest.join(" ")}</span>
          </h1>
          <p data-fade className="mt-4 text-lg text-ink-2">
            {c.location}
          </p>
          <p data-split className="mt-12 max-w-[34ch] text-[clamp(1.4rem,2vw,1.9rem)] font-light leading-[1.25] tracking-[-0.015em]">
            {c.bio}
          </p>

          <dl data-fade className="mt-14 grid grid-cols-2 gap-y-8 border-t border-ink pt-6 sm:grid-cols-4">
            {[
              ["Stories", own.length],
              ["Followers", c.followers],
              ["Since", c.since],
              ["Corrections", c.corrections],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="mono text-ink-2">{k}</dt>
                <dd className="mt-2 text-5xl font-light tracking-[-0.04em]">{v}</dd>
              </div>
            ))}
          </dl>

          {own.length > 0 && (
            <div data-fade className="mt-12">
              <p className="mono mb-3 text-ink-2">What {first} files</p>
              <MixBar blocks={own.flatMap((s) => s.blocks)} />
            </div>
          )}

          {wire.length > 0 && (
            <div data-fade className="mt-14 rounded-2xl bg-ink p-6 text-paper">
              <p className="mono flex items-center gap-2 text-paper/60">
                <span className="rec-dot size-2 rounded-full bg-rec" /> Latest on the wire
              </p>
              {wire.map((f) => (
                <p key={f.time} className="mt-4 text-2xl font-light leading-tight">
                  <span className="mono mr-3 align-middle text-sun">{f.time}</span>
                  {f.text}
                </p>
              ))}
            </div>
          )}

          <div className="mt-20">
            <p className="mono mb-6 text-ink-2">Stories by {first}</p>
            <StoryRows items={own} />
          </div>
          <div className="mt-20">
            <p className="mono mb-6 text-ink-2">Also on the wire</p>
            <StoryRows items={others} />
          </div>
        </div>
      </section>
    </PageMotion>
  );
}
