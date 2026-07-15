import { useState, type FormEvent } from 'react'
import { ShellLogo } from '../../components/ShellLogo'
import { useAuth } from '../../contexts/AuthContext'
import './AuthPage.css'

type AuthMode = 'sign-in' | 'sign-up'

export function AuthPage() {
  const { signIn, signUp } = useAuth()

  const [mode, setMode] = useState<AuthMode>('sign-in')
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const isSignUp = mode === 'sign-up'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setMessage('')
    setErrorMessage('')
    setSubmitting(true)

    try {
      if (isSignUp) {
        await signUp(email.trim(), password, displayName.trim())

        setMessage(
          'Conta criada. Confira seu e-mail para confirmar o cadastro antes de entrar.',
        )
        setMode('sign-in')
        setPassword('')
      } else {
        await signIn(email.trim(), password)
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Não foi possível concluir o acesso.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode)
    setMessage('')
    setErrorMessage('')
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <ShellLogo size={74} />

        <p className="auth-eyebrow">Edición VI</p>

        <h1>Cuaderno del Peregrino</h1>

        <p className="auth-subtitle">Expedición Compartida</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignUp && (
            <label>
              Nome
              <input
                type="text"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                autoComplete="name"
                required
              />
            </label>
          )}

          <label>
            E-mail
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              minLength={6}
              required
            />
          </label>

          {errorMessage && (
            <p className="auth-feedback auth-feedback-error">
              {errorMessage}
            </p>
          )}

          {message && (
            <p className="auth-feedback auth-feedback-success">
              {message}
            </p>
          )}

          <button
            className="auth-submit-button"
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? 'Aguarde...'
              : isSignUp
                ? 'Criar conta'
                : 'Entrar'}
          </button>
        </form>

        <button
          className="auth-mode-button"
          type="button"
          onClick={() =>
            changeMode(isSignUp ? 'sign-in' : 'sign-up')
          }
        >
          {isSignUp
            ? 'Já tenho uma conta'
            : 'Criar minha conta'}
        </button>
      </section>
    </main>
  )
}