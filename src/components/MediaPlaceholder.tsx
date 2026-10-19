import { Text } from "./primitives"
import type { Project } from "../data/projects"

type MediaPlaceholderProps = {
  index: string
  composition: Project["composition"]
  mediaType: Project["mediaType"]
  image: Project["image"]
  video: Project["video"]
  priority?: boolean
}

export function MediaPlaceholder({
  index,
  composition,
  mediaType,
  image,
  video,
  priority = false,
}: MediaPlaceholderProps) {
  if (mediaType === "image" && image) {
    return (
      <img
        className="project-media-asset"
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
      />
    )
  }

  if (mediaType === "video" && video) {
    return (
      <video
        className="project-media-asset"
        src={video.src}
        aria-label={video.alt}
        controls
        playsInline
        preload="metadata"
      >
        {video.alt}
      </video>
    )
  }

  return (
    <div className={`media-placeholder media-placeholder--${composition}`}>
      <span
        className="placeholder-cross placeholder-cross--a"
        aria-hidden="true"
      />
      <span
        className="placeholder-cross placeholder-cross--b"
        aria-hidden="true"
      />
      <div className="media-placeholder-label">
        <Text className="micro-label">MEDIA / {index}</Text>
        <Text className="placeholder-format">IMAGE OR VIDEO</Text>
      </div>
      <span className="media-placeholder-center" aria-hidden="true" />
    </div>
  )
}
