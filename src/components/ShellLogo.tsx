type ShellLogoProps = {
  size?: number
}

export function ShellLogo({ size = 96 }: ShellLogoProps) {
  return (
    <span
      role="img"
      aria-label="Logotipo Cuaderno del Peregrino"
      className="shell-logo"
      style={{
        width: size,
        height: size,
        display: 'inline-block',
        flexShrink: 0,
        backgroundColor: 'currentColor',
        WebkitMaskImage: 'url("/logo.svg")',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        WebkitMaskSize: 'contain',
        maskImage: 'url("/logo.svg")',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        maskSize: 'contain',
      }}
    />
  )
}