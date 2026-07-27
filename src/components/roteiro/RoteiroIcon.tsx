type RoteiroIconProps = {
  size?: number
  className?: string
}

export function RoteiroIcon({
  size = 20,
  className,
}: RoteiroIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="18" r="2" />
      <path d="M8 6h4a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3H9a3 3 0 0 0-3 3v1" />
      <path d="m15.5 15.5 2.5 2.5 2.5-2.5" />
    </svg>
  )
}
