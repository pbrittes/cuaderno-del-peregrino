import { useState } from 'react'
import './App.css'
import { AppLayout } from './components/AppLayout'
import { Home } from './pages/Home/Home'
import { Agenda } from './pages/Agenda/Agenda'

type Page = 'home' | 'agenda'

function App() {
  const [page, setPage] = useState<Page>('home')

  return (
    <AppLayout page={page} onNavigate={setPage}>
      {page === 'home' && <Home />}
      {page === 'agenda' && <Agenda />}
    </AppLayout>
  )
}

export default App