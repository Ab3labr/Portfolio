import { useEffect, useRef, type CSSProperties } from "react"
import { aboutContent, heroContent } from "../data/about"
import ArrowIcon from "./ArrowIcon"
import { PortraitCard } from "./PortraitCard"
import { SectionSignal } from "./SectionSignal"
import { Text } from "./primitives"
import {
  requestSharedScrollFrame,
  subscribeToScrollFrame,
} from "./scrollFrame"

const clamp = (value: number) => Math.min(Math.max(value, 0), 1)

const rangeProgress = (progress: number, start: number, end: number) => {
  const linear = clamp((progress - start) / (end - start))
  return linear * linear * (3 - 2 * linear)
}

type HeroNameLineProps = {
  text: string
  startIndex?: number
  className?: string
}

function HeroNameLine({
  text,
  startIndex = 0,
  className = "",
}: HeroNameLineProps) {
  return (
    <span className={className} aria-hidden="true">
      {Array.from(text).map((character, index) => (
        <span
          className="hero-name-char proximity-char"
          data-proximity-char=""
          style={{ "--char-index": startIndex + index } as CSSProperties}
          key={`${character}-${index}`}
        >
          {character}
        </span>
      ))}
    </span>
  )
}

function AboutProximityText({ text }: { text: string }) {
  return (
    <>
      {Array.from(text).map((character, index) =>
        character === " " ? (
          " "
        ) : (
          <span
            className="about-proximity-char proximity-char"
            data-proximity-char=""
            aria-hidden="true"
            key={`${character}-${index}`}
          >
            {character}
          </span>
        ),
      )}
    </>
  )
}

