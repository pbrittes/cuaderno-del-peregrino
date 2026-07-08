import { useEffect, useState } from "react"
import type { FormEvent } from "react"

import type { Transfer } from "../../data/viagemStore"

type TransferFormProps = {
  open: boolean
  initialData: Transfer | null
  onSave: (transfer: Transfer) => void
  onCancel: () => void
}

const emptyTransfer: Transfer = {
  id: "",
  type: "",
  company: "",
  origin: "",
  destination: "",
  departureDate: "",
  departureTime: "",
  arrivalTime: "",
  locator: "",
  ticketUrl: "",
  notes: "",
}

export default function TransferForm({
  open,
  initialData,
  onSave,
  onCancel,
}: TransferFormProps) {
  const [formData, setFormData] = useState<Transfer>(emptyTransfer)

  useEffect(() => {
    setFormData(initialData ?? emptyTransfer)
  }, [initialData, open])

  if (!open) {
    return null
  }

  function updateField(field: keyof Transfer, value: string) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    onSave({
      ...formData,
      id: formData.id || crypto.randomUUID(),
    })
  }

  return (
    <form className="travel-form" onSubmit={handleSubmit}>
      <div className="travel-form__grid">
        <label>
          Tipo
          <input
            type="text"
            value={formData.type}
            onChange={(event) => updateField("type", event.target.value)}
            placeholder="Trem, ônibus, táxi, transfer..."
            required
          />
        </label>

        <label>
          Empresa
          <input
            type="text"
            value={formData.company}
            onChange={(event) => updateField("company", event.target.value)}
            placeholder="Comboios de Portugal, FlixBus..."
          />
        </label>

        <label>
          Origem
          <input
            type="text"
            value={formData.origin}
            onChange={(event) => updateField("origin", event.target.value)}
            placeholder="Porto"
            required
          />
        </label>

        <label>
          Destino
          <input
            type="text"
            value={formData.destination}
            onChange={(event) => updateField("destination", event.target.value)}
            placeholder="Caminha"
            required
          />
        </label>

        <label>
          Data de saída
          <input
            type="date"
            value={formData.departureDate}
            onChange={(event) =>
              updateField("departureDate", event.target.value)
            }
            required
          />
        </label>

        <label>
          Horário de saída
          <input
            type="time"
            value={formData.departureTime}
            onChange={(event) =>
              updateField("departureTime", event.target.value)
            }
          />
        </label>

        <label>
          Horário de chegada
          <input
            type="time"
            value={formData.arrivalTime}
            onChange={(event) =>
              updateField("arrivalTime", event.target.value)
            }
          />
        </label>

        <label>
          Localizador
          <input
            type="text"
            value={formData.locator}
            onChange={(event) => updateField("locator", event.target.value)}
            placeholder="Código da reserva"
          />
        </label>

        <label className="travel-form__full">
          Link do bilhete
          <input
            type="url"
            value={formData.ticketUrl}
            onChange={(event) => updateField("ticketUrl", event.target.value)}
            placeholder="https://..."
          />
        </label>

        <label className="travel-form__full">
          Observações
          <textarea
            value={formData.notes}
            onChange={(event) => updateField("notes", event.target.value)}
            placeholder="Informações importantes sobre este deslocamento"
            rows={4}
          />
        </label>
      </div>

      <div className="travel-form__actions">
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>

        <button type="submit">
          Salvar deslocamento
        </button>
      </div>
    </form>
  )
}
