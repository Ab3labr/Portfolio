type ScrollFrameSubscriber = () => void

const subscribers = new Set<ScrollFrameSubscriber>()
let animationFrame = 0

const flushScrollFrame = () => {
  animationFrame = 0
  subscribers.forEach((subscriber) => subscriber())
}

const requestScrollFrame = () => {
  if (animationFrame || subscribers.size === 0) return
  animationFrame = window.requestAnimationFrame(flushScrollFrame)
}

export function subscribeToScrollFrame(subscriber: ScrollFrameSubscriber) {
  const shouldListen = subscribers.size === 0
  subscribers.add(subscriber)

  if (shouldListen) {
    window.addEventListener("scroll", requestScrollFrame, { passive: true })
  }

  requestScrollFrame()

  return () => {
    subscribers.delete(subscriber)
    if (subscribers.size > 0) return

    window.removeEventListener("scroll", requestScrollFrame)
    if (animationFrame) window.cancelAnimationFrame(animationFrame)
    animationFrame = 0
  }
}

export function requestSharedScrollFrame() {
  requestScrollFrame()
}