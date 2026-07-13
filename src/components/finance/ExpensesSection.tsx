import { useMemo, useState } from 'react'

import { ConfirmDialog } from '../ui/ConfirmDialog'
import { ExpenseCard } from './ExpenseCard'
import { ExpenseForm } from './ExpenseForm'
import type {
  Currency,
  Expense,
  ExpenseCategory,
  Pilgrim,
} from '../../data/financas'
import {
  expenseCategories,
  pilgrims,
} from '../../data/financas'

type ExpenseFormData = Omit<Expense, 'id'>

type ExpensesSectionProps = {
  expenses: Expense[]
  addExpense: (expense: ExpenseFormData) => void
  updateExpense: (expense: Expense) => void
  deleteExpense: (expenseId: string) => void
}

type SortOption =
  | 'newest'
  | 'oldest'
  | 'highest'
  | 'lowest'

const emptyForm: ExpenseFormData = {
  title: '',
  category: 'alimentacao',
  amount: 0,
  currency: 'BRL',
  exchangeRate: 1,
  amountInBRL: 0,
  paidBy: 'Pri',
  participants: [...pilgrims],
  date: '',
  notes: '',
}

function calculateAmountInBRL(
  amount: number,
  currency: Currency,
  exchangeRate: number,
) {
  if (currency === 'EUR') {
    return amount * exchangeRate
  }

  return amount
}

