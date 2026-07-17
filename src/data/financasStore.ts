import {
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  financeService,
  type FinancePayload,
} from '../services/FinanceService'

import type { Expense } from './financas'

type CreateExpenseInput = Omit<Expense, 'id'>

type UseFinancasStoreParams = {
  userId?: string
  expeditionId?: string
}

const initialFinanceData: FinancePayload = {
  expenses: [],
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`
}

function normalizeFinanceData(
  payload?: Partial<FinancePayload>,
): FinancePayload {
  return {
    expenses: Array.isArray(payload?.expenses)
      ? payload.expenses
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
    financeDataRef.current = nextData
    setFinanceData(nextData)
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
    if (!userId || !expeditionId) {
      return
    }

    const previousData =
      financeDataRef.current

    updateLocalData(nextData)
    setError(null)

    try {
      await financeService.save(
        expeditionId,
        nextData,
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

  function addExpense(
    expense: CreateExpenseInput,
  ) {
    const newExpense: Expense = {
      id: createId('expense'),
      ...expense,
    }

    void persistFinanceData({
      ...financeDataRef.current,
      expenses: [
        ...financeDataRef.current.expenses,
        newExpense,
      ],
    })
  }

  function updateExpense(
    updatedExpense: Expense,
  ) {
    void persistFinanceData({
      ...financeDataRef.current,
      expenses:
        financeDataRef.current.expenses.map(
          (expense) =>
            expense.id ===
            updatedExpense.id
              ? updatedExpense
              : expense,
        ),
    })
  }

  function deleteExpense(
    expenseId: string,
  ) {
    void persistFinanceData({
      ...financeDataRef.current,
      expenses:
        financeDataRef.current.expenses.filter(
          (expense) =>
            expense.id !== expenseId,
        ),
    })
  }

  return {
    expenses: financeData.expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
  }
}