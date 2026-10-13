import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment, Suspense } from "react";
import { AutoVideo } from "@/components/auto-video";
import { claimBg, MixBar } from "@/components/mix-bar";
import { PageMotion } from "@/components/page-motion";
import { blockLabels, getContributor, getStory, stories } from "@/data/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return stories.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const story = getStory((await params).slug);
  return story ? { title: `${story.title} / Citizen Journalist`, description: story.dek } : {};
}

export default function StoryPage({ params }: Props) {
  return (
    <Suspense>
      <Story params={params} />
    </Suspense>
  );
}

async function Story({ params }: Props) {
  const story = getStory((await params).slug);
  if (!story) notFound();
  const author = getContributor(story.author)!;
  const idx = stories.findIndex((s) => s.slug === story.slug);
  const next = stories[(idx + 1) % stories.length];
  const media: { at: number; node: React.ReactNode }[] = [];
  if (story.gallery[0]) media.push({ at: 1, node: <Figure src={story.gallery[0]} caption={`${story.location}, photographed by ${author.name}`} /> });
  if (story.video) media.push({ at: 3, node: <Clip src={story.video} caption={`Footage filed by ${author.name}`} /> });
  if (story.gallery[1]) media.push({ at: 4, node: <Figure src={story.gallery[1]} caption={`${story.location}, field photo`} narrow /> });

  return (
    <PageMotion>
      <span data-progress className="fixed inset-x-0 top-0 z-[55] block h-1 origin-left bg-sun" />

      <header className="relative h-[100svh] overflow-hidden bg-ink text-white">
        <div data-parallax="8" className="absolute inset-0">
          <Image src={story.cover} alt="" fill priority sizes="100vw" className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
        <div className="grain absolute inset-0 overflow-hidden" />
        <div className="relative flex h-full flex-col justify-between px-4 pb-8 pt-24 sm:px-6">
          <p className="mono flex justify-between">
            <span>
              {story.section} / {story.location}
            </span>
            <span>
              {story.date} / Filed {story.filedAt}
            </span>
          </p>
          <div>
            <h1 data-split="now" className="max-w-[20ch] text-[clamp(2.4rem,6.4vw,7rem)] font-light leading-[0.95] tracking-[-0.04em]">
              {story.title}
            </h1>
            <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
              <Link href={`/reporters/${author.slug}`} className="group flex items-center gap-3" data-cursor="Profile">
                <span className="relative size-12 overflow-hidden rounded-full">
                  <Image src={author.photo} alt="" fill sizes="48px" className="object-cover" />
                </span>
                <span>
                  <span className="serif block text-2xl italic leading-none group-hover:underline">{author.name}</span>
                  <span className="mono text-white/70">
                    {author.role} / {author.location}
                  </span>
                </span>
              </Link>
              <div className="w-full max-w-sm">
                <MixBar blocks={story.blocks} light />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6">
        <p data-split className="serif mx-auto mt-20 max-w-[26ch] text-center text-[clamp(1.9rem,3.6vw,3.4rem)] italic leading-[1.05]">
          {story.dek}
        </p>

        <div className="mx-auto mt-20 grid max-w-[1200px] gap-16 lg:grid-cols-[1fr_300px]">
          <article>
            {story.blocks.map((b, i) => (
              <Fragment key={i}>
                <div data-fade className="grid gap-3 py-5 md:grid-cols-[9rem_1fr] md:gap-8">
                  <span className="mono flex h-fit items-center gap-2 md:pt-2">
                    <span className={`size-2 rounded-full ${claimBg[b.kind]}`} />
                    {blockLabels[b.kind].label}
                  </span>
                  <p className="text-[1.3rem] leading-[1.55] tracking-[-0.005em] sm:text-[1.45rem]">{b.text}</p>
                </div>
                {media.filter((m) => m.at === i).map((m, j) => (
                  <Fragment key={j}>{m.node}</Fragment>
                ))}
              </Fragment>
            ))}
          </article>

          <aside className="space-y-10 lg:sticky lg:top-24 lg:self-start">
            <div data-fade>
              <p className="mono text-ink-2">How this was checked</p>
              <p className="mt-3 text-lg leading-snug">{story.checkedBy}</p>
            </div>
            <div data-fade>
              <p className="mono text-ink-2">Sources</p>
              <ul className="mt-3 divide-y divide-line border-y border-line">
                {story.sources.map((s) => (
                  <li key={s.label} className="py-3">
                    <p>{s.label}</p>
                    <p className="text-sm text-ink-2">{s.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div data-fade>
              <p className="mono text-ink-2">Corrections</p>
              <p className="mt-3 text-ink-2">None so far. Spotted something? Tell the desk.</p>
            </div>
          </aside>
        </div>
      </div>

      <Link href={`/stories/${next.slug}`} data-cursor="Next" className="group relative mt-32 block h-[70vh] overflow-hidden bg-ink text-white">
        <div data-parallax="10" className="absolute inset-0 opacity-60 transition-opacity duration-700 group-hover:opacity-90">
          <Image src={next.cover} alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="relative flex h-full flex-col justify-between p-4 sm:p-6">
          <p className="mono">Next story</p>
          <p className="max-w-[18ch] text-[clamp(2.2rem,5.5vw,6rem)] font-light leading-[0.95] tracking-[-0.04em]">
            {next.title} <span className="inline-block transition-transform duration-500 group-hover:translate-x-4">&rarr;</span>
          </p>
        </div>
      </Link>
    </PageMotion>
  );
}

function Figure({ src, caption, narrow = false }: { src: string; caption: string; narrow?: boolean }) {
  return (
    <figure className={`my-12 ${narrow ? "md:ml-[11rem] md:w-2/3" : ""}`}>
      <div data-reveal className="relative aspect-[3/2] overflow-hidden">
        <div data-parallax="6" className="absolute inset-0">
          <Image src={src} alt="" fill sizes="(min-width: 1024px) 70vw, 100vw" className="object-cover" />
        </div>
      </div>
      <figcaption className="mono mt-3 text-ink-2">{caption}</figcaption>
    </figure>
  );
}

function Clip({ src, caption }: { src: string; caption: string }) {
  return (
    <figure className="my-12">
      <div data-reveal className="relative aspect-video overflow-hidden bg-ink">
        <AutoVideo src={src} className="absolute inset-0 size-full object-cover" />
        <span className="mono absolute left-3 top-3 flex items-center gap-2 text-white">
          <span className="rec-dot size-2 rounded-full bg-rec" /> Rec
        </span>
      </div>
      <figcaption className="mono mt-3 text-ink-2">{caption}</figcaption>
    </figure>
  );
}
