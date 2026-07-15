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
import { useAuth } from '../contexts/AuthContext'

type Page =
  | 'home'
  | 'agenda'
  | 'mochila'
  | 'viagem'
  | 'financeiro'
  | 'orcamento'
  | 'expedicao'

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
    id: 'expedicao',
    label: 'Expedição',
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
  const { user, signOut } = useAuth()

  const displayName =
    user?.user_metadata?.display_name ??
    user?.email ??
    'Peregrina'

  async function handleSignOut() {
    try {
      await signOut()
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Não foi possível sair.',
      )
    }
  }

  function renderFooter() {
    return (
      <>
        <div className="sidebar-user">
          <strong>{displayName}</strong>

          <button
            type="button"
            className="sidebar-sign-out"
            onClick={() => void handleSignOut()}
          >
            Sair
          </button>
        </div>

        <small>Expedición Santiago 2026</small>
        <strong>Edición VI</strong>
        <span>Expedición Compartida</span>
      </>
    )
  }

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
            {renderFooter()}
          </div>
        </div>

        <footer className="sidebar-footer">
          {renderFooter()}
        </footer>
      </aside>

      <section className="app-content">
        {children}
      </section>
    </div>
  )
}