import { useState } from 'react'
import './App.css'

import { AppLayout } from './components/AppLayout'
import { Home } from './pages/Home/Home'
import { Agenda } from './pages/Agenda/Agenda'
import { Mochila } from './pages/Mochila/Mochila'
import { Viagem } from './pages/Viagem/Viagem'
import { Financeiro } from './pages/Financeiro/Financeiro'
import { Orcamento } from './pages/Orcamento/Orcamento'

type Page =
  | 'home'
  | 'agenda'
  | 'mochila'
  | 'viagem'
  | 'financeiro'
  | 'orcamento'

export default function App() {
  const [page, setPage] = useState<Page>('home')

  return (
    <AppLayout page={page} onNavigate={setPage}>
      {page === 'home' && <Home />}
      {page === 'agenda' && <Agenda />}
      {page === 'mochila' && <Mochila />}
      {page === 'viagem' && <Viagem />}
      {page === 'financeiro' && <Financeiro />}
      {page === 'orcamento' && <Orcamento />}
    </AppLayout>
  )
}