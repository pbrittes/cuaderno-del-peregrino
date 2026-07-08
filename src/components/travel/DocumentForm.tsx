import type { TravelDocument } from '../../data/viagemStore'

type DocumentFormData = Omit<TravelDocument, 'id'>

type DocumentFormProps = {
  form: DocumentFormData
  isEditing: boolean
  onChange: (field: keyof DocumentFormData, value: string) => void
  onSave: () => void
  onCancel: () => void
}

export function DocumentForm({
  form,
  isEditing,
  onChange,
  onSave,
  onCancel,
}: DocumentFormProps) {
  return (
    <div className="viagem-form">
      <input
        value={form.title}
        onChange={(e) => onChange('title', e.target.value)}
        placeholder="Documento"
        autoFocus
      />

      <input
        value={form.owner}
        onChange={(e) => onChange('owner', e.target.value)}
        placeholder="Titular"
      />

      <input
        value={form.documentNumber}
        onChange={(e) => onChange('documentNumber', e.target.value)}
        placeholder="Número do documento"
      />

      <label>
        Data de validade
        <input
          type="date"
          value={form.expirationDate}
          onChange={(e) => onChange('expirationDate', e.target.value)}
        />
      </label>

      <input
        value={form.fileUrl}
        onChange={(e) => onChange('fileUrl', e.target.value)}
        placeholder="Link do arquivo (Drive, OneDrive, etc.)"
      />

      <textarea
        value={form.notes}
        onChange={(e) => onChange('notes', e.target.value)}
        placeholder="Observações"
      />

      <div>
        <button onClick={onSave}>
          {isEditing ? 'Salvar edição' : 'Salvar documento'}
        </button>

        <button onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  )
}
