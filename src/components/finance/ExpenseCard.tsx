import { useState } from 'react'

import {
  CheckCircleIcon,
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
import type { Expense, Pilgrim } from '../../data/financas'
import { expenseCategories } from '../../data/financas'

import './ExpenseCard.css'

type ExpenseCardProps = {
  expense: Expense
  expenses?: Expense[]
  onEdit: (expense: Expense) => void
  onMarkAsPaid: (expenseId: string) => void
  onUndoPayment: (expenseId: string) => void
  onDelete: (expenseId: string) => void
  onSetParticipantPayment?: (
    expenseId: string,
    participant: Pilgrim,
    paid: boolean,
  ) => void
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

function formatDate(date?: string) {
  if (!date) return '-'

  const [year, month, day] = date.split('-')

  return `${day}/${month}/${year}`
}

function formatCompetence(competence?: string) {
  if (!competence) return '-'

  const [year, month] = competence.split('-')

  if (!year || !month) {
    return competence
  }

  return `${month}/${year}`
}

function participantLabel(name: Pilgrim) {
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

function isParticipantPaid(expense: Expense, participant: Pilgrim) {
  const participantPayment = expense.participantPayments?.[participant]

  if (participantPayment) {
    return participantPayment.paid === true
  }

  return expense.paid === true && expense.paidBy === participant
}

export function ExpenseCard({
  expense,
  expenses,
  onEdit,
  onMarkAsPaid,
  onUndoPayment,
  onDelete,
  onSetParticipantPayment,
}: ExpenseCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  const groupedExpenses = (expenses?.length ? expenses : [expense])
    .slice()
    .sort((a, b) => (a.installmentNumber ?? 1) - (b.installmentNumber ?? 1))

  const category =
    expenseCategories.find((item) => item.value === expense.category)
      ?.label ?? expense.category

  const CategoryIcon = categoryIcons[expense.category]

  const installmentCount = Math.max(
    expense.installmentCount ?? 1,
    groupedExpenses.length,
  )

  const totalAmount = groupedExpenses.reduce(
    (sum, item) => sum + item.amount,
    0,
  )

  const payerLabel = participantLabel(expense.paidBy)
  const paymentTypeLabel =
    installmentCount > 1 ? `${installmentCount} parcelas` : 'À vista'
  const isPaid = groupedExpenses.every((item) => item.paid === true)

  console.log(
    'PARCELAS DEBUG',
    expense.title,
    groupedExpenses.map((item) => ({
      parcela: item.installmentNumber,
      amount: item.amount,
      amountInBRL: item.amountInBRL,
    })),
  )

  return (
    <article className={isOpen ? 'expense-card open' : 'expense-card'}>
      <div
        className="expense-card-clickable"
        onClick={() => setIsOpen((current) => !current)}
      >
        <div className="expense-card-header">
          <div className="expense-card-main">
            <div className="expense-card-title-group">
              <h3>{expense.title}</h3>

              <p className="expense-category">
                <CategoryIcon size={16} />
                <span>{category}</span>
              </p>
            </div>

            <div className="expense-card-financial">
              <strong className="expense-value">
                {formatCurrency(totalAmount, expense.currency)}
              </strong>

              <span className="expense-date">
                {formatDate(expense.date)}
              </span>
            </div>
          </div>

          <div className="expense-card-meta">
            <span className="expense-installment-info">
              {paymentTypeLabel}
            </span>

            <span className="expense-payer">
              <span>Pago por</span>
              <strong>{payerLabel}</strong>
            </span>
          </div>
        </div>

        {isOpen && (
          <div className="expense-installments-table-wrapper">
            <table className="expense-installments-table">
              <thead>
                <tr>
                  <th>Parcela</th>
                  <th>Competência</th>
                  <th>Valor</th>
                  <th>Pri</th>
                  <th>Tan</th>
                  <th>Deia</th>
                </tr>
              </thead>

              <tbody>
                {groupedExpenses.map((item) => {
                  const participantShare =
                    item.participants.length === 0
                      ? 0
                      : item.amountInBRL / item.participants.length

                  const renderParticipantPayment = (
                    participant: Pilgrim,
                  ) => {
                    if (!item.participants.includes(participant)) {
                      return <span>-</span>
                    }

                    const paid = isParticipantPaid(item, participant)

                    return (
                      <button
                        type="button"
                        className={
                          paid
                            ? 'expense-participant-payment paid'
                            : 'expense-participant-payment'
                        }
                        title={
                          paid
                            ? `Desmarcar pagamento de ${participantLabel(
                                participant,
                              )}`
                            : `Marcar pagamento de ${participantLabel(
                                participant,
                              )}`
                        }
                        aria-label={
                          paid
                            ? `Desmarcar pagamento de ${participantLabel(
                                participant,
                              )}`
                            : `Marcar pagamento de ${participantLabel(
                                participant,
                              )}`
                        }
                        onClick={(event) => {
                          event.stopPropagation()

                          onSetParticipantPayment?.(
                            item.id,
                            participant,
                            !paid,
                          )
                        }}
                      >
                        <span aria-hidden="true">{paid ? '✓' : '○'}</span>

                        <small>
                          {formatCurrency(participantShare, 'BRL')}
                        </small>
                      </button>
                    )
                  }

                  return (
                    <tr key={item.id}>
                      <td>
                        {(item.installmentNumber ?? 1)}/
                        {item.installmentCount ?? installmentCount}
                      </td>

                      <td>{formatCompetence(item.competence)}</td>

                      <td>{formatCurrency(item.amount, item.currency)}</td>

                      <td>{renderParticipantPayment('Pri')}</td>

                      <td>{renderParticipantPayment('Tania')}</td>

                      <td>{renderParticipantPayment('Andrea')}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <div className="expense-card-body">
              <div className="expense-row">
                <strong>Data</strong>
                <span>{formatDate(expense.date)}</span>
              </div>

              <div className="expense-row">
                <strong>Pago por</strong>
                <span>{payerLabel}</span>
              </div>

              <div className="expense-row">
                <strong>Situação</strong>
                <span>{isPaid ? 'Paga' : 'Pendente'}</span>
              </div>

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
                <span>
                  {formatCurrency(
                    groupedExpenses.reduce(
                      (sum, item) => sum + item.amountInBRL,
                      0,
                    ),
                    'BRL',
                  )}
                </span>
              </div>

              {expense.notes && (
                <div className="expense-notes">{expense.notes}</div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="expense-card-actions">
        <button
          type="button"
          className={isPaid ? 'expense-action-button paid' : 'expense-action-button'}
          title={isPaid ? 'Desfazer pagamento' : 'Marcar como paga'}
          aria-label={isPaid ? 'Desfazer pagamento' : 'Marcar como paga'}
          onClick={() =>
            isPaid
              ? onUndoPayment(expense.id)
              : onMarkAsPaid(expense.id)
          }
        >
          <CheckCircleIcon size={18} />
        </button>

        <button
          type="button"
          className="expense-action-button"
          title="Editar compra"
          aria-label="Editar compra"
          onClick={() => onEdit(expense)}
        >
          <EditIcon size={18} />
        </button>

        <button
          type="button"
          className="expense-action-button danger"
          title="Excluir compra"
          aria-label="Excluir compra"
          onClick={() => onDelete(expense.id)}
        >
          <DeleteIcon size={18} />
        </button>
      </div>
    </article>
  )
}