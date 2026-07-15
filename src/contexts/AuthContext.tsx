import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { authService } from '../services/AuthService'

type AuthContextValue = {
  session: Session | null
  user: User | null
  loading: boolean
  passwordRecovery: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  finishPasswordRecovery: () => void
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [passwordRecovery, setPasswordRecovery] =
    useState(false)

  useEffect(() => {
    let active = true

    async function loadSession() {
      try {
        const currentSession = await authService.getSession()

        if (active) {
          setSession(currentSession)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadSession()

    const {
      data: { subscription },
    } = authService.onAuthStateChange(
      (event, nextSession) => {
        setSession(nextSession)

        if (event === 'PASSWORD_RECOVERY') {
          setPasswordRecovery(true)
        }

        setLoading(false)
      },
    )

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      passwordRecovery,

      async signIn(email, password) {
        await authService.signIn(email, password)
      },

      async signUp(email, password, displayName) {
        await authService.signUp(email, password, displayName)
      },

      async resetPassword(email) {
        await authService.resetPassword(email)
      },

      async updatePassword(password) {
        await authService.updatePassword(password)
      },

      finishPasswordRecovery() {
        setPasswordRecovery(false)
      },

      async signOut() {
        await authService.signOut()
      },
    }),
    [loading, passwordRecovery, session],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.')
  }

  return context
}