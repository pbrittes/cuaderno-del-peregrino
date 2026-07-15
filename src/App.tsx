import { useState } from 'react'
import './App.css'

import { AppLayout } from './components/AppLayout'
import { useAuth } from './contexts/AuthContext'
import { useExpedition } from './contexts/ExpeditionContext'

import { AuthPage } from './pages/Auth/AuthPage'
import { Home } from './pages/Home/Home'
import { Agenda } from './pages/Agenda/Agenda'
import { Mochila } from './pages/Mochila/Mochila'
import { Viagem } from './pages/Viagem/Viagem'
import { Financeiro } from './pages/Financeiro/Financeiro'
import { Orcamento } from './pages/Orcamento/Orcamento'
import { Expedicao } from './pages/Expedicao/Expedicao'

type Page =
  | 'home'
  | 'agenda'
  | 'mochila'
  | 'viagem'
  | 'financeiro'
  | 'orcamento'
  | 'expedicao'

export default function App() {
  const { user, loading: authLoading } = useAuth()

  const {
    expedition,
    loading: expeditionLoading,
  } = useExpedition()

  const [page, setPage] = useState<Page>('home')

  if (authLoading) {
    return null
  }

  if (!user) {
    return <AuthPage />
  }

  if (expeditionLoading || !expedition) {
    return null
  }

  return (
    <AppLayout page={page} onNavigate={setPage}>
      {page === 'home' && <Home />}
      {page === 'agenda' && <Agenda />}
      {page === 'mochila' && <Mochila />}
      {page === 'viagem' && <Viagem />}
      {page === 'financeiro' && <Financeiro />}
      {page === 'orcamento' && <Orcamento />}
      {page === 'expedicao' && <Expedicao />}
    </AppLayout>
  )
}