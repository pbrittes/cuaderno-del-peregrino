import { useState } from 'react'
import './App.css'

import { AppLayout } from './components/AppLayout'
import { Home } from './pages/Home/Home'
import { Agenda } from './pages/Agenda/Agenda'
import { Mochila } from './pages/Mochila/Mochila'

type Page = 'home' | 'agenda' | 'mochila'

export default function App() {
  const [page, setPage] = useState<Page>('home')

  return (
    <AppLayout page={page} onNavigate={setPage}>
      {page === 'home' && <Home />}
      {page === 'agenda' && <Agenda />}
      {page === 'mochila' && <Mochila />}
    </AppLayout>
  )
}