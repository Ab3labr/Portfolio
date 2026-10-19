import { useEffect, useRef, useState } from "react";
import { Text } from "./primitives";

type CursorMode = "default" | "interactive" | "explore";

type Point = {
  x: number;
  y: number;
};

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const modeRef = useRef<CursorMode>("default");
  const targetRef = useRef<Point>({ x: 0, y: 0 });
  const currentRef = useRef<Point>({ x: 0, y: 0 });
  const animationFrameRef = useRef(0);
  const hasPositionRef = useRef(false);
  const isVisibleRef = useRef(false);
  const [mode, setMode] = useState<CursorMode>("default");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const pointerSupport = window.matchMedia("(pointer: fine) and (min-width: 801px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isEnabled = pointerSupport.matches && !reducedMotion.matches;

    const stopAnimation = () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = 0;
      }
    };

    const animate = () => {
      const cursor = cursorRef.current;
      if (!cursor || !isVisibleRef.current || !isEnabled) {
        stopAnimation();
        return;
      }

      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.24;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.24;
      cursor.style.transform = `translate3d(${currentRef.current.x}px, ${currentRef.current.y}px, 0)`;
      animationFrameRef.current = window.requestAnimationFrame(animate);
    };

    const showCursor = () => {
      if (isVisibleRef.current) return;
      isVisibleRef.current = true;
      setIsVisible(true);
      animationFrameRef.current = window.requestAnimationFrame(animate);
    };

    const hideCursor = () => {
      isVisibleRef.current = false;
      hasPositionRef.current = false;
      setIsVisible(false);
      stopAnimation();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!isEnabled) return;

      targetRef.current = { x: event.clientX, y: event.clientY };
      if (!hasPositionRef.current) {
        currentRef.current = { ...targetRef.current };
        hasPositionRef.current = true;
      }
      showCursor();

      const target = event.target instanceof Element ? event.target : null;
      const interactive = target?.closest("a, button, [data-cursor]");
      const nextMode: CursorMode =
        interactive?.getAttribute("data-cursor") === "explore"
          ? "explore"
          : interactive
            ? "interactive"
            : "default";

      if (nextMode !== modeRef.current) {
        modeRef.current = nextMode;
        setMode(nextMode);
      }
    };

    const handleSupportChange = () => {
      isEnabled = pointerSupport.matches && !reducedMotion.matches;
      if (!isEnabled) hideCursor();
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", hideCursor);
    pointerSupport.addEventListener("change", handleSupportChange);
    reducedMotion.addEventListener("change", handleSupportChange);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("pointerleave", hideCursor);
      pointerSupport.removeEventListener("change", handleSupportChange);
      reducedMotion.removeEventListener("change", handleSupportChange);
      stopAnimation();
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor custom-cursor--${mode} ${isVisible ? "is-visible" : ""}`}
      aria-hidden="true"
    >
      <span className="cursor-dot" />
      <span className="cursor-ring" />
      <Text as="span" className="cursor-label">
        EXPLORE
      </Text>
    </div>
  );
}