export function HeroAboutTransition() {
  const transitionRef = useRef<HTMLDivElement>(null)
  const portraitRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const transition = transitionRef.current
    const portrait = portraitRef.current
    if (!transition || !portrait) return

    const staticLayout = window.matchMedia(
      "(max-width: 560px), (prefers-reduced-motion: reduce)",
    )
    let scrollDistance = 1
    let portraitStartX = 0
    let portraitStartY = 0

    const updateTransition = () => {
      if (staticLayout.matches) return

      const bounds = transition.getBoundingClientRect()
      const progress = clamp(-bounds.top / scrollDistance)
      const heroExit = rangeProgress(progress, 0.06, 0.46)
      const metadataExit = rangeProgress(progress, 0.02, 0.4)
      const portraitMove = rangeProgress(progress, 0.12, 0.74)
      const portraitFlip = rangeProgress(progress, 0.28, 0.68)
      const greetingEnter = rangeProgress(progress, 0.4, 0.56)
      const introductionEnter = rangeProgress(progress, 0.48, 0.66)
      const supportingEnter = rangeProgress(progress, 0.54, 0.7)
      const aboutExit = rangeProgress(progress, 0.9, 0.99)
      const viewportHeight = window.innerHeight

      transition.style.setProperty(
        "--hero-offset",
        `${-heroExit * viewportHeight * 0.72}px`,
      )
      transition.style.setProperty(
        "--hero-meta-offset",
        `${-metadataExit * viewportHeight * 0.22}px`,
      )
      transition.style.setProperty(
        "--hero-opacity",
        `${1 - rangeProgress(progress, 0.2, 0.52)}`,
      )
      transition.style.setProperty(
        "--portrait-x",
        `${portraitStartX * (1 - portraitMove)}px`,
      )
      transition.style.setProperty(
        "--portrait-y",
        `${portraitStartY * (1 - portraitMove)}px`,
      )
      transition.style.setProperty(
        "--portrait-rotation",
        `${portraitFlip * 180}deg`,
      )
      transition.style.setProperty(
        "--greeting-opacity",
        `${greetingEnter}`,
      )
      transition.style.setProperty(
        "--introduction-opacity",
        `${introductionEnter}`,
      )
      transition.style.setProperty(
        "--supporting-opacity",
        `${supportingEnter}`,
      )
      transition.style.setProperty(
        "--about-offset",
        `${(1 - introductionEnter) * 16}px`,
      )
      transition.style.setProperty("--about-opacity", `${1 - aboutExit}`)
    }

    const measure = () => {
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const portraitWidth = portrait.offsetWidth
      const portraitHeight = portrait.offsetHeight
      const initialRight =
        viewportWidth <= 800 ? Math.max(20, viewportWidth * 0.04) : viewportWidth * 0.06
      const initialTop = viewportWidth <= 800 ? viewportHeight * 0.18 : viewportHeight * 0.12

      scrollDistance = Math.max(
        transition.offsetHeight - viewportHeight,
        1,
      )
      portraitStartX =
        viewportWidth - initialRight - portraitWidth / 2 - viewportWidth / 2
      portraitStartY =
        initialTop + portraitHeight / 2 - viewportHeight / 2
      requestSharedScrollFrame()
    }

    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(transition)
    resizeObserver.observe(portrait)
    const unsubscribeScroll = subscribeToScrollFrame(updateTransition)
    window.addEventListener("resize", measure)
    staticLayout.addEventListener("change", measure)
    measure()

    return () => {
      resizeObserver.disconnect()
      unsubscribeScroll()
      window.removeEventListener("resize", measure)
      staticLayout.removeEventListener("change", measure)
    }
  }, [])

  return (
    <div
      className="hero-about-transition"
      id="top"
      ref={transitionRef}
      style={
        {
          "--hero-offset": "0px",
          "--hero-meta-offset": "0px",
          "--hero-opacity": 1,
          "--portrait-x": "0px",
          "--portrait-y": "0px",
          "--portrait-rotation": "0deg",
          "--greeting-opacity": 0,
          "--introduction-opacity": 0,
          "--supporting-opacity": 0,
          "--about-offset": "8vh",
          "--about-opacity": 1,
        } as CSSProperties
      }
    >
      <span className="about-scroll-anchor" id="about" aria-hidden="true" />

      <div className="hero-about-stage">
        <section
          className="hero-transition-layer"
          aria-labelledby="hero-title"
        >
          <div className="hero-meta hero-transition-meta">
            <Text className="micro-label">{heroContent.portfolioLabel}</Text>
            <div className="hero-meta-system">
              <Text className="micro-label">{heroContent.disciplines}</Text>
              <Text className="micro-label system-label">
                {heroContent.systemLabel}
              </Text>
            </div>
          </div>

          <div className="hero-composition">
            <Text
              as="h1"
              className="display-title hero-name hero-name--enter"
              id="hero-title"
              data-proximity-block=""
              aria-label={`${heroContent.nameLead} ${heroContent.nameAccent}`}
            >
              <HeroNameLine text={heroContent.nameLead} />
              <HeroNameLine
                className="display-accent"
                text={heroContent.nameAccent}
                startIndex={heroContent.nameLead.length}
              />
            </Text>
            <a className="hero-contact-link" href="#contact">
              <span>Say Hello</span>
              <span className="hero-contact-arrow" aria-hidden="true">
                <ArrowIcon />
              </span>
            </a>
          </div>

          <div className="hero-footer">
            <Text className="hero-secondary-label">Scroll to Explore</Text>
          </div>
          <SectionSignal index="01" label="ABOUT" />
        </section>

        <PortraitCard
          className="portrait-card--animated"
          caption="Design / Build / Refine"
          ref={portraitRef}
        />

        <section
          className="about-transition-layer"
          aria-labelledby="about-title"
        >
          <div className="about-transition-greeting">
            <span className="about-transition-star" aria-hidden="true">
              <svg viewBox="0 0 32 32" focusable="false">
                <path d="M16 1C17.7 9.4 22.6 14.3 31 16C22.6 17.7 17.7 22.6 16 31C14.3 22.6 9.4 17.7 1 16C9.4 14.3 14.3 9.4 16 1Z" />
              </svg>
            </span>
            <Text className="micro-label">{aboutContent.greeting}</Text>
          </div>

          <PortraitCard className="portrait-card--static" />

          <div className="about-transition-introduction">
            <Text
              as="h2"
              className="section-title about-title"
              id="about-title"
              data-proximity-block=""
              aria-label={aboutContent.titleLines.join(" ")}
            >
              {aboutContent.titleLines.map((line, index) => (
                <span key={line} aria-hidden="true">
                  {index === aboutContent.titleLines.length - 1 ? (
                    <em>
                      <AboutProximityText text={line} />
                    </em>
                  ) : (
                    <AboutProximityText text={line} />
                  )}
                </span>
              ))}
            </Text>
          </div>

          <div className="about-transition-support">
            <Text className="editorial-copy">{aboutContent.introduction}</Text>
            <a className="about-work-link" href="#work">
              {aboutContent.workLinkLabel}
              <ArrowIcon className="about-work-arrow" />
            </a>
          </div>

          <div className="about-facts about-transition-facts">
            {aboutContent.details.map((detail) => (
              <div className="about-fact" key={detail.label}>
                <Text className="micro-label">{detail.label}</Text>
                <Text className="micro-label about-fact-value">
                  {detail.value}
                </Text>
              </div>
            ))}
          </div>

          <SectionSignal index="02" label="SKILLS" />
        </section>
      </div>
    </div>
  )
}
