import type { Stay } from '../../data/viagem'

type StayFormData = Omit<Stay, 'id'>

type StayFormProps = {
  form: StayFormData
  isEditing: boolean
  onChange: (field: keyof StayFormData, value: string) => void
  onSave: () => void
  onCancel: () => void
}

export function StayForm({
  form,
  isEditing,
  onChange,
  onSave,
  onCancel,
}: StayFormProps) {
  return (
    <div className="viagem-form">
      <input
        value={form.name}
        onChange={(event) => onChange('name', event.target.value)}
        placeholder="Nome da hospedagem"
        autoFocus
      />

      <input
        value={form.city}
        onChange={(event) => onChange('city', event.target.value)}
        placeholder="Cidade"
      />

      <input
        value={form.country}
        onChange={(event) => onChange('country', event.target.value)}
        placeholder="País"
      />

      <input
        type="date"
        value={form.checkIn}
        onChange={(event) => onChange('checkIn', event.target.value)}
        aria-label="Data de entrada"
      />

      <input
        type="date"
        value={form.checkOut}
        onChange={(event) => onChange('checkOut', event.target.value)}
        aria-label="Data de saída"
      />

      <input
        value={form.address}
        onChange={(event) => onChange('address', event.target.value)}
        placeholder="Endereço"
      />

      <input
        value={form.phone}
        onChange={(event) => onChange('phone', event.target.value)}
        placeholder="Telefone"
      />

      <input
        value={form.email}
        onChange={(event) => onChange('email', event.target.value)}
        placeholder="E-mail"
      />

      <input
        value={form.site}
        onChange={(event) => onChange('site', event.target.value)}
        placeholder="Site"
      />

      <textarea
        value={form.notes}
        onChange={(event) => onChange('notes', event.target.value)}
        placeholder="Observações, reserva, contato, horário de check-in..."
      />

      <div>
        <button onClick={onSave}>
          {isEditing ? 'Salvar edição' : 'Salvar hospedagem'}
        </button>

        <button onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  )
}