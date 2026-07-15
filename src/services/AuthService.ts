import type { Session, User } from '@supabase/supabase-js'
import { authRepository } from '../repositories'

export class AuthService {
  async signIn(email: string, password: string) {
    const { data, error } = await authRepository.signIn(
      email,
      password,
    )

    if (error) throw error

    return data
  }

  async signUp(
    email: string,
    password: string,
    displayName: string,
  ) {
    const { data, error } = await authRepository.signUp(
      email,
      password,
      displayName,
    )

    if (error) throw error

    return data
  }

  async signOut() {
    const { error } = await authRepository.signOut()

    if (error) throw error
  }

  async getSession(): Promise<Session | null> {
    const { data, error } =
      await authRepository.getSession()

    if (error) throw error

    return data.session
  }

  async getUser(): Promise<User | null> {
    const { data, error } =
      await authRepository.getUser()

    if (error) throw error

    return data.user
  }

  onAuthStateChange(
    callback: (
      session: Session | null,
    ) => void,
  ) {
    return authRepository.onAuthStateChange(
      (_event, session) => {
        callback(session)
      },
    )
  }
}

export const authService = new AuthService()