import { useEffect, useState } from 'react'

import type {
  BudgetItem,
  BudgetItemData,
} from './orcamento'

const STORAGE_KEY = 'cuaderno-budget-items'

function createBudgetItemId(
  gearItemId: string,
  pilgrim: string,
) {
  return `budget-${gearItemId}-${pilgrim.toLowerCase()}`
}

function loadBudgetItems(): BudgetItem[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const savedItems = window.localStorage.getItem(STORAGE_KEY)

    if (!savedItems) {
      return []
    }

    const parsedItems = JSON.parse(savedItems)

    return Array.isArray(parsedItems)
      ? (parsedItems as BudgetItem[])
      : []
  } catch (error) {
    console.error(
      'Erro ao carregar o orçamento da mochila:',
      error,
    )

    return []
  }
}

function saveBudgetItems(items: BudgetItem[]) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items),
    )
  } catch (error) {
    console.error(
      'Erro ao salvar o orçamento da mochila:',
      error,
    )
  }
}

export function useOrcamentoStore() {
  const [budgetItems, setBudgetItems] =
    useState<BudgetItem[]>(loadBudgetItems)

  useEffect(() => {
    saveBudgetItems(budgetItems)
  }, [budgetItems])

  function saveBudgetItem(itemData: BudgetItemData) {
    setBudgetItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) =>
          item.gearItemId === itemData.gearItemId &&
          item.pilgrim === itemData.pilgrim,
      )

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === existingItem.id
            ? {
                ...item,
                ...itemData,
              }
            : item,
        )
      }

      const newItem: BudgetItem = {
        id: createBudgetItemId(
          itemData.gearItemId,
          itemData.pilgrim,
        ),
        ...itemData,
      }

      return [...currentItems, newItem]
    })
  }

  function getBudgetItem(
    gearItemId: string,
    pilgrim: BudgetItem['pilgrim'],
  ) {
    return budgetItems.find(
      (item) =>
        item.gearItemId === gearItemId &&
        item.pilgrim === pilgrim,
    )
  }

  return {
    budgetItems,
    saveBudgetItem,
    getBudgetItem,
  }
}