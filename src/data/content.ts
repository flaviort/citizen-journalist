// Mock content for the prototype. No backend yet.

export type ContributorRole = "Citizen journalist" | "Writer" | "Creator";

export type Contributor = {
  slug: string;
  name: string;
  role: ContributorRole;
  location: string;
  beat: string;
  bio: string;
  followers: string;
  since: string;
  corrections: number;
  verified: boolean;
  photo: string;
};

// Every paragraph is labelled by what kind of claim it makes.
// This is the core idea of the publication: readers always know
// whether they are reading checked fact, a firsthand account or an opinion.
export type BlockKind = "reported" | "eyewitness" | "take";

export type Block = { kind: BlockKind; text: string };

export type Source = { label: string; detail: string };

export type Story = {
  slug: string;
  title: string;
  dek: string;
  section: string;
  author: string; // contributor slug
  location: string;
  date: string;
  filedAt: string;
  readTime: string;
  checkedBy: string;
  featured?: boolean;
  cover: string;
  gallery: string[];
  video?: string;
  blocks: Block[];
  sources: Source[];
};

export type Filing = {
  time: string;
  author: string; // contributor slug
  location: string;
  text: string;
  kind: BlockKind;
};

export const blockLabels: Record<BlockKind, { label: string; hint: string }> = {
  reported: {
    label: "Reported",
    hint: "Checked against documents, data or at least two independent sources.",
  },
  eyewitness: {
    label: "Eyewitness",
    hint: "What the reporter saw or heard firsthand. Dated and located.",
  },
  take: {
    label: "Take",
    hint: "The reporter's own opinion or interpretation. Read it as one.",
  },
};

export const contributors: Contributor[] = [
  {
    slug: "amara-okafor",
    name: "Amara Okafor",
    role: "Citizen journalist",
    location: "Lagos, Nigeria",
    beat: "Cities & transit",
    bio: "Rides every danfo route in Lagos so you don't have to. Former logistics analyst, now documenting how 20 million people get to work.",
    followers: "48k",
    since: "2024",
    corrections: 1,
    verified: true,
    photo: "/media/img/p-w6.jpg",
  },
  {
    slug: "diego-ferraz",
    name: "Diego Ferraz",
    role: "Creator",
    location: "Belém, Brazil",
    beat: "Climate",
    bio: "Shoots short documentaries on the Amazon river economy. 400k people watch his weekly dispatches from the riverbanks.",
    followers: "412k",
    since: "2025",
    corrections: 0,
    verified: true,
    photo: "/media/img/p-m11.jpg",
  },
  {
    slug: "hana-sato",
    name: "Hana Sato",
    role: "Writer",
    location: "Osaka, Japan",
    beat: "Work & labor",
    bio: "Essayist and part-time convenience store clerk. Writes about the night shift economy from behind the counter.",
    followers: "22k",
    since: "2025",
    corrections: 0,
    verified: true,
    photo: "/media/img/p-w5.jpg",
  },
  {
    slug: "marcus-bell",
    name: "Marcus Bell",
    role: "Citizen journalist",
    location: "Detroit, USA",
    beat: "Local government",
    bio: "Has attended every city council meeting since 2021. Live-posts them, then explains what actually got decided.",
    followers: "15k",
    since: "2023",
    corrections: 2,
    verified: true,
    photo: "/media/img/p-m7.jpg",
  },
  {
    slug: "leila-haddad",
    name: "Leila Haddad",
    role: "Creator",
    location: "Marseille, France",
    beat: "Food & migration",
    bio: "Tells the story of migration through what people cook. Her market-stall interviews run on three platforms.",
    followers: "230k",
    since: "2026",
    corrections: 0,
    verified: false,
    photo: "/media/img/p-w2.jpg",
  },
  {
    slug: "tomas-rivera",
    name: "Tomás Rivera",
    role: "Writer",
    location: "Mexico City, Mexico",
    beat: "Tech & surveillance",
    bio: "Software engineer by day. Investigates how cities buy and use surveillance tech, one public records request at a time.",
    followers: "9k",
    since: "2024",
    corrections: 0,
    verified: true,
    photo: "/media/img/p-m2.jpg",
  },
];

