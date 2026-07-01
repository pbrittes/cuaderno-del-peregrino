import type { ReactNode } from 'react'
import { ShellLogo } from './ShellLogo'

type Page = 'home' | 'agenda' | 'mochila'

type AppLayoutProps = {
  page: Page
  onNavigate: (page: Page) => void
  children: ReactNode
}

const menuItems = [
  { id: 'home', label: 'Cuaderno', icon: '⌂' },
  { id: 'agenda', label: 'Agenda', icon: '◷' },
  { id: 'mochila', label: 'Mochila', icon: '🎒' },
] as const

export function AppLayout({ page, onNavigate, children }: AppLayoutProps) {
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
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={page === item.id ? 'active' : ''}
                onClick={() => onNavigate(item.id)}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <footer className="sidebar-footer">
          <small>Expedición Santiago 2026</small>
          <strong>Edición I</strong>
          <span>El Primer Paso</span>
        </footer>
      </aside>

      <section className="app-content">{children}</section>
    </div>
  )
}