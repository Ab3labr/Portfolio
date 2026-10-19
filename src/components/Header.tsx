import { Fragment, useLayoutEffect, useRef } from "react"
import { Link, useLocation } from "react-router"
import { navigationItems } from "../data/site"
import { Text } from "./primitives"
import {
  requestSharedScrollFrame,
  subscribeToScrollFrame,
} from "./scrollFrame"

export function Header() {
  const shellRef = useRef<HTMLElement>(null)
  const pillRef = useRef<HTMLElement>(null)
  const activeHashRef = useRef("")
  const location = useLocation()

  const handleNavigation = (hash: string) => {
    if (location.pathname === "/") {
      window.setTimeout(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ block: "start" })
      }, 0)
    }
  }

  useLayoutEffect(() => {
    const shell = shellRef.current
    const pill = pillRef.current
    if (!shell || !pill) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")

    const updatePosition = () => {
      const viewportHeight = window.innerHeight
      const topOffset = window.innerWidth <= 560 ? 12 : 20
      const bottomOffset = Math.max(64, viewportHeight * 0.1 - 24)
      const bottomPosition = Math.max(
        topOffset,
        viewportHeight - pill.offsetHeight - bottomOffset,
      )
      const transitionDistance = Math.max(viewportHeight * 0.45, 240)
      const linearProgress = Math.min(
        Math.max(window.scrollY / transitionDistance, 0),
        1,
      )
      const progress = reducedMotion.matches
        ? window.scrollY > 0
          ? 1
          : 0
        : linearProgress * linearProgress * (3 - 2 * linearProgress)
      const offset = bottomPosition + (topOffset - bottomPosition) * progress

      shell.style.setProperty("--floating-nav-offset", `${offset}px`)

      let nextActiveHash = location.pathname.startsWith("/work/") ? "#work" : ""
      if (location.pathname === "/") {
        nextActiveHash = navigationItems[0]?.hash ?? ""
        const activeLine = viewportHeight * 0.4

        for (const item of navigationItems) {
          const section = document.getElementById(item.hash.slice(1))
          if (section && section.getBoundingClientRect().top <= activeLine) {
            nextActiveHash = item.hash
          }
        }
      }

      if (activeHashRef.current !== nextActiveHash) {
        activeHashRef.current = nextActiveHash
        pill.querySelectorAll<HTMLAnchorElement>(".floating-nav-link").forEach((link) => {
          if (link.hash === nextActiveHash) {
            link.setAttribute("aria-current", "location")
          } else {
            link.removeAttribute("aria-current")
          }
        })
      }
    }

    const unsubscribeScroll = subscribeToScrollFrame(updatePosition)
    const resizeObserver = new ResizeObserver(requestSharedScrollFrame)
    resizeObserver.observe(pill)
    window.addEventListener("resize", requestSharedScrollFrame)
    reducedMotion.addEventListener("change", requestSharedScrollFrame)

    return () => {
      resizeObserver.disconnect()
      unsubscribeScroll()
      window.removeEventListener("resize", requestSharedScrollFrame)
      reducedMotion.removeEventListener("change", requestSharedScrollFrame)
    }
  }, [location.pathname])

  return (
    <header className="site-header" ref={shellRef}>
      <nav className="floating-nav" aria-label="Primary navigation" ref={pillRef}>
        {navigationItems.map((item, index) => (
          <Fragment key={item.hash}>
            <Link
              className="floating-nav-link"
              to={location.pathname === "/" ? item.hash : `/${item.hash}`}
              onClick={() => handleNavigation(item.hash)}
            >
              <Text as="span">{item.label}</Text>
            </Link>
            {index === 1 ? (
              <span className="floating-nav-star" aria-hidden="true">
                <svg viewBox="0 0 32 32" focusable="false">
                  <path d="M16 1C17.7 9.4 22.6 14.3 31 16C22.6 17.7 17.7 22.6 16 31C14.3 22.6 9.4 17.7 1 16C9.4 14.3 14.3 9.4 16 1Z" />
                </svg>
              </span>
            ) : null}
          </Fragment>
        ))}
      </nav>
    </header>
  )
}
