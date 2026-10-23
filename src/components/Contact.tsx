import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react"
import { siBehance } from "simple-icons"
import ArrowIcon from "./ArrowIcon"
import { Text } from "./primitives"

const portfolioMark =
  "M16 1C17.7 9.4 22.6 14.3 31 16C22.6 17.7 17.7 22.6 16 31C14.3 22.6 9.4 17.7 1 16C9.4 14.3 14.3 9.4 16 1Z"

const shredCompleteProgress = 0.42
const shredFeedDuration = 620
const shredKeyboardDuration = 980
const shredReturnDuration = 260

const shredderStrips = Array.from({ length: 26 }, (_, index) => ({
  length: 3.2 + (((index * 37) % 15) / 15) * 1.6,
  lean: ((index * 29) % 7) - 3,
  tilt: ((index * 13) % 5) - 2,
  start: ((index * 7) % 10) * 0.014 + ((index * 11) % 3) * 0.006,
  rate: 1.24 + ((index * 5) % 4) * 0.035,
  drop: 0.12 + (((index * 17) % 7) / 7) * 0.26,
  twist: (((index * 19) % 5) - 2) * 0.9,
  fallX: (((index * 23) % 9) - 4) * 0.6,
  fallY: 2.1 + (((index * 31) % 9) / 9) * 1.1,
  fallRotate: (((index * 17) % 7) - 3) * 1.1,
  fallDuration: 620 + ((index * 19) % 5) * 35,
  fallDelay: ((index * 11) % 5) * 14,
}))

type DragSession = {
  pointerId: number
  startY: number
  startProgress: number
  feedDistance: number
  source: "paper" | "handle"
  moved: boolean
}

type ShredState = "idle" | "dragging" | "feeding" | "shredded" | "reprinting"

const barcodeBars = [
  [2, 32, 1], [1, 24, 2], [4, 32, 1], [1, 32, 2], [3, 19, 1], [2, 32, 1],
  [1, 27, 2], [5, 32, 2], [1, 32, 1], [3, 22, 1], [2, 32, 2], [1, 29, 1],
  [4, 32, 1], [1, 18, 2], [2, 32, 1], [5, 25, 2], [1, 32, 1], [2, 32, 2],
  [3, 20, 1], [1, 32, 1], [4, 32, 2], [1, 26, 1], [2, 32, 2], [1, 32, 1],
  [5, 21, 1], [2, 32, 2], [1, 32, 1], [3, 24, 1], [1, 32, 2], [4, 32, 1],
  [2, 17, 2], [1, 32, 1],
] as const

