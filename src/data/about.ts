export const heroContent = {
  nameLead: "Abel",
  nameAccent: "Abraham",
} as const

export const aboutContent = {
  greeting: "HELLO.",
  titleLines: ["MAKING", "THINGS FEEL", "OBVIOUS."],
  introduction:
    "Good design should feel obvious. I’m interested in the thinking, details, and iterations that make it that way.",
  workLinkLabel: "Explore selected work ↗",
  details: [
    { label: "FOCUS", value: "Product design · Interface design · Brand identity" },
    { label: "BACKGROUND", value: "Electronics & Communication Engineer" },
    { label: "BASED IN", value: "Kerala, India" },
  ],
} as const

export const portraitFaces = {
  front: {
    src: "/assets/front-image.webp",
    alt: "Abel Abraham in profile wearing glasses",
    placeholderLabel: "FRONT IMAGE",
  },
  back: {
    src: "/assets/back-image.webp",
    alt: "Abel Abraham in profile against a blue background",
    placeholderLabel: "",
  },
} as const
