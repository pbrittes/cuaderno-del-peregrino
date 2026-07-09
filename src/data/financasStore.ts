import { useEffect, useState } from 'react'

import type { Expense } from './financas'

type CreateExpenseInput = Omit<Expense, 'id'>

type FinanceData = {
  expenses: Expense[]
}

const STORAGE_KEY = 'cuaderno-financas'

const initialFinanceData: FinanceData = {
  expenses: [],
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function loadFinanceData(): FinanceData {
  if (typeof window === 'undefined') {
    return initialFinanceData
  }

  try {
    const storedData = window.localStorage.getItem(STORAGE_KEY)

    if (!storedData) {
      return initialFinanceData
    }

    const parsedData = JSON.parse(storedData) as Partial<FinanceData>

    return {
      expenses: Array.isArray(parsedData.expenses)
        ? parsedData.expenses
        : [],
    }
  } catch (error) {
    console.error('Erro ao carregar dados financeiros:', error)
    return initialFinanceData
  }
}

function saveFinanceData(data: FinanceData) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Erro ao salvar dados financeiros:', error)
  }
}

export function useFinancasStore() {
  const [financeData, setFinanceData] = useState<FinanceData>(() =>
    loadFinanceData(),
  )

  useEffect(() => {
    saveFinanceData(financeData)
  }, [financeData])

  function addExpense(expense: CreateExpenseInput) {
    const newExpense: Expense = {
      id: createId('expense'),
      ...expense,
    }

    setFinanceData((currentData) => ({
      ...currentData,
      expenses: [...currentData.expenses, newExpense],
    }))
  }

  function updateExpense(updatedExpense: Expense) {
    setFinanceData((currentData) => ({
      ...currentData,
      expenses: currentData.expenses.map((expense) =>
        expense.id === updatedExpense.id ? updatedExpense : expense,
      ),
    }))
  }

  function deleteExpense(expenseId: string) {
    setFinanceData((currentData) => ({
      ...currentData,
      expenses: currentData.expenses.filter(
        (expense) => expense.id !== expenseId,
      ),
    }))
  }

  return {
    expenses: financeData.expenses,
    addExpense,
    updateExpense,
    deleteExpense,
  }
}