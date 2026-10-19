import { forwardRef, useState } from "react"
import { portraitFaces } from "../data/about"
import { Text } from "./primitives"

type PortraitCardProps = {
  className?: string
  caption?: string
}

export const PortraitCard = forwardRef<HTMLDivElement, PortraitCardProps>(
  function PortraitCard({ className = "", caption }, ref) {
    const [failedFace, setFailedFace] = useState<string | null>(null)

    return (
      <div
        className={`portrait-card ${className}`}
        ref={ref}
        role="img"
        aria-label={`${portraitFaces.front.alt}; reverse side: ${portraitFaces.back.alt}${caption ? `; ${caption}` : ""}`}
      >
        <div className="portrait-card-inner" aria-hidden="true">
          {Object.entries(portraitFaces).map(([side, face]) => (
            <div
              className={`portrait-card-face portrait-card-face--${side}`}
              key={side}
            >
              {face.src && failedFace !== side ? (
                <img
                  src={face.src}
                  alt={face.alt}
                  loading="eager"
                  decoding="async"
                  onError={() => setFailedFace(side)}
                />
              ) : (
                <Text className="micro-label">
                  {face.placeholderLabel}
                </Text>
              )}
            </div>
          ))}
          {caption ? (
            <span className="portrait-card-caption hero-secondary-label">
              {caption}
            </span>
          ) : null}
        </div>
      </div>
    )
  },
)
