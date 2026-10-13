import {
  Cormorant_Garamond,
  Familjen_Grotesk,
  Fraunces,
  Hanken_Grotesk,
  Host_Grotesk,
  IBM_Plex_Mono,
  Instrument_Serif,
  Inter_Tight,
  Newsreader,
  Playfair_Display,
  Schibsted_Grotesk,
} from "next/font/google";

// Font pairings under review. Each sets a sans and a serif; the switcher swaps them live.
const hanken = Hanken_Grotesk({ variable: "--f-hanken", subsets: ["latin"], weight: ["300", "400", "500"] });
const instrument = Instrument_Serif({ variable: "--f-instrument", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });
const interTight = Inter_Tight({ variable: "--f-inter-tight", subsets: ["latin"], weight: ["300", "400", "500"] });
const cormorant = Cormorant_Garamond({ variable: "--f-cormorant", subsets: ["latin"], weight: ["400", "500"], style: ["normal", "italic"] });
const familjen = Familjen_Grotesk({ variable: "--f-familjen", subsets: ["latin"], weight: ["400", "500"] });
const newsreader = Newsreader({ variable: "--f-newsreader", subsets: ["latin"], weight: ["300", "400"], style: ["normal", "italic"] });
const host = Host_Grotesk({ variable: "--f-host", subsets: ["latin"], weight: ["300", "400", "500"] });
const fraunces = Fraunces({ variable: "--f-fraunces", subsets: ["latin"], weight: ["300", "400"], style: ["normal", "italic"] });
const schibsted = Schibsted_Grotesk({ variable: "--f-schibsted", subsets: ["latin"], weight: ["400", "500"] });
const playfair = Playfair_Display({ variable: "--f-playfair", subsets: ["latin"], weight: ["400"], style: ["normal", "italic"] });
const plex = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500"] });

export const fontVariables = [hanken, instrument, interTight, cormorant, familjen, newsreader, host, fraunces, schibsted, playfair, plex]
  .map((f) => f.variable)
  .join(" ");

export const PAIRINGS = [
  { id: "classic", name: "Classic", sans: "Hanken Grotesk", serif: "Instrument Serif" },
  { id: "urbain", name: "Saint Urbain", sans: "Inter Tight", serif: "Cormorant Garamond" },
  { id: "broadsheet", name: "Broadsheet", sans: "Familjen Grotesk", serif: "Newsreader" },
  { id: "soft", name: "Soft", sans: "Host Grotesk", serif: "Fraunces" },
  { id: "contrast", name: "Contrast", sans: "Schibsted Grotesk", serif: "Playfair Display" },
] as const;

export const DEFAULT_PAIRING = "classic";
