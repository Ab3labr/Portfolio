type ArrowIconDirection = "up-right" | "down" | "clockwise"

type ArrowIconProps = {
  direction?: ArrowIconDirection
  className?: string
}

export default function ArrowIcon({
  direction = "up-right",
  className,
}: ArrowIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {direction === "up-right" ? (
        <path d="M6 18 18 6M8 6h10v10" />
      ) : direction === "down" ? (
        <path d="M12 4v16M5 13l7 7 7-7" />
      ) : (
        <>
          <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
        </>
      )}
    </svg>
  )
}
