import type { Flight } from '../../data/viagemStore'

type FlightCardProps = {
  flight: Flight
  onEdit: (flight: Flight) => void
  onDelete: (flightId: string) => void
}

function formatDate(date: string) {
  if (!date) return ''

  return new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function FlightCard({ flight, onEdit, onDelete }: FlightCardProps) {
  return (
    <article className="viagem-list-item">
      <div>
        <strong>
          {flight.airline}
          {flight.flightNumber ? ` · ${flight.flightNumber}` : ''}
        </strong>

        <span>
          {flight.origin} → {flight.destination}
        </span>

        <small>
          {formatDate(flight.departureDate)}
          {flight.boardingTime ? ` · Embarque ${flight.boardingTime}` : ''}
          {flight.arrivalTime ? ` · Chegada ${flight.arrivalTime}` : ''}
        </small>
      </div>

      <div className="viagem-item-actions">
        <button onClick={() => onEdit(flight)} title="Editar voo">
          ✏️
        </button>

        <button onClick={() => onDelete(flight.id)} title="Excluir voo">
          🗑️
        </button>
      </div>
    </article>
  )
}
