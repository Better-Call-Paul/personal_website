export interface CollectionItem {
  title: string
  url: string
  thumbnail?: string // optional override — auto-generated from URL if omitted
  labels: string[]   // e.g. ["personal sites", "eng knowledge"]
  saved?: boolean
}

export interface Label {
  name: string
  emoji: string // displayed before the label name
  color: string // tailwind text color class for the tag
}

// ─── Define your labels here ─────────────────────────────────────────────────
// Each label has a display name, emoji, and a Tailwind text color for the tag pill.
export const labels: Label[] = [
  { name: "Personal Sites", emoji: "\uD83D\uDCD1", color: "text-gray-900" },
  { name: "Essays",         emoji: "\u270F\uFE0F",  color: "text-gray-900" },
  { name: "Engineering",    emoji: "\uD83D\uDD27",  color: "text-gray-900" },
  { name: "Tools",          emoji: "\u2699\uFE0F",  color: "text-gray-900" },
  { name: "Design",         emoji: "\uD83C\uDFA8",  color: "text-gray-900" },
  { name: "Markets",        emoji: "\uD83D\uDCC8",  color: "text-gray-900" },
  { name: "Misc",           emoji: "\uD83D\uDD00",  color: "text-gray-900" },
]

// ─── Add your collection items here ──────────────────────────────────────────
// Each item needs a title, url, and at least one label.
// Optionally add a thumbnail image (put images in /public/collections/).
//
// Example (thumbnail is auto-generated from the URL — no need to provide one):
//   {
//     title: "Ivory Tang",
//     url: "https://ivorytang.com",
//     labels: ["Personal Sites"],
//   },
//
export const collections: CollectionItem[] = [
  {
    title: "Love and Ambition",
    url: "https://www.bykahlil.com/writing/love-and-ambition",
    labels: ["Essays"],
  },
  {
    title: "Eric Zhang",
    url: "https://www.ekzhang.com/",
    labels: ["Personal Sites"],
  },
  {
    title: "Talos",
    url: "https://talos.wtf/",
    labels: ["Engineering"],
  },
  {
    title: "Nvidia's B200: Keeping the CUDA Juggernaut",
    url: "https://chipsandcheese.com/p/nvidias-b200-keeping-the-cuda-juggernaut",
    labels: ["Engineering"],
  },
  {
    title: "Apple & TSMC: The Partnership That Built",
    url: "https://newsletter.semianalysis.com/p/apple-tsmc-the-partnership-that-built",
    labels: ["Markets"],
  },
  {
    title: "Making Software",
    url: "https://www.makingsoftware.com/",
    thumbnail: "/collections/making-software.png",
    labels: ["Design"],
  },
]
