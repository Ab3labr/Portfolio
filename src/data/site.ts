export const navigationItems = [
  { label: "HOME", hash: "#top" },
  { label: "ABOUT", hash: "#about" },
  { label: "WORK", hash: "#work" },
  { label: "CONTACT", hash: "#contact" },
] as const

export const contactLinks = [
  {
    label: "EMAIL",
    value: "[YOUR EMAIL]",
    href: "mailto:your-email@example.com",
    external: false,
  },
  {
    label: "LINKEDIN",
    value: "[YOUR LINKEDIN]",
    href: "https://www.linkedin.com/in/your-profile",
    external: true,
  },
  {
    label: "GITHUB",
    value: "[YOUR GITHUB]",
    href: "https://github.com/your-username",
    external: true,
  },
] as const

export const siteMetadata = {
  name: "Abel Abraham",
  title: "Abel Abraham — Product & Digital Portfolio",
  description:
    "A portfolio of product design, digital experiences, and technology projects.",
  canonicalOrigin: "https://your-domain.example",
  socialImage: "/social-share-placeholder.svg",
} as const
