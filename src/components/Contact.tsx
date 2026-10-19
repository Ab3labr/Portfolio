import { useEffect, useRef, useState } from "react"
import { siBehance } from "simple-icons"
import { Text } from "./primitives"

const portfolioMark =
  "M16 1C17.7 9.4 22.6 14.3 31 16C22.6 17.7 17.7 22.6 16 31C14.3 22.6 9.4 17.7 1 16C9.4 14.3 14.3 9.4 16 1Z"

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
  const [isActive, setIsActive] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [isBarcodeVisible, setIsBarcodeVisible] = useState(false)

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
      <div className="contact-inner">
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
          className="contact-paper"
          aria-labelledby="contact-title"
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
                  <span className="contact-link-arrow" aria-hidden="true">&#8599;</span>
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
        </article>
      </div>
    </footer>
  )
}
