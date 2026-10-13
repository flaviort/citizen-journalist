import { CityMarquee } from "@/components/home/marquee";
import { Evidence } from "@/components/home/evidence";
import { FileCta } from "@/components/home/file-cta";
import { Hero } from "@/components/home/hero";
import { Intro } from "@/components/home/intro";
import { Manifesto } from "@/components/home/manifesto";
import { Reporters } from "@/components/home/reporters";
import { StoriesGrid } from "@/components/home/stories-grid";
import { WireCarousel } from "@/components/home/wire-carousel";
import { WireVideo } from "@/components/home/wire-video";

export default function Home() {
  return (
    <>
      <Intro />
      <Hero />
      <StoriesGrid />
      <Manifesto />
      <CityMarquee />
      <WireVideo />
      <Reporters />
      <Evidence />
      <WireCarousel />
      <FileCta />
    </>
  );
}
