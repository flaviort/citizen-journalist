import { blockLabels, blockMix, type Block, type BlockKind } from "@/data/content";

export const claimBg: Record<BlockKind, string> = { reported: "bg-reported", eyewitness: "bg-eyewitness", take: "bg-take" };
export const claimText: Record<BlockKind, string> = { reported: "text-reported", eyewitness: "text-eyewitness", take: "text-take" };

// What a story is made of: share of reported fact, eyewitness account and opinion.
export function MixBar({ blocks, light = false }: { blocks: Block[]; light?: boolean }) {
  const mix = blockMix(blocks).filter((m) => m.share > 0);
  return (
    <div>
      <div
        role="img"
        aria-label={`Story mix: ${mix.map((m) => `${Math.round(m.share * 100)}% ${blockLabels[m.kind].label}`).join(", ")}`}
        className="flex h-2 w-full gap-[3px]"
      >
        {mix.map((m) => (
          <span key={m.kind} className={`${claimBg[m.kind]} rounded-full`} style={{ flexGrow: m.share }} />
        ))}
      </div>
      <ul className="mono mt-3 flex flex-wrap gap-x-5 gap-y-1">
        {mix.map((m) => (
          <li key={m.kind} className={`flex items-center gap-1.5 ${light ? "text-white" : ""}`}>
            <span className={`size-1.5 rounded-full ${claimBg[m.kind]}`} />
            {Math.round(m.share * 100)}% {blockLabels[m.kind].label}
          </li>
        ))}
      </ul>
    </div>
  );
}
