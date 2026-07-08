import { useState } from 'react'
import type { Transfer } from '../../data/viagemStore'

type TransfersSectionProps = {
  transfers: Transfer[]
  addTransfer: (transfer: Omit<Transfer, 'id'>) => void
  updateTransfer: (transfer: Transfer) => void
  deleteTransfer: (transferId: string) => void
}

const emptyTransferForm: Omit<Transfer, 'id'> = {
  type: '',
  company: '',
  origin: '',
  destination: '',
  departureDate: '',
  departureTime: '',
  arrivalTime: '',
  locator: '',
  ticketUrl: '',
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

function hasExtraTransferInfo(transfer: Transfer) {
  return Boolean(
    transfer.locator ||
      transfer.ticketUrl ||
      transfer.notes,
  )
}

export function TransfersSection({
  transfers,
  addTransfer,
  updateTransfer,
  deleteTransfer,
}: TransfersSectionProps) {
  const [showTransferForm, setShowTransferForm] = useState(false)
  const [editingTransferId, setEditingTransferId] = useState<string | null>(
    null,
  )
  const [transferForm, setTransferForm] =
    useState<Omit<Transfer, 'id'>>(emptyTransferForm)

  function resetTransferForm() {
    setTransferForm(emptyTransferForm)
    setEditingTransferId(null)
    setShowTransferForm(false)
  }

  function handleOpenCreateTransfer() {
    setTransferForm(emptyTransferForm)
    setEditingTransferId(null)
    setShowTransferForm(true)
  }

  function handleOpenEditTransfer(transfer: Transfer) {
    setTransferForm({
      type: transfer.type,
      company: transfer.company,
      origin: transfer.origin,
      destination: transfer.destination,
      departureDate: transfer.departureDate,
      departureTime: transfer.departureTime,
      arrivalTime: transfer.arrivalTime,
      locator: transfer.locator,
      ticketUrl: transfer.ticketUrl,
      notes: transfer.notes,
    })
    setEditingTransferId(transfer.id)
    setShowTransferForm(true)
  }

  function handleSaveTransfer() {
    if (
      !transferForm.type.trim() ||
      !transferForm.origin.trim() ||
      !transferForm.destination.trim() ||
      !transferForm.departureDate
    ) {
      return
    }

    if (editingTransferId) {
      updateTransfer({
        id: editingTransferId,
        ...transferForm,
      })
    } else {
      addTransfer(transferForm)
    }

    resetTransferForm()
  }

  function handleRemoveTransfer(transfer: Transfer) {
    const confirmed = window.confirm(
      `Excluir deslocamento ${transfer.origin} → ${transfer.destination}?`,
    )

    if (confirmed) {
      deleteTransfer(transfer.id)
    }
  }

  function updateTransferField(
    field: keyof Omit<Transfer, 'id'>,
    value: string,
  ) {
    setTransferForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  return (
    <article className="viagem-card">
      <div className="viagem-card-header">
        <div>
          <p className="eyebrow">Deslocamentos</p>
          <h3>
            <span>🚆</span>
            Entre uma cidade e outra
          </h3>
        </div>

        <button
          className="mission-add-button"
          onClick={handleOpenCreateTransfer}
        >
          +
        </button>
      </div>

      <p>
        Trens, ônibus, metrôs, táxis e outros deslocamentos importantes da
        expedição.
      </p>

      {transfers.length === 0 ? (
        <div className="viagem-empty-state">0 item cadastrado</div>
      ) : (
        <div className="viagem-list">
          {transfers.map((transfer) => (
            <article className="viagem-list-item" key={transfer.id}>
              <div>
                <strong>
                  {transfer.origin} → {transfer.destination}
                </strong>

                <span>
                  Tipo: {transfer.type}
                  {transfer.company
                    ? ` · Empresa: ${transfer.company}`
                    : ''}
                </span>

                <small>
                  Data: {formatDate(transfer.departureDate)}
                  {transfer.departureTime
                    ? ` · Saída: ${transfer.departureTime}`
                    : ''}
                  {transfer.arrivalTime
                    ? ` · Chegada: ${transfer.arrivalTime}`
                    : ''}
                </small>

                {hasExtraTransferInfo(transfer) && (
                  <small>
                    {transfer.locator
                      ? `Localizador: ${transfer.locator}`
                      : ''}
                    {transfer.ticketUrl
                      ? `${transfer.locator ? ' · ' : ''}Bilhete: ${transfer.ticketUrl}`
                      : ''}
                    {transfer.notes
                      ? `${transfer.locator || transfer.ticketUrl ? ' · ' : ''}${transfer.notes}`
                      : ''}
                  </small>
                )}
              </div>

              <div className="viagem-item-actions">
                <button
                  onClick={() => handleOpenEditTransfer(transfer)}
                  title="Editar deslocamento"
                >
                  ✏️
                </button>

                <button
                  onClick={() => handleRemoveTransfer(transfer)}
                  title="Excluir deslocamento"
                >
                  🗑️
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {showTransferForm && (
        <div className="viagem-form">
          <input
            value={transferForm.type}
            onChange={(event) =>
              updateTransferField('type', event.target.value)
            }
            placeholder="Tipo: trem, ônibus, táxi, transfer..."
            autoFocus
          />

          <input
            value={transferForm.company}
            onChange={(event) =>
              updateTransferField('company', event.target.value)
            }
            placeholder="Empresa"
          />

          <input
            value={transferForm.origin}
            onChange={(event) =>
              updateTransferField('origin', event.target.value)
            }
            placeholder="Origem"
          />

          <input
            value={transferForm.destination}
            onChange={(event) =>
              updateTransferField('destination', event.target.value)
            }
            placeholder="Destino"
          />

          <label>
            Data do deslocamento
            <input
              type="date"
              value={transferForm.departureDate}
              onChange={(event) =>
                updateTransferField('departureDate', event.target.value)
              }
            />
          </label>

          <label>
            Horário de saída
            <input
              type="time"
              value={transferForm.departureTime}
              onChange={(event) =>
                updateTransferField('departureTime', event.target.value)
              }
            />
          </label>

          <label>
            Horário de chegada
            <input
              type="time"
              value={transferForm.arrivalTime}
              onChange={(event) =>
                updateTransferField('arrivalTime', event.target.value)
              }
            />
          </label>

          <input
            value={transferForm.locator}
            onChange={(event) =>
              updateTransferField('locator', event.target.value)
            }
            placeholder="Localizador"
          />

          <input
            value={transferForm.ticketUrl}
            onChange={(event) =>
              updateTransferField('ticketUrl', event.target.value)
            }
            placeholder="Link do bilhete"
          />

          <textarea
            value={transferForm.notes}
            onChange={(event) =>
              updateTransferField('notes', event.target.value)
            }
            placeholder="Observações, plataforma, bagagem, instruções..."
          />

          <div>
            <button onClick={handleSaveTransfer}>
              {editingTransferId
                ? 'Salvar edição'
                : 'Salvar deslocamento'}
            </button>

            <button onClick={resetTransferForm}>Cancelar</button>
          </div>
        </div>
      )}
    </article>
  )
}
