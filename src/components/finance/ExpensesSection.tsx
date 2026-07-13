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
import { pilgrims } from '../../data/financas'

type ExpenseFormData = Omit<Expense, 'id'>

type ExpensesSectionProps = {
  expenses: Expense[]
  addExpense: (expense: ExpenseFormData) => void
  updateExpense: (expense: Expense) => void
  deleteExpense: (expenseId: string) => void
}

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

  const orderedExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => {
      return (
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
      )
    })
  }, [expenses])

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

      {orderedExpenses.length === 0 ? (
        <div className="empty-state">
          <p>Nenhuma despesa cadastrada.</p>
        </div>
      ) : (
        <div className="expenses-list">
          {orderedExpenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onEdit={handleOpenEdit}
              onDelete={() => setExpenseToDelete(expense)}
            />
          ))}
        </div>
      )}

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