import { useLayoutEffect, useRef } from "react"
import type { Project } from "../data/projects"
import { ProjectChapter } from "./ProjectChapter"
import { Text } from "./primitives"
import {
  requestSharedScrollFrame,
  subscribeToScrollFrame,
} from "./scrollFrame"

type ProjectReelProps = {
  projects: readonly Project[]
}

export function ProjectReel({ projects }: ProjectReelProps) {
  const reelRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const activeIndexRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const reel = reelRef.current
    const stage = stageRef.current
    const track = trackRef.current
    if (!reel || !stage || !track || projects.length === 0) return

    const stackedLayout = window.matchMedia("(max-width: 900px)")
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const panels = Array.from(
      track.querySelectorAll<HTMLElement>(".project-frame"),
    )
    let readingInterval = 1
    let transitionInterval = 0
    let horizontalTravel = 0
    let stepTravel = 0
    let activeIndex = -1

    const updateActiveIndex = (index: number) => {
      if (index === activeIndex) return

      const project = projects[index]
      if (activeIndexRef.current && project) {
        activeIndexRef.current.textContent = project.id
        activeIndex = index
      }
    }

    const updateMobileIndex = () => {
      let nearestIndex = 0
      let nearestDistance = Number.POSITIVE_INFINITY

      panels.forEach((panel, index) => {
        const bounds = panel.getBoundingClientRect()
        const distance = Math.abs(
          bounds.top + bounds.height / 2 - window.innerHeight / 2,
        )

        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestIndex = index
        }
      })

      updateActiveIndex(nearestIndex)
    }

    const updateReel = () => {
      if (stackedLayout.matches || reducedMotion.matches) {
        track.style.transform = ""
        updateMobileIndex()
        return
      }

      const bounds = reel.getBoundingClientRect()
      const totalScrollDistance =
        readingInterval * projects.length + horizontalTravel
      const scrollPosition = Math.min(
        Math.max(-bounds.top, 0),
        totalScrollDistance,
      )
      const intervalDistance = readingInterval + transitionInterval
      const completedTransitions = Math.min(
        Math.floor(scrollPosition / intervalDistance),
        Math.max(projects.length - 1, 0),
      )
      const intervalProgress =
        scrollPosition - completedTransitions * intervalDistance
      const transitionProgress =
        completedTransitions < projects.length - 1 && transitionInterval > 0
          ? Math.min(
              Math.max(
                (intervalProgress - readingInterval) / transitionInterval,
                0,
              ),
              1,
            )
          : 0
      const translateX = Math.min(
        horizontalTravel,
        (completedTransitions + transitionProgress) * stepTravel,
      )

      track.style.transform = `translate3d(${-translateX}px, 0, 0)`

      const activeIndex = Math.min(
        Math.max(Math.round(translateX / Math.max(stepTravel, 1)), 0),
        projects.length - 1,
      )
      updateActiveIndex(activeIndex)
    }

    const measure = () => {
      readingInterval = Math.max(stage.offsetHeight, 1)
      horizontalTravel = Math.max(track.scrollWidth - stage.clientWidth, 0)
      const transitionCount = Math.max(projects.length - 1, 0)
      stepTravel = transitionCount > 0 ? horizontalTravel / transitionCount : 0
      transitionInterval = stepTravel
      reel.style.setProperty(
        "--reel-scroll-distance",
        `${readingInterval * projects.length + horizontalTravel}px`,
      )
      requestSharedScrollFrame()
    }

    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(stage)
    resizeObserver.observe(track)
    const unsubscribeScroll = subscribeToScrollFrame(updateReel)
    window.addEventListener("resize", measure)
    stackedLayout.addEventListener("change", measure)
    reducedMotion.addEventListener("change", measure)
    measure()

    return () => {
      resizeObserver.disconnect()
      unsubscribeScroll()
      window.removeEventListener("resize", measure)
      stackedLayout.removeEventListener("change", measure)
      reducedMotion.removeEventListener("change", measure)
    }
  }, [projects])

  const firstProject = projects[0]

  if (!firstProject) return null

  return (
    <div
      className="project-reel"
      ref={reelRef}
    >
      <div className="project-reel-stage" ref={stageRef}>
        <div className="work-progress" aria-live="polite">
          <div className="work-progress-index">
            <Text className="micro-label">
              <span className="work-progress-active" ref={activeIndexRef}>
                {firstProject.id}
              </span>
              <span className="work-progress-total">
                {" "}
                / {String(projects.length).padStart(2, "0")}
              </span>
            </Text>
          </div>
        </div>

        <div className="project-reel-track" ref={trackRef}>
          {projects.map((project) => (
            <ProjectChapter
              project={project}
              total={projects.length}
              key={project.slug}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
