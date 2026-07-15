import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import type { Expedition } from '../types/database'
import { useAuth } from './AuthContext'
import { expeditionService } from '../services/ExpeditionService'

type ExpeditionContextValue = {
  expedition: Expedition | null
  loading: boolean
  reload: () => Promise<void>
}

const ExpeditionContext =
  createContext<ExpeditionContextValue | null>(null)

type ExpeditionProviderProps = {
  children: ReactNode
}

export function ExpeditionProvider({
  children,
}: ExpeditionProviderProps) {
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)

  const [expedition, setExpedition] =
    useState<Expedition | null>(null)

  async function loadExpedition() {
    if (!user) {
      setExpedition(null)
      setLoading(false)
      return
    }

    setLoading(true)

    let current =
      await expeditionService.getCurrent(user.id)

    if (!current) {
      current =
        await expeditionService.createDefault(
          user.id,
        )
    }

    setExpedition(current)
    setLoading(false)
  }

  useEffect(() => {
    void loadExpedition()
  }, [user])

  const value = useMemo(
    () => ({
      expedition,
      loading,
      reload: loadExpedition,
    }),
    [expedition, loading],
  )

  return (
    <ExpeditionContext.Provider value={value}>
      {children}
    </ExpeditionContext.Provider>
  )
}

export function useExpedition() {
  const context =
    useContext(ExpeditionContext)

  if (!context) {
    throw new Error(
      'useExpedition deve ser usado dentro de ExpeditionProvider.',
    )
  }

  return context
}