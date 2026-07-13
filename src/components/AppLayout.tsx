import type { ComponentType, ReactNode } from 'react'
import {
  AgendaIcon,
  BackpackIcon,
  BudgetIcon,
  FinanceIcon,
  HomeIcon,
  TravelIcon,
} from './icons/AppIcons'
import { ShellLogo } from './ShellLogo'

type Page =
  | 'home'
  | 'agenda'
  | 'mochila'
  | 'viagem'
  | 'financeiro'
  | 'orcamento'

type AppLayoutProps = {
  page: Page
  onNavigate: (page: Page) => void
  children: ReactNode
}

type MenuItem = {
  id: Page
  label: string
  icon: ComponentType<{
    size?: number
    className?: string
  }>
}

const menuItems: MenuItem[] = [
  {
    id: 'home',
    label: 'Cuaderno',
    icon: HomeIcon,
  },
  {
    id: 'agenda',
    label: 'Agenda',
    icon: AgendaIcon,
  },
  {
    id: 'mochila',
    label: 'Mochila',
    icon: BackpackIcon,
  },
  {
    id: 'viagem',
    label: 'Viagem',
    icon: TravelIcon,
  },
  {
    id: 'financeiro',
    label: 'Financeiro',
    icon: FinanceIcon,
  },
  {
    id: 'orcamento',
    label: 'Orçamento',
    icon: BudgetIcon,
  },
]

export function AppLayout({
  page,
  onNavigate,
  children,
}: AppLayoutProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="sidebar-brand">
            <ShellLogo size={42} />

            <div>
              <strong>Cuaderno</strong>
              <span>Santiago 2026</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            {menuItems.map((item) => {
              const Icon = item.icon

              return (
                <button
                  key={item.id}
                  className={page === item.id ? 'active' : ''}
                  onClick={() => onNavigate(item.id)}
                >
                  <span>
                    <Icon size={20} />
                  </span>

                  {item.label}
                </button>
              )
            })}
          </nav>

          <div className="sidebar-footer-mobile">
            <small>Expedición Santiago 2026</small>
            <strong>Edición V</strong>
            <span>Finanzas del Peregrino</span>
          </div>
        </div>

        <footer className="sidebar-footer">
          <small>Expedición Santiago 2026</small>
          <strong>Edición V</strong>
          <span>Finanzas del Peregrino</span>
        </footer>
      </aside>

      <section className="app-content">
        {children}
      </section>
    </div>
  )
}