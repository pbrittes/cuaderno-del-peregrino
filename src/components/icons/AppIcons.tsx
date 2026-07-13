type IconProps = {
  size?: number
  className?: string
  strokeWidth?: number
}

function iconProps({
  size = 20,
  className,
  strokeWidth = 1.8,
}: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
    'aria-hidden': true,
  }
}

export function HomeIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M3.5 10.5 12 3.5l8.5 7" />
      <path d="M5.5 9.5V20h13V9.5" />
      <path d="M9.5 20v-6h5v6" />
    </svg>
  )
}

export function AgendaIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <rect x="4" y="5.5" width="16" height="14.5" rx="2" />
      <path d="M8 3.5v4" />
      <path d="M16 3.5v4" />
      <path d="M4 9.5h16" />
      <path d="M8 13h3" />
      <path d="M8 16h6" />
    </svg>
  )
}

export function BackpackIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M8 7V5.5a4 4 0 0 1 8 0V7" />
      <path d="M7 7h10a3 3 0 0 1 3 3v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-9a3 3 0 0 1 3-3Z" />
      <path d="M8 13h8v5H8z" />
      <path d="M4 12H2.5v5H4" />
      <path d="M20 12h1.5v5H20" />
    </svg>
  )
}

export function TravelIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="m21 16-8-3V5.5a1.5 1.5 0 0 0-3 0V13l-7 3v2l7-1.5V20l-2 1v1l3.5-.5L15 22v-1l-2-1v-3.5l8 1.5Z" />
    </svg>
  )
}

export function FinanceIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <rect x="3" y="6" width="18" height="13" rx="2.5" />
      <path d="M3 10h18" />
      <path d="M16 14.5h2" />
      <path d="M7 15.5h4" />
    </svg>
  )
}

export function BudgetIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M6 4h12a2 2 0 0 1 2 2v14H4V6a2 2 0 0 1 2-2Z" />
      <path d="M8 8h8" />
      <path d="M8 12h3" />
      <path d="M8 16h3" />
      <path d="M15 12h1.5a1.5 1.5 0 0 1 0 3H15" />
      <path d="M15.75 10.5v6" />
    </svg>
  )
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}

export function EditIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M4 20h4l11-11a2.8 2.8 0 0 0-4-4L4 16v4Z" />
      <path d="m13.5 6.5 4 4" />
    </svg>
  )
}

export function DeleteIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="m6 7 1 13h10l1-13" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </svg>
  )
}

export function TrainingIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <ellipse cx="8" cy="15.5" rx="2.6" ry="4" transform="rotate(-24 8 15.5)" />
      <ellipse cx="16" cy="8.5" rx="2.6" ry="4" transform="rotate(-24 16 8.5)" />
      <circle cx="5.2" cy="10.5" r=".8" fill="currentColor" stroke="none" />
      <circle cx="7" cy="9.3" r=".75" fill="currentColor" stroke="none" />
      <circle cx="9" cy="9" r=".7" fill="currentColor" stroke="none" />
      <circle cx="13.2" cy="3.5" r=".8" fill="currentColor" stroke="none" />
      <circle cx="15" cy="2.7" r=".75" fill="currentColor" stroke="none" />
      <circle cx="17" cy="2.8" r=".7" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function MusicIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M9 18V6l10-2v12" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="16" cy="16" r="3" />
    </svg>
  )
}

export function LectureIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5Z" />
      <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5Z" />
    </svg>
  )
}

export function BlockIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

export function TaskIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="m8 12 2.5 2.5L16 9" />
    </svg>
  )
}

export function FreeIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="m12 3 1.2 4.2L17 9l-3.8 1.8L12 15l-1.2-4.2L7 9l3.8-1.8Z" />
      <path d="m18.5 14 .7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7Z" />
      <path d="m5 14 .6 2 2 .6-2 .6-.6 2-.6-2-2-.6 2-.6Z" />
    </svg>
  )
}

export function FoodIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M6 3v8" />
      <path d="M3.5 3v4.5A2.5 2.5 0 0 0 6 10" />
      <path d="M8.5 3v4.5A2.5 2.5 0 0 1 6 10" />
      <path d="M6 10v11" />
      <path d="M16 3v18" />
      <path d="M16 3c3 2 4.5 5 4.5 8H16" />
    </svg>
  )
}

export function LodgingIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M4 19V8" />
      <path d="M20 19v-7a3 3 0 0 0-3-3H9" />
      <path d="M4 13h16" />
      <path d="M7 9h3a2 2 0 0 1 2 2v2H5v-2a2 2 0 0 1 2-2Z" />
    </svg>
  )
}

export function TransportIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <rect x="5" y="3" width="14" height="15" rx="3" />
      <path d="M8 7h8" />
      <path d="M7 13h10" />
      <path d="M8 18l-2 3" />
      <path d="M16 18l2 3" />
      <circle cx="9" cy="15" r=".8" fill="currentColor" stroke="none" />
      <circle cx="15" cy="15" r=".8" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function TicketIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M4 7h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4Z" />
      <path d="M12 7v2" />
      <path d="M12 11v2" />
      <path d="M12 15v2" />
    </svg>
  )
}

export function PharmacyIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <rect x="4" y="6" width="16" height="14" rx="3" />
      <path d="M9 6V4h6v2" />
      <path d="M12 10v6" />
      <path d="M9 13h6" />
    </svg>
  )
}

export function MarketIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M6 8h12l1 12H5Z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </svg>
  )
}

export function LeisureIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="m12 3 2.2 4.8L19 10l-3.5 3.5.8 5L12 16l-4.3 2.5.8-5L5 10l4.8-2.2Z" />
    </svg>
  )
}

export function MoreIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function ShoppingCartIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L20.5 8H6" />
      <circle cx="10" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
    </svg>
  )
}

export function BootIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M9 3h6" />
      <path d="M10 3v7.5l-4.2 6.8A2.4 2.4 0 0 0 7.8 21h8.4a2.4 2.4 0 0 0 2-3.7L14 10.5V3" />
      <path d="M8 16h8" />
      <path d="M9.5 13.5h5" />
    </svg>
  )
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.5 2.5L16.5 8.5" />
    </svg>
  )
}

export function DocumentIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M6 3h8l4 4v14H6Z" />
      <path d="M14 3v5h5" />
      <path d="M9 12h6" />
      <path d="M9 16h6" />
    </svg>
  )
}