export const stories: Story[] = [
  {
    slug: "the-routes-that-dont-exist",
    title: "The bus routes that don't exist, and the millions who ride them",
    dek: "Lagos plans its transit around an official map. Six weeks of counting by forty volunteers shows most commuters live off it.",
    section: "Cities",
    author: "amara-okafor",
    location: "Lagos",
    date: "Oct 11, 2026",
    filedAt: "06:40",
    readTime: "9 min",
    checkedBy: "Desk editor + 2 local reviewers",
    cover: "/media/img/lagos-1.jpg",
    gallery: ["/media/img/lagos-2.jpg", "/media/img/lagos-3.jpg"],
    video: "/media/v/4401.mp4",
    featured: true,
    blocks: [
      {
        kind: "eyewitness",
        text: "At 6:10 on a Tuesday the Ojota interchange is already full. Conductors shout stops that appear on no map, drivers negotiate lanes by hand signal, and passengers trade tips on which route is moving today.",
      },
      {
        kind: "reported",
        text: "The state transport authority's published network lists eleven bus routes through the district. Over three months of riding them every morning, I logged twenty-six distinct routes in regular use.",
      },
      {
        kind: "reported",
        text: "I asked the authority for ridership figures. The data it sent covers the eleven official routes only. Asked about the others, a spokesperson said they were \"not within scope\" of its planning.",
      },
      {
        kind: "eyewitness",
        text: "So we built our own count. Forty volunteers, a shared spreadsheet and one rule: write down the time, the route and how many people boarded. After six weeks we had 11,400 entries.",
      },
      {
        kind: "reported",
        text: "Across those entries, 63 percent of morning boardings in the district happened on routes missing from the official map. Two independent reviewers re-ran the totals from the raw sheet and got the same result.",
      },
      {
        kind: "take",
        text: "Any plan that starts from the official map starts from the wrong place. The city does not need to invent a network. It needs to admit the one that already exists.",
      },
    ],
    sources: [
      { label: "Lagos State transport network PDF", detail: "Published route list, 2025 edition" },
      { label: "Volunteer boarding count", detail: "11,400 rows, raw sheet linked below" },
      { label: "Email from authority spokesperson", detail: "Sept 29, 2026, on the record" },
    ],
  },
  {
    slug: "river-price-of-fish",
    title: "Why a fish costs twice as much ten kilometres upriver",
    dek: "Fuel, ice and a single broken bridge. Tracing one catch from the boat to the plate.",
    section: "Climate",
    author: "diego-ferraz",
    location: "Belém",
    date: "Oct 10, 2026",
    filedAt: "18:22",
    readTime: "6 min",
    checkedBy: "Desk editor",
    cover: "/media/img/river-1.jpg",
    gallery: ["/media/img/river-2.jpg", "/media/img/river-3.jpg"],
    blocks: [
      { kind: "eyewitness", text: "The tambaqui comes off the boat at 4 a.m. at Ver-o-Peso market. By noon, the same species sells for twice the price in a village a short boat ride away." },
      { kind: "reported", text: "Diesel for river transport rose 31 percent this year, according to the regional fuel price survey." },
      { kind: "reported", text: "The bridge that once let trucks carry ice upriver has been closed since March, confirmed by the municipal works department." },
      { kind: "take", text: "Climate stories here are usually told as stories about water. This one is about logistics." },
    ],
    sources: [
      { label: "Regional fuel price survey", detail: "ANP, monthly series" },
      { label: "Municipal works department", detail: "Phone confirmation, Oct 8" },
    ],
  },
  {
    slug: "night-shift-notes",
    title: "Notes from the 3 a.m. register",
    dek: "Who comes into a convenience store in the middle of the night, and what they buy, says a lot about a city.",
    section: "Work",
    author: "hana-sato",
    location: "Osaka",
    date: "Oct 9, 2026",
    filedAt: "03:15",
    readTime: "7 min",
    checkedBy: "Desk editor",
    cover: "/media/img/osaka-1.jpg",
    gallery: ["/media/img/osaka-2.jpg", "/media/img/osaka-3.jpg"],
    video: "/media/v/4331.mp4",
    blocks: [
      { kind: "eyewitness", text: "Between 2 and 4 a.m. I served 38 customers. Eleven were in work uniforms. Most bought hot food and a single can of coffee." },
      { kind: "take", text: "A city's night shift is invisible until you stand where it shops." },
      { kind: "take", text: "The store is the only lit room on the street, and everyone who comes in knows it." },
    ],
    sources: [{ label: "Reporter's shift log", detail: "Kept by hand, Sept 2026" }],
  },
  {
    slug: "council-budget-explained",
    title: "Detroit's council passed a $1.4B budget in 40 minutes. Here's what's in it",
    dek: "I read all 312 pages so you can read this instead.",
    section: "Politics",
    author: "marcus-bell",
    location: "Detroit",
    date: "Oct 8, 2026",
    filedAt: "21:05",
    readTime: "5 min",
    checkedBy: "Desk editor + finance reviewer",
    cover: "/media/img/council.jpg",
    gallery: ["/media/img/detroit-1.jpg", "/media/img/detroit-2.jpg"],
    video: "/media/v/20810.mp4",
    blocks: [
      { kind: "eyewitness", text: "The vote took 40 minutes. Three members asked questions. None were about the transit line." },
      { kind: "reported", text: "The adopted budget totals $1.41 billion, up 4.2 percent on last year." },
      { kind: "reported", text: "Road repair funding rises $18 million. Library hours funding is flat." },
      { kind: "reported", text: "A $6 million line for a new police data system appears on page 207 with no description." },
      { kind: "take", text: "A budget this size deserves more than 40 minutes of public debate." },
    ],
    sources: [
      { label: "FY2027 adopted budget", detail: "City of Detroit, 312 pages" },
      { label: "Council session video", detail: "Oct 7, 2026" },
    ],
  },
  {
    slug: "market-stall-recipes",
    title: "Three generations, one stall, and a recipe that crossed the Mediterranean",
    dek: "At Noailles market, the menu is a migration map.",
    section: "Culture",
    author: "leila-haddad",
    location: "Marseille",
    date: "Oct 7, 2026",
    filedAt: "11:48",
    readTime: "4 min",
    checkedBy: "Desk editor",
    cover: "/media/img/marseille-fish.jpg",
    gallery: ["/media/img/marseille-boat.jpg"],
    video: "/media/v/992.mp4",
    blocks: [
      { kind: "eyewitness", text: "Fatima has run the stall for 31 years. Her granddaughter now handles the card reader." },
      { kind: "eyewitness", text: "The recipe for the msemen came from Oujda in 1971, written on the back of a ferry ticket." },
      { kind: "take", text: "You can read the history of this city off its market menus." },
    ],
    sources: [{ label: "Interviews at the stall", detail: "Three family members, on camera" }],
  },
  {
    slug: "cameras-contracts",
    title: "The city bought 4,000 cameras. Nobody can say who watches them",
    dek: "Public records show the contract, the price and the vendor. They don't show the rules.",
    section: "Tech",
    author: "tomas-rivera",
    location: "Mexico City",
    date: "Oct 6, 2026",
    filedAt: "09:30",
    readTime: "11 min",
    checkedBy: "Desk editor + legal review",
    cover: "/media/img/cctv-1.jpg",
    gallery: ["/media/img/cctv-2.jpg", "/media/img/cctv-3.jpg"],
    blocks: [
      { kind: "reported", text: "The contract, obtained through a transparency request, covers 4,000 cameras at a total of 612 million pesos." },
      { kind: "reported", text: "It names the vendor and the delivery schedule. It does not name who has access to the footage." },
      { kind: "reported", text: "Two follow-up requests for the access policy were answered with \"information not available.\"" },
      { kind: "take", text: "A camera network without published access rules is a decision, not an oversight." },
    ],
    sources: [
      { label: "Transparency request 0923/2026", detail: "Contract and annexes" },
      { label: "Follow-up requests", detail: "Two responses, Aug and Sept" },
    ],
  },
];

