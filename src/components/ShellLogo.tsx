type ShellLogoProps = {
  size?: number
}

export function ShellLogo({ size = 96 }: ShellLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label="Concha do Caminho de Santiago"
      className="shell-logo"
    >
      <circle cx="60" cy="92" r="5" fill="var(--color-santiago-red)" />

      <path
        d="M60 92 L18 28"
        stroke="var(--color-santiago-red)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M60 92 L32 20"
        stroke="var(--color-santiago-red)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M60 92 L46 15"
        stroke="var(--color-santiago-red)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M60 92 L60 12"
        stroke="var(--color-santiago-red)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M60 92 L74 15"
        stroke="var(--color-santiago-red)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M60 92 L88 20"
        stroke="var(--color-santiago-red)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M60 92 L102 28"
        stroke="var(--color-santiago-red)"
        strokeWidth="5"
        strokeLinecap="round"
      />

      <path
        d="M18 28 C30 12, 90 12, 102 28"
        fill="none"
        stroke="var(--color-santiago-red)"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  )
}