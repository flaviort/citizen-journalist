"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// Wireframe globe drawn in SVG. Meridians are ellipses whose width follows the
// rotation, and city dots are projected orthographically so they slip behind the
// sphere as it turns.
const CITIES: [string, number, number][] = [
  ["Lagos", 6.5, 3.4],
  ["Belem", -1.4, -48.5],
  ["Osaka", 34.7, 135.5],
  ["Detroit", 42.3, -83],
  ["Marseille", 43.3, 5.4],
  ["Mexico City", 19.4, -99.1],
  ["Nairobi", -1.3, 36.8],
  ["Tbilisi", 41.7, 44.8],
  ["Bengaluru", 12.9, 77.6],
];

const R = 100;
const MERIDIANS = 10;
const PARALLELS = [-60, -30, 0, 30, 60];

export function Globe({
  className = "",
  stroke = "currentColor",
  dots = true,
  speed = 0.12,
}: {
  className?: string;
  stroke?: string;
  dots?: boolean;
  speed?: number;
}) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const svg = ref.current;
      if (!svg) return;
      const mer = Array.from(svg.querySelectorAll<SVGEllipseElement>("[data-m]"));
      const pts = Array.from(svg.querySelectorAll<SVGGElement>("[data-c]"));
      const tilt = (18 * Math.PI) / 180;
      let rot = 0.6;
      const render = () => {
        mer.forEach((m, i) => {
          const a = rot + (i * Math.PI) / MERIDIANS;
          m.setAttribute("rx", String(Math.abs(Math.sin(a)) * R));
        });
        pts.forEach((p, i) => {
          const [, lat, lon] = CITIES[i];
          const la = (lat * Math.PI) / 180;
          const lo = (lon * Math.PI) / 180 + rot;
          let x = Math.cos(la) * Math.sin(lo);
          let y = Math.sin(la);
          const z = Math.cos(la) * Math.cos(lo);
          // tilt toward viewer
          const y2 = y * Math.cos(tilt) - z * Math.sin(tilt);
          const z2 = y * Math.sin(tilt) + z * Math.cos(tilt);
          y = y2;
          x = x * R;
          p.setAttribute("transform", `translate(${x.toFixed(2)} ${(-y * R).toFixed(2)})`);
          p.style.opacity = z2 > 0 ? "1" : "0";
        });
      };
      render();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const tick = (_t: number, dt: number) => {
        rot += (dt / 1000) * speed;
        render();
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { scope: ref }
  );

  return (
    <svg ref={ref} viewBox="-104 -104 208 208" className={className} fill="none" aria-hidden>
      <g stroke={stroke} strokeWidth="0.7" vectorEffect="non-scaling-stroke">
        <circle r={R} />
        {PARALLELS.map((lat) => {
          const y = Math.sin((lat * Math.PI) / 180) * R;
          const rx = Math.cos((lat * Math.PI) / 180) * R;
          return <ellipse key={lat} cx={0} cy={-y * 0.95} rx={rx} ry={rx * 0.18} />;
        })}
        {Array.from({ length: MERIDIANS }).map((_, i) => (
          <ellipse key={i} data-m cx={0} cy={0} rx={R} ry={R} />
        ))}
      </g>
      {dots &&
        CITIES.map(([name]) => (
          <g key={name} data-c>
            <circle r={6} fill="#efe24a" opacity={0.35} />
            <circle r={2.6} fill="#e3392b" />
          </g>
        ))}
    </svg>
  );
}