const contactItems = [
  {
    number: "01",
    label: "EMAIL",
    value: "itsabel08@gmail.com",
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=itsabel08%40gmail.com",
    icon: "mail",
  },
  {
    number: "02",
    label: "LINKEDIN",
    value: "Abel Abraham",
    href: "https://www.linkedin.com/in/abel-abraham-2993b1274/",
    icon: "linkedin",
  },
  {
    number: "03",
    label: "BEHANCE",
    value: "Abel Abraham",
    href: "https://www.behance.net/abelabraham4",
    icon: siBehance.path,
  },
] as const

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const barcodeRef = useRef<HTMLDivElement>(null)
  const contactInnerRef = useRef<HTMLDivElement>(null)
  const paperRef = useRef<HTMLElement>(null)
  const pullHandleRef = useRef<HTMLButtonElement>(null)
  const resetButtonRef = useRef<HTMLButtonElement>(null)
  const progressRef = useRef(0)
  const dragRef = useRef<DragSession | null>(null)
  const progressFrameRef = useRef(0)
  const progressTokenRef = useRef(0)
  const reprintFrameRef = useRef(0)
  const suppressClickRef = useRef(false)
  const suppressClickTimerRef = useRef<number | null>(null)
  const focusResetButtonRef = useRef(false)
  const focusPullHandleRef = useRef(false)
  const [isActive, setIsActive] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [isBarcodeVisible, setIsBarcodeVisible] = useState(false)
  const [shredState, setShredState] = useState<ShredState>("idle")

  const canInteractWithShredder =
    isComplete &&
    shredState !== "feeding" &&
    shredState !== "shredded" &&
    shredState !== "reprinting"
  const isShredSurface = isComplete && shredState !== "reprinting"
  const isShredding = shredState === "dragging" || shredState === "feeding"
  const isShredded = shredState === "shredded"

  const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const writeProgress = (value: number) => {
    const nextProgress = Math.min(Math.max(value, 0), 1)
    progressRef.current = nextProgress
    contactInnerRef.current?.style.setProperty(
      "--shred-progress",
      nextProgress.toFixed(4),
    )
  }

  const cancelProgressAnimation = () => {
    progressTokenRef.current += 1
    if (progressFrameRef.current) {
      window.cancelAnimationFrame(progressFrameRef.current)
      progressFrameRef.current = 0
    }
  }

  const animateProgress = (
    target: number,
    duration: number,
    onComplete?: () => void,
  ) => {
    cancelProgressAnimation()
    const token = progressTokenRef.current
    const startProgress = progressRef.current

    if (duration <= 0) {
      writeProgress(target)
      onComplete?.()
      return
    }

    const startTime = window.performance.now()

    const step = (now: number) => {
      if (token !== progressTokenRef.current) return

      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      writeProgress(startProgress + (target - startProgress) * eased)

      if (progress < 1) {
        progressFrameRef.current = window.requestAnimationFrame(step)
        return
      }

      progressFrameRef.current = 0
      onComplete?.()
    }

    progressFrameRef.current = window.requestAnimationFrame(step)
  }

  const cancelReprintFrame = () => {
    if (!reprintFrameRef.current) return
    window.cancelAnimationFrame(reprintFrameRef.current)
    reprintFrameRef.current = 0
  }

  const scheduleReprint = () => {
    reprintFrameRef.current = window.requestAnimationFrame(() => {
      setShredState("idle")
      reprintFrameRef.current = window.requestAnimationFrame(() => {
        reprintFrameRef.current = 0
        setIsActive(true)
        if (prefersReducedMotion()) setIsComplete(true)
      })
    })
  }

  const suppressNextClick = () => {
    suppressClickRef.current = true
    if (suppressClickTimerRef.current) {
      window.clearTimeout(suppressClickTimerRef.current)
    }
    suppressClickTimerRef.current = window.setTimeout(() => {
      suppressClickRef.current = false
      suppressClickTimerRef.current = null
    }, 450)
  }

  const finishShred = (keyboardInitiated: boolean) => {
    setShredState("shredded")
    if (keyboardInitiated) focusResetButtonRef.current = true
  }

  const startAutoShred = (keyboardInitiated: boolean) => {
    if (
      !isComplete ||
      shredState === "feeding" ||
      shredState === "shredded" ||
      shredState === "reprinting"
    ) {
      return
    }

    cancelProgressAnimation()
    setShredState("feeding")
    animateProgress(
      1,
      prefersReducedMotion()
        ? 0
        : keyboardInitiated
          ? shredKeyboardDuration
          : shredFeedDuration,
      () => finishShred(keyboardInitiated),
    )
  }

  const startDrag = (
    event: ReactPointerEvent<HTMLElement>,
    source: DragSession["source"],
  ) => {
    if (!canInteractWithShredder || dragRef.current) return
    if (event.pointerType === "mouse" && event.button !== 0) return
    if (source === "paper" && event.pointerType !== "mouse") return

    const paperHeight = paperRef.current?.offsetHeight ?? 480
    const feedDistance = Math.min(Math.max(paperHeight * 0.58, 190), 340)

    cancelProgressAnimation()
    if (suppressClickTimerRef.current) {
      window.clearTimeout(suppressClickTimerRef.current)
      suppressClickTimerRef.current = null
    }
    suppressClickRef.current = false
    dragRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startProgress: progressRef.current,
      feedDistance,
      source,
      moved: false,
    }
    setShredState("dragging")
    paperRef.current?.setPointerCapture(event.pointerId)
    event.preventDefault()
  }

  const handlePaperPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (!canInteractWithShredder) return
    const target = event.target
    if (target instanceof Element && target.closest("a, button")) return
    startDrag(event, "paper")
  }

  const handlePullPointerDown = (
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => {
    startDrag(event, "handle")
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    const delta = event.clientY - drag.startY
    if (Math.abs(delta) > 4) drag.moved = true
    writeProgress(drag.startProgress + delta / drag.feedDistance)

    if (drag.moved && event.cancelable) event.preventDefault()
  }

  const releasePointerCapture = (pointerId: number) => {
    if (!paperRef.current?.hasPointerCapture(pointerId)) return
    paperRef.current.releasePointerCapture(pointerId)
  }

  const handlePointerEnd = (
    event: ReactPointerEvent<HTMLElement>,
    cancelled = false,
  ) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    dragRef.current = null
    releasePointerCapture(event.pointerId)

    if (drag.moved) suppressNextClick()

    if (!cancelled && progressRef.current >= shredCompleteProgress) {
      startAutoShred(false)
      return
    }

    if (!cancelled && drag.source === "handle" && !drag.moved) {
      suppressNextClick()
      startAutoShred(false)
      return
    }

    animateProgress(
      0,
      prefersReducedMotion() ? 0 : shredReturnDuration,
      () => setShredState("idle"),
    )
  }

  const handlePullClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (suppressClickRef.current) {
      suppressClickRef.current = false
      return
    }

    startAutoShred(event.detail === 0)
  }

  const handlePrintAgain = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    cancelProgressAnimation()
    cancelReprintFrame()
    dragRef.current = null
    writeProgress(0)
    suppressClickRef.current = false
    focusPullHandleRef.current = event.detail === 0
    setIsComplete(false)
    setShredState("reprinting")
    setIsActive(false)
    scheduleReprint()
  }

  useEffect(() => {
    return () => {
      cancelProgressAnimation()
      cancelReprintFrame()
      if (suppressClickTimerRef.current) {
        window.clearTimeout(suppressClickTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (shredState !== "shredded" || !focusResetButtonRef.current) return

    focusResetButtonRef.current = false
    const frame = window.requestAnimationFrame(() => {
      resetButtonRef.current?.focus()
    })

    return () => window.cancelAnimationFrame(frame)
  }, [shredState])

  useEffect(() => {
    if (!isComplete || !focusPullHandleRef.current) return

    focusPullHandleRef.current = false
    const frame = window.requestAnimationFrame(() => {
      pullHandleRef.current?.focus()
    })

    return () => window.cancelAnimationFrame(frame)
  }, [isComplete])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setIsActive(true)
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setIsComplete(true)
        }
        observer.disconnect()
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const barcode = barcodeRef.current
    if (!barcode) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setIsBarcodeVisible(true)
        observer.disconnect()
      },
      { threshold: 0.35 },
    )
    const revealForReducedMotion = () => {
      if (!reducedMotion.matches) return
      setIsBarcodeVisible(true)
      observer.disconnect()
    }

    reducedMotion.addEventListener("change", revealForReducedMotion)
    if (reducedMotion.matches) revealForReducedMotion()
    else observer.observe(barcode)

    return () => {
      observer.disconnect()
      reducedMotion.removeEventListener("change", revealForReducedMotion)
    }
  }, [])

  return (
    <footer
      className={`contact section-frame${isActive ? " contact--active" : ""}`}
      id="contact"
      aria-labelledby="contact-title"
      ref={sectionRef}
    >
      <div
        className="contact-inner"
        ref={contactInnerRef}
        style={{ "--shred-progress": 0 } as CSSProperties}
      >
        <div className="contact-printer" aria-label="Thermal receipt printer">
          <div className="contact-printer-topline">
            <span className="contact-printer-brand">
              <svg viewBox="0 0 32 32" aria-hidden="true">
                <path d={portfolioMark} />
              </svg>
              <span>AA / STUDIO</span>
            </span>
            <span className="contact-printer-model">FIELD NOTES 01</span>
          </div>
          <div className="contact-printer-face">
            <span className="contact-printer-status" aria-hidden="true" />
            <span className="contact-printer-status-label">
              {isComplete ? "PRINT COMPLETE" : isActive ? "PRINTING" : "READY"}
            </span>
            <span className="contact-printer-slot" aria-hidden="true" />
          </div>
        </div>

        <article
          className={`contact-paper${isShredSurface ? " contact-paper--shreddable" : ""}${isShredding ? " contact-paper--dragging" : ""}${isShredded ? " contact-paper--shredded" : ""}${shredState === "reprinting" ? " contact-paper--reprinting" : ""}`}
          ref={paperRef}
          aria-labelledby="contact-title"
          data-shred-state={shredState}
          onPointerDown={handlePaperPointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={(event) => handlePointerEnd(event, true)}
          onTransitionEnd={(event) => {
            if (event.propertyName === "clip-path") setIsComplete(true)
          }}
        >
          <header className="contact-paper-header">
            <div className="contact-paper-identity">
              <svg className="contact-paper-mark" viewBox="0 0 32 32" aria-hidden="true">
                <path d={portfolioMark} />
              </svg>
              <div>
                <Text className="contact-paper-name">ABEL ABRAHAM</Text>
                <Text className="contact-paper-tagline">DESIGN. BUILD. REFINE.</Text>
              </div>
            </div>
            <Text className="contact-paper-edition">PORTFOLIO / 2026</Text>
          </header>

          <div className="contact-paper-rule" />

          <div className="contact-paper-main">
            <div className="contact-message">
              <Text className="contact-paper-eyebrow">A NOTE BEFORE YOU GO</Text>
              <Text as="h2" className="contact-paper-title" id="contact-title">
                Thanks for making it this far.
              </Text>
              <Text className="contact-paper-subtitle">Let&apos;s make something meaningful.</Text>
            </div>

            <nav className="contact-links" aria-label="Contact links">
              {contactItems.map((item) => (
                <a
                  className="contact-link"
                  href={item.href}
                  key={item.number}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${item.number}, ${item.label}: ${item.value}`}
                >
                  <span className="contact-link-icon" aria-hidden="true">
                    {item.icon === "mail" ? (
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M3.5 6.5h17v11h-17zM4 7l8 6 8-6" />
                      </svg>
                    ) : item.icon === "linkedin" ? (
                      <svg viewBox="0 0 24 24">
                        <path d="M5 9h3v10H5zM6.5 5.5a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5ZM10 9h2.9v1.4h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6V19h-3v-4.93c0-1.18-.02-2.7-1.65-2.7-1.65 0-1.9 1.29-1.9 2.62V19h-3V9Z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d={item.icon} />
                      </svg>
                    )}
                  </span>
                  <span className="contact-link-copy">
                    <span className="contact-link-label">{item.number} — {item.label}</span>
                    <span className="contact-link-value">{item.value}</span>
                  </span>
                  <span className="contact-link-arrow" aria-hidden="true">
                    <ArrowIcon />
                  </span>
                </a>
              ))}
            </nav>
          </div>

          <div className="contact-paper-rule contact-paper-rule--lower" />

          <footer className="contact-paper-footer">
            <div
              className={`contact-barcode${isBarcodeVisible ? " contact-barcode--visible" : ""}`}
              ref={barcodeRef}
              aria-hidden="true"
            >
              <svg viewBox="0 0 140 32" preserveAspectRatio="none">
                {barcodeBars.map(([width, height], index) => {
                  const x = 5 + barcodeBars
                    .slice(0, index)
                    .reduce((total, [barWidth, , gap]) => total + barWidth + gap, 0)
                  return <rect key={index} x={x} y={32 - height} width={width} height={height} />
                })}
              </svg>
            </div>
            <Text className="contact-closing">THANK YOU FOR BEING HERE.</Text>
            <Text className="contact-end">— END OF PAGE —</Text>
          </footer>

          {canInteractWithShredder ? (
            <button
              className="contact-paper-pull"
              ref={pullHandleRef}
              type="button"
              aria-label="Pull the receipt down to shred it"
              onPointerDown={handlePullPointerDown}
              onClick={handlePullClick}
            >
              <span aria-hidden="true">
                <ArrowIcon
                  className="contact-paper-pull-arrow"
                  direction="down"
                />
              </span>
              <span>Pull to shred</span>
            </button>
          ) : null}
        </article>

        <div
          className={`contact-shredder${isShredded ? " contact-shredder--settled" : ""}`}
          aria-hidden="true"
        >
          <div className="contact-shredder-strips">
            {shredderStrips.map((strip, index) => (
              <span
                className="contact-shredder-strip"
                key={index}
                style={
                  {
                    "--strip-length": `${strip.length}rem`,
                    "--strip-lean": `${strip.lean}px`,
                    "--strip-tilt": `${strip.tilt}deg`,
                    "--strip-start": strip.start,
                    "--strip-rate": strip.rate,
                    "--strip-drop": `${strip.drop}rem`,
                    "--strip-twist": `${strip.twist}deg`,
                    "--strip-fall-x": `${strip.fallX}px`,
                    "--strip-fall-y": `${strip.fallY}rem`,
                    "--strip-fall-rotate": `${strip.fallRotate}deg`,
                    "--strip-fall-duration": `${strip.fallDuration}ms`,
                    "--strip-fall-delay": `${strip.fallDelay}ms`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
          <span className="contact-shredder-slot" />
          <span className="contact-shredder-label">AA / SHRED</span>
        </div>

        <div className="contact-shred-controls" aria-live="polite">
          {isShredded ? (
            <button
              className="contact-shred-reset"
              ref={resetButtonRef}
              type="button"
              aria-label="Print the receipt again"
              onClick={handlePrintAgain}
            >
              <span aria-hidden="true">
                <ArrowIcon
                  className="contact-shred-reset-icon"
                  direction="clockwise"
                />
              </span>
              <span>Print again</span>
            </button>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
