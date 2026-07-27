import {
  useEffect,
  useState,
  type FormEvent,
} from 'react'

import type {
  CreateRoteiroItemInput,
  RoteiroItem,
} from '../../data/roteiroStore'

type RoteiroFormProps = {
  item?: RoteiroItem | null
  onSave: (
    item: CreateRoteiroItemInput,
  ) => void
  onCancel: () => void
}

const emptyForm: CreateRoteiroItemInput = {
  date: '',
  city: '',
  summary: '',
  overnightCity: '',
  notes: '',
}

export function RoteiroForm({
  item,
  onSave,
  onCancel,
}: RoteiroFormProps) {
  const [formData, setFormData] =
    useState<CreateRoteiroItemInput>(emptyForm)

  useEffect(() => {
    if (item) {
      setFormData({
        date: item.date,
        city: item.city,
        summary: item.summary,
        overnightCity: item.overnightCity,
        notes: item.notes,
      })

      return
    }

    setFormData(emptyForm)
  }, [item])

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    onSave({
      date: formData.date,
      city: formData.city.trim(),
      summary: formData.summary.trim(),
      overnightCity:
        formData.overnightCity.trim(),
      notes: formData.notes.trim(),
    })
  }

  return (
    <form
      className="roteiro-form"
      onSubmit={handleSubmit}
    >
      <div className="roteiro-form-grid">
        <label>
          <span>Data</span>
          <input
            type="date"
            value={formData.date}
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                date: event.target.value,
              }))
            }
            required
          />
        </label>

        <label>
          <span>Cidade</span>
          <input
            type="text"
            value={formData.city}
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                city: event.target.value,
              }))
            }
            required
          />
        </label>

        <label className="roteiro-form-full">
          <span>Resumo do dia</span>
          <textarea
            value={formData.summary}
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                summary: event.target.value,
              }))
            }
            rows={3}
            required
          />
        </label>

        <label>
          <span>Cidade de pernoite</span>
          <input
            type="text"
            value={formData.overnightCity}
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                overnightCity:
                  event.target.value,
              }))
            }
            required
          />
        </label>

        <label className="roteiro-form-full">
          <span>Observações</span>
          <textarea
            value={formData.notes}
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                notes: event.target.value,
              }))
            }
            rows={3}
          />
        </label>
      </div>

      <div className="roteiro-form-actions">
        <button
          type="button"
          className="roteiro-button-secondary"
          onClick={onCancel}
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="roteiro-button-primary"
        >
          {item ? 'Salvar alterações' : 'Adicionar dia'}
        </button>
      </div>
    </form>
  )
}
