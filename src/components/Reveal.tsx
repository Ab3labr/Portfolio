import { useEffect, useRef, type CSSProperties, type PropsWithChildren } from "react";

type RevealProps = PropsWithChildren<{
  className?: string;
  delay?: number;
}>;

let revealObserver: IntersectionObserver | null = null;

function observeReveal(node: HTMLElement | null) {
  if (!node) return () => {};

  if (
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    node.classList.add("is-visible");
    return () => {};
  }

  revealObserver ??= new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "-8% 0px", threshold: 0.12 },
  );

  revealObserver.observe(node);
  return () => revealObserver?.unobserve(node);
}

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => observeReveal(ref.current), []);

  return ref;
}

export function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const ref = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
