import type { Project } from "../data/projects"
import ArrowIcon from "./ArrowIcon"
import { MediaPlaceholder } from "./MediaPlaceholder"
import { useReveal } from "./Reveal"
import { Text } from "./primitives"

type ProjectChapterProps = {
  project: Project
  total: number
}

export function ProjectChapter({ project, total }: ProjectChapterProps) {
  const description = project.description?.startsWith("[")
    ? ""
    : project.description
  const mediaLinkRef = useReveal<HTMLAnchorElement>()
  const mediaFrameRef = useReveal<HTMLDivElement>()
  const projectInfoRef = useReveal<HTMLDivElement>()
  const media = (
    <MediaPlaceholder
      index={project.id}
      composition={project.composition}
      mediaType={project.mediaType}
      image={project.image}
      video={project.video}
    />
  )

  return (
    <article
      className="project-frame"
      id={`project-${project.slug}`}
      aria-label={`${project.title}, project ${project.id} of ${String(total).padStart(2, "0")}`}
    >
      <div className={`project-sticky project-sticky--${project.composition}`}>
        <div className="project-meta" aria-hidden="true">
          <Text className="micro-label">SELECTED PROJECT / {project.id}</Text>
        </div>

        {project.link ? (
          <a
            className="project-media-motion reveal reveal--media"
            ref={mediaLinkRef}
            href={project.link}
            target="_blank"
            rel="noreferrer"
            data-cursor="explore"
            aria-label={`Visit ${project.title} project image (opens in a new tab)`}
          >
            {media}
          </a>
        ) : (
          <div
            className="project-media-motion reveal reveal--media"
            ref={mediaFrameRef}
          >
            {media}
          </div>
        )}

        <div className="project-panel-heading reveal" ref={projectInfoRef}>
          <div
            className="project-title-row"
            data-cursor={project.link ? "explore" : undefined}
          >
            {project.link ? (
              <a
                className="project-title-lockup"
                href={project.link}
                target="_blank"
                rel="noreferrer"
                aria-label={`Visit ${project.title} project (opens in a new tab)`}
              >
                <Text as="h3" className="project-title">
                  {project.title}
                  <ArrowIcon className="project-external-arrow" />
                </Text>
                <Text className="micro-label project-hover-label">
                  OPEN PROJECT
                </Text>
              </a>
            ) : (
              <div className="project-title-lockup">
                <Text as="h3" className="project-title">
                  {project.title}
                </Text>
              </div>
            )}
          </div>

          {description ? (
            <div className="project-panel-support">
              <Text className="project-description">{description}</Text>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  )
}
