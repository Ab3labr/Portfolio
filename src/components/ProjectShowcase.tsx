import { projects } from "../data/projects";
import { ProjectReel } from "./ProjectReel";
import { Reveal } from "./Reveal";
import { SectionSignal } from "./SectionSignal";
import { Text } from "./primitives";

export function ProjectShowcase() {
  return (
    <section className="work" id="work" aria-labelledby="work-title">
      <div className="work-intro">
        <Reveal className="work-intro-index" delay={100}>
          <Text className="micro-label">03 / SELECTED WORK</Text>
          <Text className="micro-label">{projects.length} PROJECTS</Text>
        </Reveal>
        <Reveal className="work-intro-copy">
          <Text as="h2" className="work-intro-title" id="work-title">
            A few things I&apos;ve built.
          </Text>
          <Text className="work-intro-description">
            Selected projects exploring products, interfaces, and digital experiences.
          </Text>
        </Reveal>
      </div>

      <ProjectReel projects={projects} />

      <div className="work-section-transition">
        <SectionSignal index="04" label="CONTACT" />
      </div>
    </section>
  );
}
