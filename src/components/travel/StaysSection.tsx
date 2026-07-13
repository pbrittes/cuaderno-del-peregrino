import { useState } from 'react'

import {
  DeleteIcon,
  EditIcon,
  LodgingIcon,
  PlusIcon,
} from '../icons/AppIcons'
import { ConfirmDialog } from '../ui/ConfirmDialog'
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

  return new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR', {
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
  const [stayForm, setStayForm] =
    useState<Omit<Stay, 'id'>>(emptyStayForm)
  const [stayToDelete, setStayToDelete] = useState<Stay | null>(null)

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

  function handleConfirmRemoveStay() {
    if (!stayToDelete) return

    deleteStay(stayToDelete.id)
    setStayToDelete(null)
  }

  function updateStayField(
    field: keyof Omit<Stay, 'id'>,
    value: string,
  ) {
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
            <LodgingIcon size={30} />
            <span>Onde vamos dormir</span>
          </h3>
        </div>

        <button
          className="mission-add-button"
          onClick={handleOpenCreateStay}
          title="Adicionar hospedagem"
          aria-label="Adicionar hospedagem"
        >
          <PlusIcon size={20} strokeWidth={2} />
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
                  aria-label="Editar hospedagem"
                >
                  <EditIcon size={18} />
                </button>

                <button
                  onClick={() => setStayToDelete(stay)}
                  title="Excluir hospedagem"
                  aria-label="Excluir hospedagem"
                >
                  <DeleteIcon size={18} />
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

      <ConfirmDialog
        open={Boolean(stayToDelete)}
        title="Excluir hospedagem?"
        message={
          stayToDelete
            ? `A hospedagem "${stayToDelete.name}" será removida da viagem.`
            : ''
        }
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleConfirmRemoveStay}
        onCancel={() => setStayToDelete(null)}
      />
    </article>
  )
}