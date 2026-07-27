import {
  DeleteIcon,
  EditIcon,
} from '../icons/AppIcons'

import type { RoteiroItem } from '../../data/roteiroStore'

type RoteiroCardProps = {
  item: RoteiroItem
  dayNumber: number
  onEdit: (item: RoteiroItem) => void
  onDelete: (itemId: string) => void
  onComplete?: (itemId: string) => void
  onReopen?: (itemId: string) => void
}

function formatHeaderDate(date: string) {
  const [year, month, day] = date.split('-')

  if (!year || !month || !day) {
    return date
  }

  const currentDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
  )

  const weekday = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    timeZone: 'UTC',
  })
    .format(currentDate)
    .replace('-feira', '')
    .toUpperCase()

  const monthName = new Intl.DateTimeFormat('pt-BR', {
    month: 'short',
    timeZone: 'UTC',
  })
    .format(currentDate)
    .replace('.', '')
    .toUpperCase()

  return `${weekday} • ${day} ${monthName} ${year}`
}

export function RoteiroCard({
  item,
  dayNumber,
  onEdit,
  onDelete,
  onComplete,
  onReopen,
}: RoteiroCardProps) {
  function handleDelete() {
    const confirmed = window.confirm(
      `Excluir o roteiro de ${formatHeaderDate(item.date)}?`,
    )

    if (confirmed) {
      onDelete(item.id)
    }
  }

  function handleComplete() {
    const confirmed = window.confirm(
      `Concluir o dia ${dayNumber} do roteiro?`,
    )

    if (confirmed) {
      onComplete?.(item.id)
    }
  }

  function handleReopen() {
    onReopen?.(item.id)
  }

  const isCompleted = item.status === 'completed'

  return (
    <article
      className={`roteiro-card${
        isCompleted
          ? ' roteiro-card-completed'
          : ''
      }`}
    >
      <header className="roteiro-card-header">
        <span className="roteiro-card-date">
          {formatHeaderDate(item.date)}
        </span>

        <span className="roteiro-card-day">
          Dia {dayNumber}
        </span>

        <h2>{item.city}</h2>
      </header>

      <p className="roteiro-card-summary">
        {item.summary}
      </p>

      <div className="roteiro-card-overnight">
        <span aria-hidden="true">☾</span>

        <span>Dormir em</span>

        <strong>{item.overnightCity}</strong>
      </div>

      {item.notes && (
        <div className="roteiro-card-notes">
          <span>Observações</span>

          <p>{item.notes}</p>
        </div>
      )}

      <footer className="roteiro-card-footer">
        {!isCompleted && onComplete && (
          <button
            type="button"
            className="roteiro-card-status-button"
            aria-label="Concluir dia do roteiro"
            title="Concluir dia"
            onClick={handleComplete}
          >
            Concluir dia
          </button>
        )}

        {isCompleted && onReopen && (
          <button
            type="button"
            className="roteiro-card-status-button"
            aria-label="Reabrir dia do roteiro"
            title="Reabrir dia"
            onClick={handleReopen}
          >
            Reabrir
          </button>
        )}

        {!isCompleted && (
          <button
            type="button"
            aria-label="Editar dia do roteiro"
            title="Editar"
            onClick={() => onEdit(item)}
          >
            <EditIcon size={15} />
          </button>
        )}

        <button
          type="button"
          aria-label="Excluir dia do roteiro"
          title="Excluir"
          onClick={handleDelete}
        >
          <DeleteIcon size={15} />
        </button>
      </footer>
    </article>
  )
}