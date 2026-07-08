import type { Stay } from '../../data/viagem'

type StayCardProps = {
  stay: Stay
  onEdit: (stay: Stay) => void
  onRemove: (stay: Stay) => void
}

function formatDate(date: string) {
  if (!date) return ''

  return new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function StayCard({ stay, onEdit, onRemove }: StayCardProps) {
  return (
    <article className="viagem-list-item">
      <div>
        <strong>{stay.name}</strong>

        <span>
          {stay.city}
          {stay.country ? ` · ${stay.country}` : ''}
        </span>

        <small>
          {formatDate(stay.checkIn)}
          {stay.checkOut ? ` → ${formatDate(stay.checkOut)}` : ''}
        </small>
      </div>

      <div className="viagem-item-actions">
        <button onClick={() => onEdit(stay)} title="Editar hospedagem">
          ✏️
        </button>

        <button onClick={() => onRemove(stay)} title="Excluir hospedagem">
          🗑️
        </button>
      </div>
    </article>
  )
}