import { useState } from 'react'

import {
  DeleteIcon,
  EditIcon,
  FoodIcon,
  LodgingIcon,
  MarketIcon,
  MoreIcon,
  PharmacyIcon,
  TicketIcon,
  TransportIcon,
} from '../icons/AppIcons'
import type { Expense } from '../../data/financas'
import { expenseCategories } from '../../data/financas'

type ExpenseCardProps = {
  expense: Expense
  onEdit: (expense: Expense) => void
  onDelete: (expenseId: string) => void
}

const categoryIcons = {
  alimentacao: FoodIcon,
  hospedagem: LodgingIcon,
  transporte: TransportIcon,
  compras: MarketIcon,
  saude: PharmacyIcon,
  ingressos: TicketIcon,
  outros: MoreIcon,
}

function formatCurrency(value: number, currency: 'BRL' | 'EUR') {
  return new Intl.NumberFormat(currency === 'EUR' ? 'pt-PT' : 'pt-BR', {
    style: 'currency',
    currency,
  }).format(value)
}

function formatDate(date: string) {
  if (!date) return '-'

  const [year, month, day] = date.split('-')

  return `${day}/${month}/${year}`
}

function participantLabel(name: string) {
  switch (name) {
    case 'Pri':
      return 'Pri'
    case 'Tania':
      return 'Tan'
    case 'Andrea':
      return 'Deia'
    default:
      return name
  }
}

export function ExpenseCard({
  expense,
  onEdit,
  onDelete,
}: ExpenseCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  const category =
    expenseCategories.find((item) => item.value === expense.category)
      ?.label ?? expense.category

  const CategoryIcon = categoryIcons[expense.category]

  return (
    <article className={isOpen ? 'expense-card open' : 'expense-card'}>
      <div
        className="expense-card-clickable"
        onClick={() => setIsOpen((current) => !current)}
      >
        <div className="expense-card-header">
          <div>
            <h3>{expense.title}</h3>

            <p className="expense-category">
              <CategoryIcon size={18} />
              <span>{category}</span>
            </p>
          </div>

          <strong className="expense-value">
            {formatCurrency(expense.amount, expense.currency)}
          </strong>
        </div>

        <div className="expense-card-body">
          <div className="expense-row">
            <strong>Data</strong>
            <span>{formatDate(expense.date)}</span>
          </div>

          <div className="expense-row">
            <strong>Pago por</strong>
            <span>{expense.paidBy}</span>
          </div>

          {isOpen && (
            <>
              <div className="expense-row">
                <strong>Participantes</strong>

                <span>
                  {expense.participants.map(participantLabel).join(' • ')}
                </span>
              </div>

              {expense.currency === 'EUR' && (
                <div className="expense-row">
                  <strong>Cotação usada</strong>
                  <span>
                    € 1 = R$ {expense.exchangeRate.toFixed(4).replace('.', ',')}
                  </span>
                </div>
              )}

              <div className="expense-row">
                <strong>Valor em reais</strong>
                <span>{formatCurrency(expense.amountInBRL, 'BRL')}</span>
              </div>

              {expense.notes && (
                <div className="expense-notes">{expense.notes}</div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="expense-card-actions">
        <button
          type="button"
          title="Editar despesa"
          aria-label="Editar despesa"
          onClick={() => onEdit(expense)}
        >
          <EditIcon size={18} />
        </button>

        <button
          type="button"
          title="Excluir despesa"
          aria-label="Excluir despesa"
          onClick={() => onDelete(expense.id)}
        >
          <DeleteIcon size={18} />
        </button>
      </div>
    </article>
  )
}