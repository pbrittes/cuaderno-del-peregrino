import type {
  Currency,
  Expense,
  ExpenseCategory,
  Pilgrim,
} from '../../data/financas'
import { expenseCategories, pilgrims } from '../../data/financas'

type ExpenseFormData = Omit<Expense, 'id'>

type ExpenseFormProps = {
  form: ExpenseFormData
  isEditing: boolean
  onChange: (
    field: keyof ExpenseFormData,
    value:
      | string
      | number
      | Currency
      | ExpenseCategory
      | Pilgrim
      | Pilgrim[],
  ) => void
  onSave: () => void
  onCancel: () => void
}

export function ExpenseForm({
  form,
  isEditing,
  onChange,
  onSave,
  onCancel,
}: ExpenseFormProps) {
  function toggleParticipant(pilgrim: Pilgrim) {
    if (form.participants.includes(pilgrim)) {
      onChange(
        'participants',
        form.participants.filter((item) => item !== pilgrim),
      )
    } else {
      onChange('participants', [...form.participants, pilgrim])
    }
  }

  return (
    <div className="finance-form">
      <label className="finance-field">
        <span>Descrição da despesa</span>
        <input
          value={form.title}
          onChange={(event) => onChange('title', event.target.value)}
          placeholder="Jantar, hospedagem, táxi..."
          autoFocus
        />
      </label>

      <label className="finance-field">
        <span>Categoria</span>
        <select
          value={form.category}
          onChange={(event) =>
            onChange('category', event.target.value as ExpenseCategory)
          }
        >
          {expenseCategories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </label>

      <div
        className={
          form.currency === 'EUR'
            ? 'finance-form-row finance-form-row-three'
            : 'finance-form-row'
        }
      >
        <label className="finance-field">
          <span>Valor</span>
          <input
            type="number"
            step="0.01"
            value={form.amount}
            onChange={(event) =>
              onChange('amount', Number(event.target.value))
            }
            placeholder="0,00"
          />
        </label>

        <label className="finance-field">
          <span>Moeda</span>
          <select
            value={form.currency}
            onChange={(event) =>
              onChange('currency', event.target.value as Currency)
            }
          >
            <option value="BRL">Real (R$)</option>
            <option value="EUR">Euro (€)</option>
          </select>
        </label>

        {form.currency === 'EUR' && (
          <label className="finance-field">
            <span>Cotação utilizada</span>
            <input
              type="number"
              step="0.0001"
              value={form.exchangeRate}
              onChange={(event) =>
                onChange('exchangeRate', Number(event.target.value))
              }
              placeholder="6,45"
            />
          </label>
        )}
      </div>

      <div className="finance-form-row">
        <label className="finance-field">
          <span>Pago por</span>
          <select
            value={form.paidBy}
            onChange={(event) =>
              onChange('paidBy', event.target.value as Pilgrim)
            }
          >
            {pilgrims.map((pilgrim) => (
              <option key={pilgrim} value={pilgrim}>
                {pilgrim}
              </option>
            ))}
          </select>
        </label>

        <label className="finance-field">
          <span>Data</span>
          <input
            type="date"
            value={form.date}
            onChange={(event) => onChange('date', event.target.value)}
          />
        </label>
      </div>

      <div className="participants-block">
        <span>Participantes</span>

        <div className="participants-chips">
          {pilgrims.map((pilgrim) => (
            <label
              key={pilgrim}
              className={
                form.participants.includes(pilgrim)
                  ? 'participant-chip active'
                  : 'participant-chip'
              }
            >
              <input
                type="checkbox"
                checked={form.participants.includes(pilgrim)}
                onChange={() => toggleParticipant(pilgrim)}
              />

              {pilgrim}
            </label>
          ))}
        </div>
      </div>

      <label className="finance-field">
        <span>Observações</span>
        <textarea
          value={form.notes}
          onChange={(event) => onChange('notes', event.target.value)}
          placeholder="Local, comprovante, observações da despesa..."
        />
      </label>

      <div className="finance-form-actions">
        <button type="button" onClick={onSave}>
          {isEditing ? 'Salvar edição' : 'Salvar despesa'}
        </button>

        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </div>
  )
}