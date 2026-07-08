import { useState } from 'react'
import type { Stay } from '../../data/viagemStore'

type StaysSectionProps = {
  stays: Stay[]
  addStay: (stay: Omit<Stay, 'id'>) => void
  updateStay: (stay: Stay) => void
  deleteStay: (stayId: string) => void
}

const emptyStayForm: Omit<Stay, 'id'> = {
  name: '',
  city: '',
  country: '',
  checkIn: '',
  checkOut: '',
  address: '',
  phone: '',
  email: '',
  site: '',
  notes: '',
}

function formatDate(date: string) {
  if (!date) return ''

  return new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function hasExtraStayInfo(stay: Stay) {
  return Boolean(
    stay.address ||
      stay.phone ||
      stay.email ||
      stay.site ||
      stay.notes,
  )
}

export function StaysSection({
  stays,
  addStay,
  updateStay,
  deleteStay,
}: StaysSectionProps) {
  const [showStayForm, setShowStayForm] = useState(false)
  const [editingStayId, setEditingStayId] = useState<string | null>(null)
  const [stayForm, setStayForm] = useState<Omit<Stay, 'id'>>(emptyStayForm)

  function resetStayForm() {
    setStayForm(emptyStayForm)
    setEditingStayId(null)
    setShowStayForm(false)
  }

  function handleOpenCreateStay() {
    setStayForm(emptyStayForm)
    setEditingStayId(null)
    setShowStayForm(true)
  }

  function handleOpenEditStay(stay: Stay) {
    setStayForm({
      name: stay.name,
      city: stay.city,
      country: stay.country,
      checkIn: stay.checkIn,
      checkOut: stay.checkOut,
      address: stay.address,
      phone: stay.phone,
      email: stay.email,
      site: stay.site,
      notes: stay.notes,
    })
    setEditingStayId(stay.id)
    setShowStayForm(true)
  }

  function handleSaveStay() {
    if (!stayForm.name.trim() || !stayForm.city.trim() || !stayForm.checkIn) {
      return
    }

    if (editingStayId) {
      updateStay({
        id: editingStayId,
        ...stayForm,
      })
    } else {
      addStay(stayForm)
    }

    resetStayForm()
  }

  function handleRemoveStay(stay: Stay) {
    const confirmed = window.confirm(`Excluir hospedagem ${stay.name}?`)

    if (confirmed) {
      deleteStay(stay.id)
    }
  }

  function updateStayField(field: keyof Omit<Stay, 'id'>, value: string) {
    setStayForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  return (
    <article className="viagem-card">
      <div className="viagem-card-header">
        <div>
          <p className="eyebrow">Hospedagens</p>
          <h3>
            <span>🏨</span>
            Onde vamos dormir
          </h3>
        </div>

        <button
          className="mission-add-button"
          onClick={handleOpenCreateStay}
        >
          +
        </button>
      </div>

      <p>
        Hotéis, albergues, cidades, datas de entrada e saída e contatos
        úteis.
      </p>

      {stays.length === 0 ? (
        <div className="viagem-empty-state">0 item cadastrado</div>
      ) : (
        <div className="viagem-list">
          {stays.map((stay) => (
            <article className="viagem-list-item" key={stay.id}>
              <div>
                <strong>{stay.name}</strong>

                <span>
                  {stay.city}
                  {stay.country ? ` · ${stay.country}` : ''}
                </span>

                <small>
                  Check-in: {formatDate(stay.checkIn)}
                  {stay.checkOut
                    ? ` · Check-out: ${formatDate(stay.checkOut)}`
                    : ''}
                </small>

                {hasExtraStayInfo(stay) && (
                  <small>
                    {stay.address ? `Endereço: ${stay.address}` : ''}
                    {stay.phone
                      ? `${stay.address ? ' · ' : ''}Telefone: ${stay.phone}`
                      : ''}
                    {stay.email
                      ? `${stay.address || stay.phone ? ' · ' : ''}E-mail: ${stay.email}`
                      : ''}
                    {stay.site
                      ? `${stay.address || stay.phone || stay.email ? ' · ' : ''}Site: ${stay.site}`
                      : ''}
                    {stay.notes
                      ? `${stay.address || stay.phone || stay.email || stay.site ? ' · ' : ''}${stay.notes}`
                      : ''}
                  </small>
                )}
              </div>

              <div className="viagem-item-actions">
                <button
                  onClick={() => handleOpenEditStay(stay)}
                  title="Editar hospedagem"
                >
                  ✏️
                </button>

                <button
                  onClick={() => handleRemoveStay(stay)}
                  title="Excluir hospedagem"
                >
                  🗑️
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {showStayForm && (
        <div className="viagem-form">
          <input
            value={stayForm.name}
            onChange={(event) =>
              updateStayField('name', event.target.value)
            }
            placeholder="Nome da hospedagem"
            autoFocus
          />

          <input
            value={stayForm.city}
            onChange={(event) =>
              updateStayField('city', event.target.value)
            }
            placeholder="Cidade"
          />

          <input
            value={stayForm.country}
            onChange={(event) =>
              updateStayField('country', event.target.value)
            }
            placeholder="País"
          />

          <label>
            Data de check-in
            <input
              type="date"
              value={stayForm.checkIn}
              onChange={(event) =>
                updateStayField('checkIn', event.target.value)
              }
            />
          </label>

          <label>
            Data de check-out
            <input
              type="date"
              value={stayForm.checkOut}
              onChange={(event) =>
                updateStayField('checkOut', event.target.value)
              }
            />
          </label>

          <input
            value={stayForm.address}
            onChange={(event) =>
              updateStayField('address', event.target.value)
            }
            placeholder="Endereço"
          />

          <input
            value={stayForm.phone}
            onChange={(event) =>
              updateStayField('phone', event.target.value)
            }
            placeholder="Telefone"
          />

          <input
            value={stayForm.email}
            onChange={(event) =>
              updateStayField('email', event.target.value)
            }
            placeholder="E-mail"
          />

          <input
            value={stayForm.site}
            onChange={(event) =>
              updateStayField('site', event.target.value)
            }
            placeholder="Site"
          />

          <textarea
            value={stayForm.notes}
            onChange={(event) =>
              updateStayField('notes', event.target.value)
            }
            placeholder="Observações, reserva, contato, horário de check-in..."
          />

          <div>
            <button onClick={handleSaveStay}>
              {editingStayId ? 'Salvar edição' : 'Salvar hospedagem'}
            </button>

            <button onClick={resetStayForm}>Cancelar</button>
          </div>
        </div>
      )}
    </article>
  )
}
