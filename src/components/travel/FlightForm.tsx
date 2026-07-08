import type { Flight } from '../../data/viagemStore'

type FlightFormData = Omit<Flight, 'id'>

type FlightFormProps = {
  form: FlightFormData
  isEditing: boolean
  onChange: (field: keyof FlightFormData, value: string) => void
  onSave: () => void
  onCancel: () => void
}

export function FlightForm({
  form,
  isEditing,
  onChange,
  onSave,
  onCancel,
}: FlightFormProps) {
  return (
    <div className="viagem-form">
      <input
        value={form.airline}
        onChange={(event) => onChange('airline', event.target.value)}
        placeholder="Companhia aérea"
        autoFocus
      />

      <input
        value={form.flightNumber}
        onChange={(event) => onChange('flightNumber', event.target.value)}
        placeholder="Número do voo"
      />

      <input
        value={form.origin}
        onChange={(event) => onChange('origin', event.target.value)}
        placeholder="Origem"
      />

      <input
        value={form.destination}
        onChange={(event) => onChange('destination', event.target.value)}
        placeholder="Destino"
      />

      <input
        type="date"
        value={form.departureDate}
        onChange={(event) => onChange('departureDate', event.target.value)}
        aria-label="Data do voo"
      />

      <input
        type="time"
        value={form.boardingTime}
        onChange={(event) => onChange('boardingTime', event.target.value)}
        aria-label="Horário de embarque"
      />

      <input
        type="time"
        value={form.arrivalAtBoardingTime}
        onChange={(event) =>
          onChange('arrivalAtBoardingTime', event.target.value)
        }
        aria-label="Horário recomendado de chegada ao aeroporto"
      />

      <input
        type="time"
        value={form.arrivalTime}
        onChange={(event) => onChange('arrivalTime', event.target.value)}
        aria-label="Horário de chegada"
      />

      <textarea
        value={form.notes}
        onChange={(event) => onChange('notes', event.target.value)}
        placeholder="Observações, terminal, bagagem, localizador..."
      />

      <div>
        <button onClick={onSave}>
          {isEditing ? 'Salvar edição' : 'Salvar voo'}
        </button>

        <button onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  )
}
