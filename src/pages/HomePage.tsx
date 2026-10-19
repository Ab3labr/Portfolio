import { Contact } from "../components/Contact"
import { HeroAboutTransition } from "../components/HeroAboutTransition"
import { ProjectShowcase } from "../components/ProjectShowcase"
import { SkillsSection } from "../components/SkillsSection"
import { Seo } from "../components/Seo"

export function HomePage() {
  return (
    <>
      <Seo />
      <HeroAboutTransition />
      <SkillsSection />
      <ProjectShowcase />
      <Contact />
    </>
  )
}
