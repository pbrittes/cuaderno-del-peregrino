import {
  useMemo,
  useRef,
  useState,
} from 'react'

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

export type ExpenseQueryFilters = {
  startDate?: string
  endDate?: string
  categoryFilter?: ExpenseCategory | 'all'
  paidByFilter?: Pilgrim | 'all'
  participantFilter?: Pilgrim | 'all'
  sortOption?: SortOption
}

type ExpensesSectionProps = {
  expenses: Expense[]
  query?: ExpenseQueryFilters
  addExpense: (expense: ExpenseFormData) => void
  addExpenses: (expenses: ExpenseFormData[]) => void
  updateExpense: (expense: Expense) => void
  updateExpenses: (expenses: Expense[]) => void
  replaceExpenseGroup: (
    expenseIds: string[],
    expenses: ExpenseFormData[],
  ) => void
  setExpensePaid: (
    expenseId: string,
    paid: boolean,
    paidAt?: string,
  ) => void
  setParticipantPayment?: (
    expenseId: string,
    participant: Pilgrim,
    paid: boolean,
    paidAt?: string,
  ) => void
  deleteExpense: (expenseId: string) => void
  deleteExpenses: (expenseIds: string[]) => void
}

type SortOption =
  | 'newest'
  | 'oldest'
  | 'highest'
  | 'lowest'

type ExpenseGroup = {
  id: string
  expenses: Expense[]
  representative: Expense
  totalAmount: number
  totalAmountInBRL: number
}

