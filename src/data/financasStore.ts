import {
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  financeService,
  type FinancePayload,
} from '../services/FinanceService'

import type {
  Expense,
  ParticipantPayments,
  Pilgrim,
  Settlement,
} from './financas'

type CreateExpenseInput = Omit<Expense, 'id'>

type CreateSettlementInput = Omit<
  Settlement,
  'id'
>

type UseFinancasStoreParams = {
  userId?: string
  expeditionId?: string
}

const initialFinanceData: FinancePayload = {
  expenses: [],
  settlements: [],
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`
}

function getCompetenceFromDate(date: string) {
  return date.slice(0, 7)
}

function normalizeParticipantPayments(
  expense: Expense,
): ParticipantPayments | undefined {
  if (expense.participantPayments) {
    return expense.participantPayments
  }

  if (!expense.paid) {
    return undefined
  }

  return expense.participants.reduce<ParticipantPayments>(
    (payments, participant) => {
      payments[participant] = {
        paid: true,
        paidAt: expense.paidAt,
      }

      return payments
    },
    {},
  )
}

function normalizeExpense(
  expense: Expense,
): Expense {
  const participantPayments =
    normalizeParticipantPayments(expense)

  const allParticipantsPaid =
    expense.participants.length > 0 &&
    expense.participants.every(
      (participant) =>
        participantPayments?.[participant]
          ?.paid === true,
    )

  const paid =
    expense.paid === true ||
    allParticipantsPaid

  const paidAt =
    paid
      ? expense.paidAt ||
        expense.participants
          .map(
            (participant) =>
              participantPayments?.[participant]
                ?.paidAt,
          )
          .filter(
            (date): date is string =>
              Boolean(date),
          )
          .sort()
          .at(-1)
      : undefined

  return {
    ...expense,
    competence:
      expense.competence ||
      getCompetenceFromDate(expense.date),
    participantPayments,
    paid,
    paidAt,
  }
}

function normalizeFinanceData(
  payload?: Partial<FinancePayload>,
): FinancePayload {
  return {
    expenses: Array.isArray(payload?.expenses)
      ? payload.expenses.map(normalizeExpense)
      : [],
    settlements: Array.isArray(
      payload?.settlements,
    )
      ? payload.settlements
      : [],
  }
}

export function useFinancasStore({
  userId,
  expeditionId,
}: UseFinancasStoreParams = {}) {
  const [financeData, setFinanceData] =
    useState<FinancePayload>(
      initialFinanceData,
    )

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  const financeDataRef =
    useRef<FinancePayload>(
      initialFinanceData,
    )

  function updateLocalData(
    nextData: FinancePayload,
  ) {
    const normalizedData =
      normalizeFinanceData(nextData)

    financeDataRef.current =
      normalizedData

    setFinanceData(normalizedData)
  }

  useEffect(() => {
    let active = true

    async function loadFinanceData() {
      if (!userId || !expeditionId) {
        if (active) {
          updateLocalData(
            initialFinanceData,
          )

          setLoading(false)
        }

        return
      }

      setLoading(true)
      setError(null)

      try {
        const document =
          await financeService.get(
            expeditionId,
          )

        if (!active) {
          return
        }

        if (document) {
          updateLocalData(
            normalizeFinanceData(
              document.payload,
            ),
          )
        } else {
          const createdDocument =
            await financeService.save(
              expeditionId,
              initialFinanceData,
              userId,
            )

          if (active) {
            updateLocalData(
              normalizeFinanceData(
                createdDocument.payload,
              ),
            )
          }
        }
      } catch (loadError) {
        console.error(
          'Erro ao carregar dados financeiros:',
          loadError,
        )

        if (active) {
          setError(
            'Não foi possível carregar os dados financeiros.',
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadFinanceData()

    return () => {
      active = false
    }
  }, [userId, expeditionId])

  async function persistFinanceData(
    nextData: FinancePayload,
  ) {
    const normalizedData =
      normalizeFinanceData(nextData)

    if (!userId || !expeditionId) {
      updateLocalData(normalizedData)
      return
    }

    const previousData =
      financeDataRef.current

    updateLocalData(normalizedData)
    setError(null)

    try {
      await financeService.save(
        expeditionId,
        normalizedData,
        userId,
      )
    } catch (saveError) {
      console.error(
        'Erro ao salvar dados financeiros:',
        saveError,
      )

      updateLocalData(previousData)

      setError(
        'Não foi possível salvar os dados financeiros.',
      )
    }
  }

  function createExpense(
    expense: CreateExpenseInput,
  ): Expense {
    return normalizeExpense({
      id: createId('expense'),
      ...expense,
      paid: expense.paid ?? false,
      paidAt:
        expense.paid === true
          ? expense.paidAt
          : undefined,
    })
  }

  function addExpense(
    expense: CreateExpenseInput,
  ) {
    const newExpense =
      createExpense(expense)

    void persistFinanceData({
      ...financeDataRef.current,
      expenses: [
        ...financeDataRef.current
          .expenses,
        newExpense,
      ],
    })
  }

  function addExpenses(
    expenses: CreateExpenseInput[],
  ) {
    if (expenses.length === 0) {
      return
    }

    const newExpenses =
      expenses.map(createExpense)

    void persistFinanceData({
      ...financeDataRef.current,
      expenses: [
        ...financeDataRef.current
          .expenses,
        ...newExpenses,
      ],
    })
  }

  function updateExpense(
    updatedExpense: Expense,
  ) {
    updateExpenses([updatedExpense])
  }

  function updateExpenses(
    updatedExpenses: Expense[],
  ) {
    if (updatedExpenses.length === 0) {
      return
    }

    const updates = new Map(
      updatedExpenses.map((expense) => {
        const normalizedExpense =
          normalizeExpense(expense)

        return [
          normalizedExpense.id,
          normalizedExpense,
        ] as const
      }),
    )

    void persistFinanceData({
      ...financeDataRef.current,
      expenses:
        financeDataRef.current.expenses.map(
          (expense) =>
            updates.get(expense.id) ?? expense,
        ),
    })
  }

  function setExpensePaid(
    expenseId: string,
    paid: boolean,
    paidAt?: string,
  ) {
    void persistFinanceData({
      ...financeDataRef.current,
      expenses:
        financeDataRef.current.expenses.map(
          (expense) => {
            if (
              expense.id !== expenseId
            ) {
              return expense
            }

            const paymentDate =
              paid
                ? paidAt ||
                  new Date()
                    .toISOString()
                    .slice(0, 10)
                : undefined

            const participantPayments =
              expense.participants.reduce<ParticipantPayments>(
                (
                  payments,
                  participant,
                ) => {
                  payments[participant] = {
                    paid,
                    paidAt: paymentDate,
                  }

                  return payments
                },
                {},
              )

            return normalizeExpense({
              ...expense,
              participantPayments,
              paid,
              paidAt: paymentDate,
            })
          },
        ),
    })
  }

  function setParticipantPayment(
    expenseId: string,
    participant: Pilgrim,
    paid: boolean,
    paidAt?: string,
  ) {
    void persistFinanceData({
      ...financeDataRef.current,
      expenses:
        financeDataRef.current.expenses.map(
          (expense) => {
            if (
              expense.id !== expenseId ||
              !expense.participants.includes(
                participant,
              )
            ) {
              return expense
            }

            const paymentDate =
              paid
                ? paidAt ||
                  new Date()
                    .toISOString()
                    .slice(0, 10)
                : undefined

            const participantPayments: ParticipantPayments = {
              ...expense.participantPayments,
              [participant]: {
                paid,
                paidAt: paymentDate,
              },
            }

            return normalizeExpense({
              ...expense,
              participantPayments,
              paid: false,
              paidAt: undefined,
            })
          },
        ),
    })
  }

  function deleteExpense(
    expenseId: string,
  ) {
    deleteExpenses([expenseId])
  }

  function deleteExpenses(
    expenseIds: string[],
  ) {
    if (expenseIds.length === 0) {
      return
    }

    const ids = new Set(expenseIds)

    void persistFinanceData({
      ...financeDataRef.current,
      expenses:
        financeDataRef.current.expenses.filter(
          (expense) => !ids.has(expense.id),
        ),
    })
  }

  function createSettlement(
    settlement: CreateSettlementInput,
  ): Settlement {
    return {
      id: createId('settlement'),
      ...settlement,
    }
  }

  function addSettlement(
    settlement: CreateSettlementInput,
  ) {
    const newSettlement =
      createSettlement(settlement)

    void persistFinanceData({
      ...financeDataRef.current,
      settlements: [
        ...financeDataRef.current
          .settlements,
        newSettlement,
      ],
    })
  }

  function updateSettlement(
    updatedSettlement: Settlement,
  ) {
    void persistFinanceData({
      ...financeDataRef.current,
      settlements:
        financeDataRef.current.settlements.map(
          (settlement) =>
            settlement.id ===
            updatedSettlement.id
              ? updatedSettlement
              : settlement,
        ),
    })
  }

  function deleteSettlement(
    settlementId: string,
  ) {
    void persistFinanceData({
      ...financeDataRef.current,
      settlements:
        financeDataRef.current.settlements.filter(
          (settlement) =>
            settlement.id !==
            settlementId,
        ),
    })
  }

  return {
    expenses: financeData.expenses,
    settlements:
      financeData.settlements,
    loading,
    error,
    addExpense,
    addExpenses,
    updateExpense,
    updateExpenses,
    setExpensePaid,
    setParticipantPayment,
    deleteExpense,
    deleteExpenses,
    addSettlement,
    updateSettlement,
    deleteSettlement,
  }
}