export function ExpensesSection({
  expenses,
  addExpense,
  updateExpense,
  deleteExpense,
}: ExpensesSectionProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] =
    useState<Expense | null>(null)
  const [form, setForm] =
    useState<ExpenseFormData>(emptyForm)
  const [expenseToDelete, setExpenseToDelete] =
    useState<Expense | null>(null)

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [categoryFilter, setCategoryFilter] =
    useState<ExpenseCategory | 'all'>('all')
  const [paidByFilter, setPaidByFilter] =
    useState<Pilgrim | 'all'>('all')
  const [participantFilter, setParticipantFilter] =
    useState<Pilgrim | 'all'>('all')
  const [sortOption, setSortOption] =
    useState<SortOption>('newest')

  const visibleExpenses = useMemo(() => {
    const filteredExpenses = expenses.filter((expense) => {
      if (startDate && expense.date < startDate) {
        return false
      }

      if (endDate && expense.date > endDate) {
        return false
      }

      if (
        categoryFilter !== 'all' &&
        expense.category !== categoryFilter
      ) {
        return false
      }

      if (
        paidByFilter !== 'all' &&
        expense.paidBy !== paidByFilter
      ) {
        return false
      }

      if (
        participantFilter !== 'all' &&
        !expense.participants.includes(participantFilter)
      ) {
        return false
      }

      return true
    })

    return [...filteredExpenses].sort((a, b) => {
      if (sortOption === 'oldest') {
        return (
          new Date(a.date).getTime() -
          new Date(b.date).getTime()
        )
      }

      if (sortOption === 'highest') {
        return b.amountInBRL - a.amountInBRL
      }

      if (sortOption === 'lowest') {
        return a.amountInBRL - b.amountInBRL
      }

      return (
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
      )
    })
  }, [
    expenses,
    startDate,
    endDate,
    categoryFilter,
    paidByFilter,
    participantFilter,
    sortOption,
  ])

  function resetForm() {
    setForm(emptyForm)
    setEditingExpense(null)
    setShowForm(false)
  }

  function handleOpenCreate() {
    setForm(emptyForm)
    setEditingExpense(null)
    setShowForm(true)
  }

  function handleOpenEdit(expense: Expense) {
    setForm({
      title: expense.title,
      category: expense.category,
      amount: expense.amount,
      currency: expense.currency,
      exchangeRate: expense.exchangeRate,
      amountInBRL: expense.amountInBRL,
      paidBy: expense.paidBy,
      participants: expense.participants,
      date: expense.date,
      notes: expense.notes,
    })

    setEditingExpense(expense)
    setShowForm(true)
  }

  function handleChange(
    field: keyof ExpenseFormData,
    value:
      | string
      | number
      | Currency
      | ExpenseCategory
      | Pilgrim
      | Pilgrim[],
  ) {
    setForm((currentForm) => {
      const updatedForm = {
        ...currentForm,
        [field]: value,
      }

      return {
        ...updatedForm,
        amountInBRL: calculateAmountInBRL(
          Number(updatedForm.amount),
          updatedForm.currency,
          Number(updatedForm.exchangeRate),
        ),
      }
    })
  }

  function handleSave() {
    const trimmedTitle = form.title.trim()

    if (!trimmedTitle) return
    if (form.amount <= 0) return
    if (form.participants.length === 0) return

    const expenseToSave: ExpenseFormData = {
      ...form,
      title: trimmedTitle,
      amountInBRL: calculateAmountInBRL(
        form.amount,
        form.currency,
        form.exchangeRate,
      ),
    }

    if (editingExpense) {
      updateExpense({
        id: editingExpense.id,
        ...expenseToSave,
      })
    } else {
      addExpense(expenseToSave)
    }

    resetForm()
  }

  function handleConfirmDelete() {
    if (!expenseToDelete) return

    deleteExpense(expenseToDelete.id)
    setExpenseToDelete(null)
  }

  return (
    <section className="finance-section">
      <div className="section-header">
        <p className="eyebrow">Despesas</p>

        <button
          className="section-add-button"
          type="button"
          title="Nova despesa"
          onClick={handleOpenCreate}
        >
          +
        </button>
      </div>

      {showForm && (
        <ExpenseForm
          form={form}
          isEditing={Boolean(editingExpense)}
          onChange={handleChange}
          onSave={handleSave}
          onCancel={resetForm}
        />
      )}

      {expenses.length === 0 ? (
        <div className="empty-state">
          <p>Nenhuma despesa cadastrada.</p>
        </div>
      ) : visibleExpenses.length === 0 ? (
        <div className="empty-state">
          <p>Nenhuma despesa encontrada com estes filtros.</p>
        </div>
      ) : (
        <div className="expenses-list">
          {visibleExpenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onEdit={handleOpenEdit}
              onDelete={() => setExpenseToDelete(expense)}
            />
          ))}
        </div>
      )}

      <div className="finance-filters">
        <p className="eyebrow">Filtros e ordenação</p>

        <div className="finance-filters-grid">
          <label className="finance-field">
            <span>Data inicial</span>

            <input
              type="date"
              value={startDate}
              onChange={(event) =>
                setStartDate(event.target.value)
              }
            />
          </label>

          <label className="finance-field">
            <span>Data final</span>

            <input
              type="date"
              value={endDate}
              onChange={(event) =>
                setEndDate(event.target.value)
              }
            />
          </label>

          <label className="finance-field">
            <span>Categoria</span>

            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(
                  event.target.value as
                    | ExpenseCategory
                    | 'all',
                )
              }
            >
              <option value="all">Todas</option>

              {expenseCategories.map((category) => (
                <option
                  key={category.value}
                  value={category.value}
                >
                  {category.label}
                </option>
              ))}
            </select>
          </label>

          <label className="finance-field">
            <span>Quem pagou</span>

            <select
              value={paidByFilter}
              onChange={(event) =>
                setPaidByFilter(
                  event.target.value as Pilgrim | 'all',
                )
              }
            >
              <option value="all">Todas</option>

              {pilgrims.map((pilgrim) => (
                <option key={pilgrim} value={pilgrim}>
                  {pilgrim}
                </option>
              ))}
            </select>
          </label>

          <label className="finance-field">
            <span>Participante</span>

            <select
              value={participantFilter}
              onChange={(event) =>
                setParticipantFilter(
                  event.target.value as Pilgrim | 'all',
                )
              }
            >
              <option value="all">Todas</option>

              {pilgrims.map((pilgrim) => (
                <option key={pilgrim} value={pilgrim}>
                  {pilgrim}
                </option>
              ))}
            </select>
          </label>

          <label className="finance-field">
            <span>Ordenação</span>

            <select
              value={sortOption}
              onChange={(event) =>
                setSortOption(
                  event.target.value as SortOption,
                )
              }
            >
              <option value="newest">
                Mais recentes
              </option>
              <option value="oldest">
                Mais antigas
              </option>
              <option value="highest">
                Maior valor
              </option>
              <option value="lowest">
                Menor valor
              </option>
            </select>
          </label>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(expenseToDelete)}
        title="Excluir despesa?"
        message={
          expenseToDelete
            ? `A despesa "${expenseToDelete.title}" será removida do Financeiro.`
            : ''
        }
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setExpenseToDelete(null)}
      />
    </section>
  )
}