import { useEffect } from "react"
import { subscribeToScrollFrame } from "./scrollFrame"

const CHARACTER_SELECTOR = "[data-proximity-char]"
const BLOCK_SELECTOR = "[data-proximity-block]"
const IGNORE_SELECTOR = [
  "script",
  "style",
  "noscript",
  "textarea",
  "input",
  "select",
  "option",
  "svg",
  "canvas",
  "video",
  "img",
  "[data-proximity-ignore]",
  CHARACTER_SELECTOR,
  ".proximity-text",
  ".custom-cursor",
  ".skills-marquee-label",
  ".work-progress",
  ".contact-printer-status-label",
  ".hero-contact-arrow",
  ".contact-link-arrow",
].join(",")

const proximityRadius = 180

function wrapTextNode(node: Text, blocks: Set<HTMLElement>) {
  const parent = node.parentElement
  const value = node.nodeValue

  if (!parent || !value || !value.trim()) return
  if (parent.closest(IGNORE_SELECTOR)) return

  const wrapper = document.createElement("span")
  wrapper.className = "proximity-text"

  Array.from(value).forEach((character) => {
    if (/\s/.test(character)) {
      wrapper.appendChild(document.createTextNode(character))
      return
    }

    const span = document.createElement("span")
    span.className = "proximity-char"
    span.setAttribute("data-proximity-char", "")
    span.textContent = character
    wrapper.appendChild(span)
  })

  parent.setAttribute("data-proximity-block", "")
  blocks.add(parent)
  node.replaceWith(wrapper)
}

function scanSubtree(root: Node, blocks: Set<HTMLElement>) {
  if (root.nodeType === Node.TEXT_NODE) {
    wrapTextNode(root as Text, blocks)
    return
  }

  if (
    root.nodeType !== Node.ELEMENT_NODE &&
    root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE
  ) {
    return
  }

  if (root instanceof Element) {
    if (root.matches(IGNORE_SELECTOR)) return

    if (root.matches(BLOCK_SELECTOR)) blocks.add(root as HTMLElement)
    root
      .querySelectorAll<HTMLElement>(BLOCK_SELECTOR)
      .forEach((block) => blocks.add(block))
  }

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement
      if (!parent || !node.nodeValue?.trim()) return NodeFilter.FILTER_REJECT
      if (parent.closest(IGNORE_SELECTOR)) return NodeFilter.FILTER_REJECT
      return NodeFilter.FILTER_ACCEPT
    },
  })
  const textNodes: Text[] = []

  while (walker.nextNode()) {
    textNodes.push(walker.currentNode as Text)
  }

  textNodes.forEach((node) => wrapTextNode(node, blocks))
}

export function ProximityEffects() {
  useEffect(() => {
    const shell = document.querySelector<HTMLElement>(".site-shell")
    if (!shell) return

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)")
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const blocks = new Set<HTMLElement>()
    let activeCharacters = new Set<HTMLElement>()
    let observer: MutationObserver | null = null
    let animationFrame = 0
    let unsubscribeScroll: (() => void) | null = null
    let enabled = false
    let hasPointer = false
    let pointerX = 0
    let pointerY = 0

    const clearCharacters = () => {
      activeCharacters.forEach((character) => {
        character.style.setProperty("--proximity", "0")
      })
      activeCharacters = new Set()
    }

    const updateProximity = () => {
      animationFrame = 0
      if (!enabled || !hasPointer) return

      const nextCharacters = new Set<HTMLElement>()

      blocks.forEach((block) => {
        if (!block.isConnected) {
          blocks.delete(block)
          return
        }

        const bounds = block.getBoundingClientRect()
        if (bounds.width === 0 && bounds.height === 0) return
        if (
          pointerX < bounds.left - proximityRadius ||
          pointerX > bounds.right + proximityRadius ||
          pointerY < bounds.top - proximityRadius ||
          pointerY > bounds.bottom + proximityRadius
        ) {
          return
        }

        block
          .querySelectorAll<HTMLElement>(CHARACTER_SELECTOR)
          .forEach((character) => {
            const characterBounds = character.getBoundingClientRect()
            const distance = Math.hypot(
              pointerX - (characterBounds.left + characterBounds.width / 2),
              pointerY - (characterBounds.top + characterBounds.height / 2),
            )
            const linear = Math.max(0, 1 - distance / proximityRadius)
            const proximity = linear * linear * (3 - 2 * linear)

            character.style.setProperty("--proximity", proximity.toFixed(3))
            if (proximity > 0) nextCharacters.add(character)
          })
      })

      activeCharacters.forEach((character) => {
        if (nextCharacters.has(character)) return
        character.style.setProperty("--proximity", "0")
      })
      activeCharacters = nextCharacters
    }

    const requestUpdate = () => {
      if (animationFrame) return
      animationFrame = window.requestAnimationFrame(updateProximity)
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return

      pointerX = event.clientX
      pointerY = event.clientY
      hasPointer = true
      requestUpdate()
    }

    const handlePointerExit = () => {
      hasPointer = false
      clearCharacters()
    }

    const start = () => {
      if (enabled || !finePointer.matches || reducedMotion.matches) return

      enabled = true
      scanSubtree(shell, blocks)

      observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "characterData") {
            scanSubtree(mutation.target, blocks)
            return
          }

          mutation.addedNodes.forEach((node) => {
            scanSubtree(node, blocks)
          })
        })
      })
      observer.observe(shell, {
        childList: true,
        subtree: true,
        characterData: true,
      })
      observer.takeRecords()

      window.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      })
      document.documentElement.addEventListener("pointerleave", handlePointerExit)
      window.addEventListener("blur", handlePointerExit)
      unsubscribeScroll = subscribeToScrollFrame(requestUpdate)
    }

    const stop = () => {
      if (!enabled) return

      enabled = false
      observer?.disconnect()
      observer = null
      window.removeEventListener("pointermove", handlePointerMove)
      document.documentElement.removeEventListener(
        "pointerleave",
        handlePointerExit,
      )
      window.removeEventListener("blur", handlePointerExit)
      unsubscribeScroll?.()
      unsubscribeScroll = null

      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      animationFrame = 0
      hasPointer = false
      clearCharacters()
    }

    const sync = () => {
      stop()
      start()
    }

    start()
    finePointer.addEventListener("change", sync)
    reducedMotion.addEventListener("change", sync)

    return () => {
      finePointer.removeEventListener("change", sync)
      reducedMotion.removeEventListener("change", sync)
      stop()
    }
  }, [])

  return null
}