export const filings: Filing[] = [
  { time: "14:02", author: "marcus-bell", location: "Detroit", kind: "eyewitness", text: "Council has pushed the transit vote to next week. Room was half empty." },
  { time: "13:47", author: "diego-ferraz", location: "Belém", kind: "reported", text: "River level at the port gauge is 1.2 m below the October average." },
  { time: "13:15", author: "tomas-rivera", location: "Mexico City", kind: "reported", text: "Third transparency request on the camera contract filed this morning." },
  { time: "12:58", author: "amara-okafor", location: "Lagos", kind: "eyewitness", text: "Ojota interchange flooded after the morning rain. Two unofficial routes rerouted." },
  { time: "12:30", author: "leila-haddad", location: "Marseille", kind: "take", text: "The market's new opening hours will push out the oldest stalls first." },
  { time: "11:41", author: "hana-sato", location: "Osaka", kind: "eyewitness", text: "Store chain posted a new night-shift wage on the staff board: up 40 yen." },
];

export const sections = ["Cities", "Climate", "Politics", "Work", "Tech", "Culture"];

export const getContributor = (slug: string) => contributors.find((c) => c.slug === slug);
export const getStory = (slug: string) => stories.find((s) => s.slug === slug);
export const getStoriesBy = (slug: string) => stories.filter((s) => s.author === slug);

export function blockMix(blocks: Block[]) {
  const total = blocks.length || 1;
  const count = (k: BlockKind) => blocks.filter((b) => b.kind === k).length;
  return (["reported", "eyewitness", "take"] as BlockKind[]).map((kind) => ({
    kind,
    share: count(kind) / total,
  }));
}

export const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);


export const gifs = [
  { src: "/media/gif/fist.gif", label: "Detroit, 14:02" },
  { src: "/media/gif/megaphone.gif", label: "Marseille, 12:30" },
  { src: "/media/gif/freedom.gif", label: "Tbilisi, 11:12" },
  { src: "/media/gif/phone.gif", label: "Lagos, 06:10" },
  { src: "/media/gif/newspaper.gif", label: "Belem, 08:44" },
  { src: "/media/gif/notes.gif", label: "Osaka, 03:15" },
  { src: "/media/gif/feet.gif", label: "Mexico City, 19:20" },
];
