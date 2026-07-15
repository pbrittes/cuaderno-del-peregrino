import { useEffect, useState } from 'react'

import type { ExpeditionMember } from '../../types/database'

import { expeditionService } from '../../services/ExpeditionService'
import { useExpedition } from '../../contexts/ExpeditionContext'
import { useAuth } from '../../contexts/AuthContext'

import './Expedicao.css'

export function Expedicao() {
  const { expedition } = useExpedition()
  const { user } = useAuth()

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [removingUserId, setRemovingUserId] =
    useState<string | null>(null)
  const [members, setMembers] = useState<ExpeditionMember[]>([])

  const isOwner =
    Boolean(expedition && user) &&
    expedition?.created_by === user?.id

  async function loadMembers() {
    if (!expedition) return

    try {
      const data = await expeditionService.getMembers(
        expedition.id,
      )

      setMembers(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    void loadMembers()
  }, [expedition])

  async function handleAddMember() {
    if (!expedition || !email.trim()) return

    try {
      setLoading(true)

      await expeditionService.addMemberByEmail(
        expedition.id,
        email.trim(),
      )

      await loadMembers()

      setEmail('')

      alert('Participante adicionado com sucesso.')
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('Não foi possível adicionar o participante.')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleRemoveMember(
    member: ExpeditionMember,
  ) {
    if (!expedition || member.role === 'owner') return

    const memberName =
      member.profile?.display_name ?? 'este participante'

    const confirmed = window.confirm(
      `Remover ${memberName} da expedição?`,
    )

    if (!confirmed) return

    try {
      setRemovingUserId(member.user_id)

      await expeditionService.removeMember(
        expedition.id,
        member.user_id,
      )

      await loadMembers()
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('Não foi possível remover o participante.')
      }
    } finally {
      setRemovingUserId(null)
    }
  }

  return (
    <div className="expedicao-page">
      <header className="expedicao-header">
        <p className="eyebrow">Edición VI</p>

        <h2>Expedição</h2>

        <p>
          Gerencie os participantes da Expedição Santiago 2026.
        </p>
      </header>

      <section className="expedicao-card">
        <div className="expedicao-title">
          <h3>{expedition?.name}</h3>
        </div>

        {isOwner && (
          <div className="expedicao-form">
            <input
              type="email"
              placeholder="E-mail do participante"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
            />

            <button
              onClick={handleAddMember}
              disabled={loading || !email.trim()}
            >
              {loading
                ? 'Adicionando...'
                : 'Adicionar'}
            </button>
          </div>
        )}

        <div className="members-list">
          {members.map((member) => (
            <div
              key={member.user_id}
              className="member-row"
            >
              <div className="member-main">
                <div className="member-name">
                  {member.profile?.display_name ??
                    member.user_id}
                </div>
              </div>

              <div className="member-actions">
                <span
                  className={
                    member.role === 'owner'
                      ? 'owner-badge'
                      : 'member-badge'
                  }
                >
                  {member.role === 'owner'
                    ? 'Owner'
                    : 'Membro'}
                </span>

                {isOwner && member.role !== 'owner' && (
                  <button
                    type="button"
                    className="member-remove-button"
                    onClick={() =>
                      void handleRemoveMember(member)
                    }
                    disabled={
                      removingUserId === member.user_id
                    }
                  >
                    {removingUserId === member.user_id
                      ? 'Removendo...'
                      : 'Remover'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}