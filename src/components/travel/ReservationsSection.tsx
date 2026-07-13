import { useState } from 'react'

import {
  DeleteIcon,
  EditIcon,
  PlusIcon,
  TicketIcon,
} from '../icons/AppIcons'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import type { Reservation } from '../../data/viagemStore'

type ReservationsSectionProps = {
  reservations: Reservation[]
  addReservation: (reservation: Omit<Reservation, 'id'>) => void
  updateReservation: (reservation: Reservation) => void
  deleteReservation: (reservationId: string) => void
}

const emptyReservationForm: Omit<Reservation, 'id'> = {
  title: '',
  category: '',
  date: '',
  city: '',
  locator: '',
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

function hasExtraReservationInfo(reservation: Reservation) {
  return Boolean(
    reservation.locator ||
      reservation.site ||
      reservation.notes,
  )
}

export function ReservationsSection({
  reservations,
  addReservation,
  updateReservation,
  deleteReservation,
}: ReservationsSectionProps) {
  const [showReservationForm, setShowReservationForm] = useState(false)
  const [editingReservationId, setEditingReservationId] = useState<
    string | null
  >(null)
  const [reservationForm, setReservationForm] =
    useState<Omit<Reservation, 'id'>>(emptyReservationForm)
  const [reservationToDelete, setReservationToDelete] =
    useState<Reservation | null>(null)

  function resetReservationForm() {
    setReservationForm(emptyReservationForm)
    setEditingReservationId(null)
    setShowReservationForm(false)
  }

  function handleOpenCreateReservation() {
    setReservationForm(emptyReservationForm)
    setEditingReservationId(null)
    setShowReservationForm(true)
  }

  function handleOpenEditReservation(reservation: Reservation) {
    setReservationForm({
      title: reservation.title,
      category: reservation.category,
      date: reservation.date,
      city: reservation.city,
      locator: reservation.locator,
      site: reservation.site,
      notes: reservation.notes,
    })
    setEditingReservationId(reservation.id)
    setShowReservationForm(true)
  }

  function handleSaveReservation() {
    if (
      !reservationForm.title.trim() ||
      !reservationForm.category.trim() ||
      !reservationForm.date
    ) {
      return
    }

    if (editingReservationId) {
      updateReservation({
        id: editingReservationId,
        ...reservationForm,
      })
    } else {
      addReservation(reservationForm)
    }

    resetReservationForm()
  }

  function handleConfirmRemoveReservation() {
    if (!reservationToDelete) return

    deleteReservation(reservationToDelete.id)
    setReservationToDelete(null)
  }

  function updateReservationField(
    field: keyof Omit<Reservation, 'id'>,
    value: string,
  ) {
    setReservationForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  return (
    <article className="viagem-card">
      <div className="viagem-card-header">
        <div>
          <p className="eyebrow">Reservas</p>

          <h3>
            <TicketIcon size={30} />
            <span>Reservas e compromissos</span>
          </h3>
        </div>

        <button
          className="mission-add-button"
          onClick={handleOpenCreateReservation}
          title="Adicionar reserva"
          aria-label="Adicionar reserva"
        >
          <PlusIcon size={20} strokeWidth={2} />
        </button>
      </div>

      <p>
        Passeios, restaurantes, eventos e reservas pontuais fora da hospedagem.
      </p>

      {reservations.length === 0 ? (
        <div className="viagem-empty-state">0 item cadastrado</div>
      ) : (
        <div className="viagem-list">
          {reservations.map((reservation) => (
            <article className="viagem-list-item" key={reservation.id}>
              <div>
                <strong>{reservation.title}</strong>

                <span>
                  Categoria: {reservation.category}
                  {reservation.city ? ` · ${reservation.city}` : ''}
                </span>

                <small>Data: {formatDate(reservation.date)}</small>

                {hasExtraReservationInfo(reservation) && (
                  <small>
                    {reservation.locator
                      ? `Localizador: ${reservation.locator}`
                      : ''}
                    {reservation.site
                      ? `${reservation.locator ? ' · ' : ''}Site: ${reservation.site}`
                      : ''}
                    {reservation.notes
                      ? `${reservation.locator || reservation.site ? ' · ' : ''}${reservation.notes}`
                      : ''}
                  </small>
                )}
              </div>

              <div className="viagem-item-actions">
                <button
                  onClick={() => handleOpenEditReservation(reservation)}
                  title="Editar reserva"
                  aria-label="Editar reserva"
                >
                  <EditIcon size={18} />
                </button>

                <button
                  onClick={() => setReservationToDelete(reservation)}
                  title="Excluir reserva"
                  aria-label="Excluir reserva"
                >
                  <DeleteIcon size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {showReservationForm && (
        <div className="viagem-form">
          <input
            value={reservationForm.title}
            onChange={(event) =>
              updateReservationField('title', event.target.value)
            }
            placeholder="Reserva: passeio, restaurante, evento..."
            autoFocus
          />

          <input
            value={reservationForm.category}
            onChange={(event) =>
              updateReservationField('category', event.target.value)
            }
            placeholder="Categoria"
          />

          <label>
            Data da reserva
            <input
              type="date"
              value={reservationForm.date}
              onChange={(event) =>
                updateReservationField('date', event.target.value)
              }
            />
          </label>

          <input
            value={reservationForm.city}
            onChange={(event) =>
              updateReservationField('city', event.target.value)
            }
            placeholder="Cidade"
          />

          <input
            value={reservationForm.locator}
            onChange={(event) =>
              updateReservationField('locator', event.target.value)
            }
            placeholder="Localizador"
          />

          <input
            value={reservationForm.site}
            onChange={(event) =>
              updateReservationField('site', event.target.value)
            }
            placeholder="Site ou link da reserva"
          />

          <textarea
            value={reservationForm.notes}
            onChange={(event) =>
              updateReservationField('notes', event.target.value)
            }
            placeholder="Observações, horário, endereço, instruções..."
          />

          <div>
            <button onClick={handleSaveReservation}>
              {editingReservationId ? 'Salvar edição' : 'Salvar reserva'}
            </button>

            <button onClick={resetReservationForm}>Cancelar</button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(reservationToDelete)}
        title="Excluir reserva?"
        message={
          reservationToDelete
            ? `A reserva "${reservationToDelete.title}" será removida da viagem.`
            : ''
        }
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleConfirmRemoveReservation}
        onCancel={() => setReservationToDelete(null)}
      />
    </article>
  )
}