function createEmptyForm(): ExpenseFormData {
  return {
    title: '',
    category: 'alimentacao',
    amount: 0,
    currency: 'BRL',
    exchangeRate: 1,
    amountInBRL: 0,
    paidBy: 'Pri',
    participants: [...pilgrims],
    date: '',
    competence: '',
    installmentCount: 1,
    paid: false,
    paidAt: undefined,
    notes: '',
  }
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

function createInstallmentGroupId() {
  return `installment-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`
}

function addMonthsToCompetence(
  competence: string,
  monthsToAdd: number,
) {
  const [year, month] = competence
    .split('-')
    .map(Number)

  const date = new Date(
    year,
    month - 1 + monthsToAdd,
    1,
  )

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1,
  ).padStart(2, '0')}`
}

function splitAmount(
  totalAmount: number,
  installmentCount: number,
) {
  const totalInCents = Math.round(
    totalAmount * 100,
  )

  const baseAmountInCents = Math.floor(
    totalInCents / installmentCount,
  )

  const remainder =
    totalInCents -
    baseAmountInCents * installmentCount

  return Array.from(
    { length: installmentCount },
    (_, index) =>
      (
        baseAmountInCents +
        (index < remainder ? 1 : 0)
      ) / 100,
  )
}

function getExpenseGroupId(expense: Expense) {
  return expense.installmentGroupId ?? expense.id
}

function getBaseTitle(expense: Expense) {
  if (
    !expense.installmentGroupId ||
    !expense.installmentNumber ||
    !expense.installmentCount
  ) {
    return expense.title
  }

  const installmentSuffix = new RegExp(
    `\\s*\\(${expense.installmentNumber}\\/${expense.installmentCount}\\)$`,
  )

  return expense.title.replace(installmentSuffix, '')
}

function sortInstallments(expenses: Expense[]) {
  return [...expenses].sort((a, b) => {
    const installmentDifference =
      (a.installmentNumber ?? 1) -
      (b.installmentNumber ?? 1)

    if (installmentDifference !== 0) {
      return installmentDifference
    }

    return (a.competence ?? '').localeCompare(
      b.competence ?? '',
    )
  })
}

function createExpenseGroups(expenses: Expense[]) {
  const groupedExpenses = new Map<string, Expense[]>()

  expenses.forEach((expense) => {
    const groupId = getExpenseGroupId(expense)
    const currentGroup = groupedExpenses.get(groupId) ?? []

    groupedExpenses.set(groupId, [
      ...currentGroup,
      expense,
    ])
  })

  return Array.from(groupedExpenses.entries()).map(
    ([id, groupExpenses]): ExpenseGroup => {
      const orderedExpenses = sortInstallments(groupExpenses)
      const firstExpense = orderedExpenses[0]
      const totalAmount = orderedExpenses.reduce(
        (total, expense) => total + expense.amount,
        0,
      )
      const totalAmountInBRL = orderedExpenses.reduce(
        (total, expense) => total + expense.amountInBRL,
        0,
      )

      return {
        id,
        expenses: orderedExpenses,
        totalAmount,
        totalAmountInBRL,
        representative: {
          ...firstExpense,
          title: getBaseTitle(firstExpense),
          amount: totalAmount,
          amountInBRL: totalAmountInBRL,
        },
      }
    },
  )
}

export function ExpensesSection({
  expenses,
  query,
  addExpense,
  addExpenses,
  updateExpense,
  updateExpenses,
  replaceExpenseGroup,
  setExpensePaid,
  setParticipantPayment,
  deleteExpenses,
}: ExpensesSectionProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingGroup, setEditingGroup] =
    useState<ExpenseGroup | null>(null)
  const [form, setForm] =
    useState<ExpenseFormData>(() => createEmptyForm())

  const formRef =
    useRef<ExpenseFormData>(form)
  const [groupToDelete, setGroupToDelete] =
    useState<ExpenseGroup | null>(null)

  const {
    startDate = '',
    endDate = '',
    categoryFilter = 'all',
    paidByFilter = 'all',
    participantFilter = 'all',
    sortOption = 'newest',
  } = query ?? {}

  const expenseGroups = useMemo(
    () => createExpenseGroups(expenses),
    [expenses],
  )

  const visibleGroups = useMemo(() => {
    const filteredGroups = expenseGroups.filter((group) => {
      const expense = group.representative
      const groupDates = group.expenses.map((item) => item.date)
      const earliestDate = groupDates.reduce(
        (earliest, date) =>
          !earliest || date < earliest
            ? date
            : earliest,
        '',
      )
      const latestDate = groupDates.reduce(
        (latest, date) =>
          !latest || date > latest
            ? date
            : latest,
        '',
      )

      if (startDate && latestDate < startDate) {
        return false
      }

      if (endDate && earliestDate > endDate) {
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

    return [...filteredGroups].sort((a, b) => {
      if (sortOption === 'oldest') {
        return (
          new Date(a.representative.date).getTime() -
          new Date(b.representative.date).getTime()
        )
      }

      if (sortOption === 'highest') {
        return b.totalAmountInBRL - a.totalAmountInBRL
      }

      if (sortOption === 'lowest') {
        return a.totalAmountInBRL - b.totalAmountInBRL
      }

      return (
        new Date(b.representative.date).getTime() -
        new Date(a.representative.date).getTime()
      )
    })
  }, [
    expenseGroups,
    startDate,
    endDate,
    categoryFilter,
    paidByFilter,
    participantFilter,
    sortOption,
  ])

  function setCurrentForm(
    nextForm: ExpenseFormData,
  ) {
    formRef.current = nextForm
    setForm(nextForm)
  }

  function resetForm() {
    setCurrentForm(createEmptyForm())
    setEditingGroup(null)
    setShowForm(false)
  }

  function handleOpenCreate() {
    setCurrentForm(createEmptyForm())
    setEditingGroup(null)
    setShowForm(true)
  }

  function handleOpenEdit(expense: Expense) {
    const expenseGroup = expenseGroups.find(
      (group) => group.id === getExpenseGroupId(expense),
    )

    if (!expenseGroup) return

    const firstExpense = expenseGroup.expenses[0]

    setCurrentForm({
      title: getBaseTitle(firstExpense),
      category: firstExpense.category,
      amount: expenseGroup.totalAmount,
      currency: firstExpense.currency,
      exchangeRate: firstExpense.exchangeRate,
      amountInBRL: expenseGroup.totalAmountInBRL,
      paidBy: firstExpense.paidBy,
      participants: firstExpense.participants,
      date: firstExpense.date,
      competence: firstExpense.competence,
      installmentGroupId:
        firstExpense.installmentGroupId,
      installmentNumber: 1,
      installmentCount:
        expenseGroup.expenses.length > 1
          ? expenseGroup.expenses.length
          : firstExpense.installmentCount,
      participantPayments:
        firstExpense.participantPayments,
      paid: firstExpense.paid ?? false,
      paidAt: firstExpense.paidAt,
      notes: firstExpense.notes,
    })

    setEditingGroup(expenseGroup)
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
    const currentForm =
      formRef.current

    const updatedForm = {
      ...currentForm,
      [field]: value,
    }

    setCurrentForm({
      ...updatedForm,
      amountInBRL: calculateAmountInBRL(
        Number(updatedForm.amount),
        updatedForm.currency,
        Number(updatedForm.exchangeRate),
      ),
    })
  }

  function handleSave() {
    const currentForm =
      formRef.current

    const trimmedTitle =
      currentForm.title.trim()

    if (!trimmedTitle) return
    if (currentForm.amount <= 0) return
    if (
      currentForm.participants.length === 0
    ) {
      return
    }

    const competence =
      currentForm.competence ||
      currentForm.date.slice(0, 7)

    if (!competence) return

    if (editingGroup) {
      const originalInstallmentCount =
        editingGroup.expenses.length

      const nextInstallmentCount = Math.max(
        1,
        Math.trunc(
          currentForm.installmentCount ??
            originalInstallmentCount,
        ),
      )

      if (
        nextInstallmentCount !==
        originalInstallmentCount
      ) {
        const installmentAmounts = splitAmount(
          currentForm.amount,
          nextInstallmentCount,
        )

        const installmentGroupId =
          nextInstallmentCount > 1
            ? editingGroup.representative
                .installmentGroupId ??
              createInstallmentGroupId()
            : undefined

        const replacementExpenses =
          installmentAmounts.map(
            (installmentAmount, index) => {
              const installmentNumber = index + 1

              return {
                ...currentForm,
                title:
                  nextInstallmentCount > 1
                    ? `${trimmedTitle} (${installmentNumber}/${nextInstallmentCount})`
                    : trimmedTitle,
                amount: installmentAmount,
                amountInBRL: calculateAmountInBRL(
                  installmentAmount,
                  currentForm.currency,
                  currentForm.exchangeRate,
                ),
                competence: addMonthsToCompetence(
                  competence,
                  index,
                ),
                installmentGroupId,
                installmentNumber:
                  nextInstallmentCount > 1
                    ? installmentNumber
                    : undefined,
                installmentCount:
                  nextInstallmentCount > 1
                    ? nextInstallmentCount
                    : undefined,
                participantPayments: undefined,
                paid: false,
                paidAt: undefined,
              }
            },
          )

        replaceExpenseGroup(
          editingGroup.expenses.map(
            (expense) => expense.id,
          ),
          replacementExpenses,
        )

        resetForm()
        return
      }

      const installmentCount =
        originalInstallmentCount

      if (installmentCount === 1) {
        const originalExpense =
          editingGroup.expenses[0]

        updateExpense({
          id: originalExpense.id,
          ...currentForm,
          title: trimmedTitle,
          competence,
          installmentGroupId:
            originalExpense.installmentGroupId,
          installmentNumber:
            originalExpense.installmentNumber,
          installmentCount:
            originalExpense.installmentCount,
          participantPayments:
            originalExpense.participantPayments,
          paid: originalExpense.paid ?? false,
          paidAt: originalExpense.paidAt,
          amountInBRL: calculateAmountInBRL(
            currentForm.amount,
            currentForm.currency,
            currentForm.exchangeRate,
          ),
        })

        resetForm()
        return
      }

      const installmentAmounts = splitAmount(
        currentForm.amount,
        installmentCount,
      )

      const updatedInstallments =
        editingGroup.expenses.map(
          (originalExpense, index) => {
            const installmentNumber = index + 1
            const installmentAmount =
              installmentAmounts[index]

            return {
              id: originalExpense.id,
              ...currentForm,
              title: `${trimmedTitle} (${installmentNumber}/${installmentCount})`,
              amount: installmentAmount,
              amountInBRL: calculateAmountInBRL(
                installmentAmount,
                currentForm.currency,
                currentForm.exchangeRate,
              ),
              competence: addMonthsToCompetence(
                competence,
                index,
              ),
              installmentGroupId:
                originalExpense.installmentGroupId,
              installmentNumber,
              installmentCount,
              participantPayments:
                originalExpense.participantPayments,
              paid: originalExpense.paid ?? false,
              paidAt: originalExpense.paidAt,
            }
          },
        )

      updateExpenses(updatedInstallments)

      resetForm()
      return
    }

    const installmentCount = Math.max(
      1,
      Math.trunc(
        currentForm.installmentCount ?? 1,
      ),
    )

    if (installmentCount === 1) {
      addExpense({
        ...currentForm,
        title: trimmedTitle,
        competence,
        installmentGroupId: undefined,
        installmentNumber: undefined,
        installmentCount: undefined,
        amountInBRL: calculateAmountInBRL(
          currentForm.amount,
          currentForm.currency,
          currentForm.exchangeRate,
        ),
      })

      resetForm()
      return
    }

    const installmentGroupId =
      createInstallmentGroupId()

    const installmentAmounts =
      splitAmount(
        currentForm.amount,
        installmentCount,
      )

    const installments =
      installmentAmounts.map(
        (installmentAmount, index) => {
          const installmentNumber =
            index + 1

          return {
            ...currentForm,
            title: `${trimmedTitle} (${installmentNumber}/${installmentCount})`,
            amount: installmentAmount,
            amountInBRL:
              calculateAmountInBRL(
                installmentAmount,
                currentForm.currency,
                currentForm.exchangeRate,
              ),
            competence:
              addMonthsToCompetence(
                competence,
                index,
              ),
            installmentGroupId,
            installmentNumber,
            installmentCount,
          }
        },
      )

    addExpenses(installments)
    resetForm()
  }

  function handleSetGroupPaid(
    expense: Expense,
    paid: boolean,
  ) {
    const expenseGroup = expenseGroups.find(
      (group) => group.id === getExpenseGroupId(expense),
    )

    if (!expenseGroup) return

    expenseGroup.expenses.forEach((groupExpense) => {
      setExpensePaid(groupExpense.id, paid)
    })
  }

  function handleConfirmDelete() {
    if (!groupToDelete) return

    deleteExpenses(
      groupToDelete.expenses.map((expense) => expense.id),
    )

    setGroupToDelete(null)
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

      {showForm && !editingGroup && (
        <ExpenseForm
          form={form}
          isEditing={false}
          onChange={handleChange}
          onSave={handleSave}
          onCancel={resetForm}
        />
      )}

      {expenses.length === 0 ? (
        <div className="empty-state">
          <p>Nenhuma despesa cadastrada.</p>
        </div>
      ) : visibleGroups.length === 0 ? (
        <div className="empty-state">
          <p>Nenhuma despesa encontrada com estes filtros.</p>
        </div>
      ) : (
        <div className="expenses-list">
          {visibleGroups.map((group) => (
            <div key={group.id}>
              <ExpenseCard
                expense={group.representative}
                expenses={group.expenses}
                onEdit={handleOpenEdit}
                onMarkAsPaid={(expenseId) => {
                  const expense = group.expenses.find(
                    (item) => item.id === expenseId,
                  ) ?? group.representative

                  handleSetGroupPaid(expense, true)
                }}
                onUndoPayment={(expenseId) => {
                  const expense = group.expenses.find(
                    (item) => item.id === expenseId,
                  ) ?? group.representative

                  handleSetGroupPaid(expense, false)
                }}
                onSetParticipantPayment={
                  setParticipantPayment
                }
                onDelete={() => setGroupToDelete(group)}
              />

              {showForm && editingGroup?.id === group.id && (
                <ExpenseForm
                  form={form}
                  isEditing
                  onChange={handleChange}
                  onSave={handleSave}
                  onCancel={resetForm}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(groupToDelete)}
        title="Excluir compra?"
        message={
          groupToDelete
            ? `A compra "${groupToDelete.representative.title}" e todas as suas parcelas serão removidas do Financeiro.`
            : ''
        }
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setGroupToDelete(null)}
      />
    </section>
  )
}