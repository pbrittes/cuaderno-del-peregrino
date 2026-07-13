import { useState } from 'react'

import {
  DeleteIcon,
  EditIcon,
  PlusIcon,
  TravelIcon,
} from '../icons/AppIcons'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import type { Flight } from '../../data/viagemStore'

type FlightsSectionProps = {
  flights: Flight[]
  addFlight: (flight: Omit<Flight, 'id'>) => void
  updateFlight: (flight: Flight) => void
  deleteFlight: (flightId: string) => void
}

const emptyFlightForm: Omit<Flight, 'id'> = {
  airline: '',
  flightNumber: '',
  origin: '',
  destination: '',
  departureDate: '',
  boardingTime: '',
  arrivalAtBoardingTime: '',
  arrivalTime: '',
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

function hasExtraFlightInfo(flight: Flight) {
  return Boolean(
    flight.arrivalAtBoardingTime ||
      flight.arrivalTime ||
      flight.notes,
  )
}

export function FlightsSection({
  flights,
  addFlight,
  updateFlight,
  deleteFlight,
}: FlightsSectionProps) {
  const [showFlightForm, setShowFlightForm] = useState(false)
  const [editingFlightId, setEditingFlightId] = useState<string | null>(null)
  const [flightForm, setFlightForm] =
    useState<Omit<Flight, 'id'>>(emptyFlightForm)
  const [flightToDelete, setFlightToDelete] = useState<Flight | null>(null)

  function resetFlightForm() {
    setFlightForm(emptyFlightForm)
    setEditingFlightId(null)
    setShowFlightForm(false)
  }

  function handleOpenCreateFlight() {
    setFlightForm(emptyFlightForm)
    setEditingFlightId(null)
    setShowFlightForm(true)
  }

  function handleOpenEditFlight(flight: Flight) {
    setFlightForm({
      airline: flight.airline,
      flightNumber: flight.flightNumber,
      origin: flight.origin,
      destination: flight.destination,
      departureDate: flight.departureDate,
      boardingTime: flight.boardingTime,
      arrivalAtBoardingTime: flight.arrivalAtBoardingTime,
      arrivalTime: flight.arrivalTime,
      notes: flight.notes,
    })
    setEditingFlightId(flight.id)
    setShowFlightForm(true)
  }

  function handleSaveFlight() {
    if (
      !flightForm.airline.trim() ||
      !flightForm.origin.trim() ||
      !flightForm.destination.trim() ||
      !flightForm.departureDate
    ) {
      return
    }

    if (editingFlightId) {
      updateFlight({
        id: editingFlightId,
        ...flightForm,
      })
    } else {
      addFlight(flightForm)
    }

    resetFlightForm()
  }

  function handleConfirmRemoveFlight() {
    if (!flightToDelete) return

    deleteFlight(flightToDelete.id)
    setFlightToDelete(null)
  }

  function updateFlightField(
    field: keyof Omit<Flight, 'id'>,
    value: string,
  ) {
    setFlightForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  return (
    <article className="viagem-card">
      <div className="viagem-card-header">
        <div>
          <p className="eyebrow">Voos</p>

          <h3>
            <TravelIcon size={22} />
            <span>Trechos aéreos</span>
          </h3>
        </div>

        <button
          className="mission-add-button"
          onClick={handleOpenCreateFlight}
          title="Adicionar voo"
          aria-label="Adicionar voo"
        >
          <PlusIcon size={20} strokeWidth={2} />
        </button>
      </div>

      <p>
        Companhias, horários, origem, destino e informações importantes do
        embarque.
      </p>

      {flights.length === 0 ? (
        <div className="viagem-empty-state">0 item cadastrado</div>
      ) : (
        <div className="viagem-list">
          {flights.map((flight) => (
            <article className="viagem-list-item" key={flight.id}>
              <div>
                <strong>
                  {flight.origin} → {flight.destination}
                </strong>

                <span>
                  Companhia: {flight.airline}
                  {flight.flightNumber
                    ? ` · Voo ${flight.flightNumber}`
                    : ''}
                </span>

                <small>
                  Data: {formatDate(flight.departureDate)}
                  {flight.boardingTime
                    ? ` · Embarque: ${flight.boardingTime}`
                    : ''}
                </small>

                {hasExtraFlightInfo(flight) && (
                  <small>
                    {flight.arrivalAtBoardingTime
                      ? `Chegar ao aeroporto: ${flight.arrivalAtBoardingTime}`
                      : ''}
                    {flight.arrivalTime
                      ? `${flight.arrivalAtBoardingTime ? ' · ' : ''}Chegada: ${flight.arrivalTime}`
                      : ''}
                    {flight.notes
                      ? `${flight.arrivalAtBoardingTime || flight.arrivalTime ? ' · ' : ''}${flight.notes}`
                      : ''}
                  </small>
                )}
              </div>

              <div className="viagem-item-actions">
                <button
                  onClick={() => handleOpenEditFlight(flight)}
                  title="Editar voo"
                  aria-label="Editar voo"
                >
                  <EditIcon size={18} />
                </button>

                <button
                  onClick={() => setFlightToDelete(flight)}
                  title="Excluir voo"
                  aria-label="Excluir voo"
                >
                  <DeleteIcon size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {showFlightForm && (
        <div className="viagem-form">
          <input
            value={flightForm.airline}
            onChange={(event) =>
              updateFlightField('airline', event.target.value)
            }
            placeholder="Companhia aérea"
            autoFocus
          />

          <input
            value={flightForm.flightNumber}
            onChange={(event) =>
              updateFlightField('flightNumber', event.target.value)
            }
            placeholder="Número do voo"
          />

          <input
            value={flightForm.origin}
            onChange={(event) =>
              updateFlightField('origin', event.target.value)
            }
            placeholder="Origem"
          />

          <input
            value={flightForm.destination}
            onChange={(event) =>
              updateFlightField('destination', event.target.value)
            }
            placeholder="Destino"
          />

          <label>
            Data do voo
            <input
              type="date"
              value={flightForm.departureDate}
              onChange={(event) =>
                updateFlightField('departureDate', event.target.value)
              }
            />
          </label>

          <label>
            Horário de embarque
            <input
              type="time"
              value={flightForm.boardingTime}
              onChange={(event) =>
                updateFlightField('boardingTime', event.target.value)
              }
            />
          </label>

          <label>
            Chegar ao aeroporto às
            <input
              type="time"
              value={flightForm.arrivalAtBoardingTime}
              onChange={(event) =>
                updateFlightField(
                  'arrivalAtBoardingTime',
                  event.target.value,
                )
              }
            />
          </label>

          <label>
            Horário de chegada ao destino
            <input
              type="time"
              value={flightForm.arrivalTime}
              onChange={(event) =>
                updateFlightField('arrivalTime', event.target.value)
              }
            />
          </label>

          <textarea
            value={flightForm.notes}
            onChange={(event) =>
              updateFlightField('notes', event.target.value)
            }
            placeholder="Observações, localizador, bagagem, conexão..."
          />

          <div>
            <button onClick={handleSaveFlight}>
              {editingFlightId ? 'Salvar edição' : 'Salvar voo'}
            </button>

            <button onClick={resetFlightForm}>Cancelar</button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(flightToDelete)}
        title="Excluir voo?"
        message={
          flightToDelete
            ? `O voo ${
                flightToDelete.flightNumber || flightToDelete.airline
              } será removido da viagem.`
            : ''
        }
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleConfirmRemoveFlight}
        onCancel={() => setFlightToDelete(null)}
      />
    </article>
  )
}