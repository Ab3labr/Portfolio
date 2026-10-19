import { useLayoutEffect, useRef, useState } from "react"
import {
  siCss,
  siFigma,
  siGit,
  siHtml5,
  siJavascript,
  siPython,
  siReact,
  siTypescript,
} from "simple-icons"
import { featuredSkills, skillCategories } from "../data/skills"
import { Reveal } from "./Reveal"
import { SectionSignal } from "./SectionSignal"
import { Text } from "./primitives"

const skillIconPaths: Record<(typeof featuredSkills)[number], string> = {
  Figma: siFigma.path,
  React: siReact.path,
  TypeScript: siTypescript.path,
  JavaScript: siJavascript.path,
  Python: siPython.path,
  HTML5: siHtml5.path,
  CSS3: siCss.path,
  Git: siGit.path,
}

export function SkillsSection() {
  const trackRef = useRef<HTMLDivElement>(null)
  const sequenceRef = useRef<HTMLUListElement>(null)
  const [sequenceCount, setSequenceCount] = useState(2)

  useLayoutEffect(() => {
    const track = trackRef.current
    const sequence = sequenceRef.current
    if (!track || !sequence) return

    const updateMarquee = () => {
      const sequenceWidth = sequence.getBoundingClientRect().width
      const containerWidth = track.parentElement?.getBoundingClientRect().width ?? 0
      if (!sequenceWidth || !containerWidth) return

      track.style.setProperty("--skills-marquee-distance", `${sequenceWidth}px`)
      const nextSequenceCount = Math.max(2, Math.ceil(containerWidth / sequenceWidth) + 1)
      setSequenceCount((currentCount) =>
        currentCount === nextSequenceCount ? currentCount : nextSequenceCount,
      )
    }

    const resizeObserver = new ResizeObserver(updateMarquee)
    resizeObserver.observe(sequence)
    if (track.parentElement) resizeObserver.observe(track.parentElement)
    updateMarquee()

    return () => resizeObserver.disconnect()
  }, [])

  return (
    <section
      className="skills-section"
      id="skills"
      aria-labelledby="skills-title"
    >
      <div className="skills-inner">
        <Reveal className="skills-heading">
          <div>
            <Text className="micro-label skills-kicker">SKILLS / PRACTICE</Text>
            <Text as="h2" className="skills-title" id="skills-title">
              Things I work with.
            </Text>
          </div>
          <Text className="skills-intro">
            From first sketch to working screen, this is what I use to get there.
          </Text>
        </Reveal>

        <div className="skills-categories">
          {skillCategories.map((category, index) => (
            <Reveal
              className="skills-category-reveal"
              delay={index * 90}
              key={category.title}
            >
              <article className="skills-category">
                <Text as="h3" className="skills-category-title">
                  {category.title}
                </Text>
                <Text className="skills-category-items">
                  {category.skills.join(" · ")}
                </Text>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="skills-marquee">
          <div className="skills-marquee-track" ref={trackRef}>
            {Array.from({ length: sequenceCount }, (_, copy) => (
              <ul
                className="skills-marquee-group"
                key={copy}
                ref={copy === 0 ? sequenceRef : undefined}
                aria-label={copy === 0 ? "Featured technologies" : undefined}
                aria-hidden={copy !== 0}
              >
                {featuredSkills.map((skill) => (
                  <li className="skills-marquee-item" key={skill}>
                    <span className="skills-marquee-label">{skill}</span>
                    <svg
                      className="skills-marquee-icon"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d={skillIconPaths[skill]} />
                    </svg>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </Reveal>

        <SectionSignal index="03" label="WORK" />
      </div>
    </section>
  )
}