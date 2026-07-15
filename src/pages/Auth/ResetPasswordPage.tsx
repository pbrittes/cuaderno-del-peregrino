import { useState, type FormEvent } from 'react'

import { ShellLogo } from '../../components/ShellLogo'
import { useAuth } from '../../contexts/AuthContext'

import './AuthPage.css'

export function ResetPasswordPage() {
  const {
    updatePassword,
    finishPasswordRecovery,
    signOut,
  } = useAuth()

  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] =
    useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setMessage('')
    setErrorMessage('')

    if (password !== passwordConfirmation) {
      setErrorMessage('As senhas não coincidem.')
      return
    }

    try {
      setSubmitting(true)

      await updatePassword(password)

      setMessage('Senha alterada com sucesso.')
      setPassword('')
      setPasswordConfirmation('')
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Não foi possível alterar a senha.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  async function handleReturnToLogin() {
    await signOut()
    finishPasswordRecovery()
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <ShellLogo size={74} />

        <p className="auth-eyebrow">Edición VI</p>

        <h1>Cuaderno del Peregrino</h1>

        <p className="auth-subtitle">
          Definir nova senha
        </p>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <label>
            Nova senha
            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="new-password"
              minLength={6}
              required
            />
          </label>

          <label>
            Confirmar nova senha
            <input
              type="password"
              value={passwordConfirmation}
              onChange={(event) =>
                setPasswordConfirmation(
                  event.target.value,
                )
              }
              autoComplete="new-password"
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
              ? 'Salvando...'
              : 'Salvar nova senha'}
          </button>
        </form>

        {message && (
          <button
            className="auth-mode-button"
            type="button"
            onClick={() =>
              void handleReturnToLogin()
            }
          >
            Voltar para o login
          </button>
        )}
      </section>
    </main>
  )
}