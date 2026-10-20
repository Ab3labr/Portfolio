import amplyMockup from "../assets/projects/amply-mockup.webp"
import nirvanicaMockup from "../assets/projects/nirvanica-mockup.webp"
import vayoauraMockup from "../assets/projects/vayoaura-mockup.webp"
import vsyncMockup from "../assets/projects/vsync-mockup.webp"

export type Project = {
  id: string
  title: string
  slug: string
  year?: string
  category?: string
  description?: string
  image?: ProjectMedia | null
  video?: ProjectMedia | null
  mediaType?: "placeholder" | "image" | "video"
  composition: "centered" | "wide" | "editorial" | "atmospheric"
  additionalMedia?: ProjectMedia[]
  tools?: string[]
  role?: string
  outcome?: string
  link?: string
  problem?: string
  approach?: string
  process?: string
  designDecisions?: string
  finalResult?: string
}

export type ProjectMedia = {
  type: "image" | "video"
  src: string
  alt: string
  width?: number
  height?: number
}

export const projects: Project[] = [
  {
    id: "01",
    title: "VSYNC",
    slug: "vsync",
    year: "YEAR / ADD",
    category: "CATEGORY / ADD",
    description:
      "Designed a university companion experience with a clear visual hierarchy, intuitive navigation, and thoughtfully structured interfaces that make everyday campus tasks easier to manage.",
    image: {
      type: "image",
      src: vsyncMockup,
      alt: "VSYNC project mockup",
      width: 1672,
      height: 941,
    },
    video: null,
    mediaType: "image",
    composition: "centered",
    additionalMedia: [],
    tools: [],
    role: "",
    outcome: "",
    link: "https://www.behance.net/gallery/237951137/Vsync-Campus-Companion-App-for-Students",
  },
  {
    id: "02",
    title: "AMPLY",
    slug: "amply",
    year: "YEAR / ADD",
    category: "CATEGORY / ADD",
    description:
      "A shared listening experience that brings friends into one music room, syncing YouTube tracks so everyone can listen together, wherever they are.",
    image: {
      type: "image",
      src: amplyMockup,
      alt: "AMPLY project mockup",
      width: 5184,
      height: 3369,
    },
    video: null,
    mediaType: "image",
    composition: "wide",
    additionalMedia: [],
    tools: [],
    role: "",
    outcome: "",
    link: "",
  },
  {
    id: "03",
    title: "NIRVANICA",
    slug: "nirvanica",
    year: "YEAR / ADD",
    category: "CATEGORY / ADD",
    description:
      "An immersive resort website shaped by nature-inspired visuals, refined typography, and a calm, considered layout that captures the essence of a slower escape.",
    image: {
      type: "image",
      src: nirvanicaMockup,
      alt: "NIRVANICA project mockup",
      width: 1672,
      height: 941,
    },
    video: null,
    mediaType: "image",
    composition: "editorial",
    additionalMedia: [],
    tools: [],
    role: "",
    outcome: "",
    link: "https://nirvanica-life.com/",
  },
  {
    id: "04",
    title: "VAYOAURA",
    slug: "vayoaura",
    year: "YEAR / ADD",
    category: "CATEGORY / ADD",
    description:
      "An editorial approach to travel website design, combining evocative destination imagery, considered layouts, and intuitive browsing to make trip discovery feel effortless.",
    image: {
      type: "image",
      src: vayoauraMockup,
      alt: "VAYOAURA project mockup",
      width: 1460,
      height: 1078,
    },
    video: null,
    mediaType: "image",
    composition: "atmospheric",
    additionalMedia: [],
    tools: [],
    role: "",
    outcome: "",
    link: "https://vayoaura.com/",
  },
]
