import { useEffect, useRef } from "react"
import { Outlet, ScrollRestoration, useLocation } from "react-router"
import { CustomCursor } from "../components/CustomCursor"
import { Header } from "../components/Header"
import { ProximityEffects } from "../components/ProximityEffects"
import { NavLink } from "../components/primitives"

function HashScrollManager() {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) return

    const id = decodeURIComponent(location.hash.slice(1))
    let secondFrame = 0
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ block: "start" })
      })
    })

    return () => {
      window.cancelAnimationFrame(firstFrame)
      if (secondFrame) window.cancelAnimationFrame(secondFrame)
    }
  }, [location.hash, location.pathname])

  return null
}

function RouteFocusManager() {
  const location = useLocation()
  const previousPath = useRef(location.pathname)

  useEffect(() => {
    if (previousPath.current !== location.pathname) {
      document.getElementById("main-content")?.focus()
      previousPath.current = location.pathname
    }
  }, [location.pathname])

  return null
}

export function RootLayout() {
  return (
    <div className="site-shell">
      <NavLink className="skip-link" href="#main-content">
        Skip to content
      </NavLink>
      <CustomCursor />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <HashScrollManager />
      <RouteFocusManager />
      <ProximityEffects />
      <ScrollRestoration />
    </div>
  )
}
