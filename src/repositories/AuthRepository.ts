import type {
  AuthChangeEvent,
  Session,
} from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export class AuthRepository {
  async signIn(email: string, password: string) {
    return supabase.auth.signInWithPassword({
      email,
      password,
    })
  }

  async signUp(
    email: string,
    password: string,
    displayName: string,
  ) {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    })
  }

  async signOut() {
    return supabase.auth.signOut()
  }

  async getSession() {
    return supabase.auth.getSession()
  }

  async getUser() {
    return supabase.auth.getUser()
  }

  onAuthStateChange(
    callback: (
      event: AuthChangeEvent,
      session: Session | null,
    ) => void,
  ) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

export const authRepository = new AuthRepository()