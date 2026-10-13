"use client";

import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin, useGSAP);
  gsap.defaults({ ease: "expo.out", duration: 1.2 });
  // Layout parts (footer) mount before page sections, so order triggers by position on every refresh.
  ScrollTrigger.addEventListener("refreshInit", () => ScrollTrigger.sort());
}

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export { Draggable, gsap, ScrollTrigger, SplitText, useGSAP };
