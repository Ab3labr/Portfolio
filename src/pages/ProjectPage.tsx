import { Link, useParams } from "react-router"
import ArrowIcon from "../components/ArrowIcon"
import { MediaPlaceholder } from "../components/MediaPlaceholder"
import { Seo } from "../components/Seo"
import { NavLink, Text } from "../components/primitives"
import { projects } from "../data/projects"
import { siteMetadata } from "../data/site"

const caseStudySections = [
  ["PROBLEM", "problem"],
  ["APPROACH", "approach"],
  ["PROCESS", "process"],
  ["DESIGN DECISIONS", "designDecisions"],
  ["FINAL RESULT", "finalResult"],
  ["OUTCOME", "outcome"],
] as const

export function ProjectPage() {
  const { slug } = useParams()
  const projectIndex = projects.findIndex((project) => project.slug === slug)
  const project = projects[projectIndex]

  if (!project) return <NotFoundPage />

  const nextProject = projects[(projectIndex + 1) % projects.length]
  const description = project.description || "[ADD PROJECT OVERVIEW]"

  return (
    <article className="project-page section-frame">
      <Seo
        title={`${project.title} — ${siteMetadata.name}`}
        description={description}
        path={`/work/${project.slug}`}
        type="article"
      />

      <div className="section-index">
        <Text className="micro-label">{project.id} / PROJECT</Text>
        <Text className="micro-label">
          {project.category || "CATEGORY / ADD"} ·{" "}
          {project.year || "YEAR / ADD"}
        </Text>
      </div>

      <header className="project-page-header">
        <Text as="h1" className="project-title project-page-title">
          {project.title}
        </Text>
        <Text className="editorial-copy project-page-overview">
          {description}
        </Text>
      </header>

      <div className="project-page-media">
        <MediaPlaceholder
          index={project.id}
          composition={project.composition}
          mediaType={project.mediaType}
          image={project.image}
          video={project.video}
          priority
        />
      </div>

      <div className="project-page-facts">
        <div>
          <Text className="micro-label">ROLE</Text>
          <Text>{project.role || "[ADD ROLE]"}</Text>
        </div>
        <div>
          <Text className="micro-label">YEAR</Text>
          <Text>{project.year || "[ADD YEAR]"}</Text>
        </div>
        <div>
          <Text className="micro-label">TOOLS</Text>
          <Text>
            {project.tools?.length ? project.tools.join(" / ") : "[ADD TOOLS]"}
          </Text>
        </div>
      </div>

      <div className="project-page-sections">
        {caseStudySections.map(([label, field]) => (
          <section className="project-page-section" key={field}>
            <Text className="micro-label">{label}</Text>
            <Text className="editorial-copy">
              {project[field] || `[ADD ${label}]`}
            </Text>
          </section>
        ))}
      </div>

      {project.additionalMedia?.length ? (
        <div className="project-page-additional-media">
          {project.additionalMedia.map((media, index) => (
            <div className="project-page-media" key={`${media.src}-${index}`}>
              <MediaPlaceholder
                index={String(index + 2).padStart(2, "0")}
                composition={project.composition}
                mediaType={media.type}
                image={media.type === "image" ? media : null}
                video={media.type === "video" ? media : null}
              />
            </div>
          ))}
        </div>
      ) : null}

      {project.link ? (
        <NavLink
          className="micro-label project-page-external-link"
          href={project.link}
          target="_blank"
          rel="noreferrer"
        >
          VISIT PROJECT
          <ArrowIcon className="project-page-external-arrow" />
        </NavLink>
      ) : null}

      {nextProject ? (
        <Link className="project-page-next" to={`/work/${nextProject.slug}`}>
          <Text className="micro-label">NEXT PROJECT / {nextProject.id}</Text>
          <Text as="span" className="section-title">
            {nextProject.title}
          </Text>
        </Link>
      ) : null}
    </article>
  )
}

export function NotFoundPage() {
  return (
    <section
      className="project-page section-frame"
      aria-labelledby="not-found-title"
    >
      <Seo title={`Page not found — ${siteMetadata.name}`} path="/404" />
      <div className="section-index">
        <Text className="micro-label">404 / NOT FOUND</Text>
      </div>
      <div className="project-page-header">
        <Text as="h1" className="section-title" id="not-found-title">
          PAGE NOT
          <br />
          <em>FOUND.</em>
        </Text>
        <Link className="micro-label" to="/">
          RETURN HOME
        </Link>
      </div>
    </section>
  )
}
