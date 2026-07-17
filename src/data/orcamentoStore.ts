import {
  useEffect,
  useState,
} from 'react'

import type {
  BudgetItem,
  BudgetItemData,
} from './orcamento'

import { sharedDocumentService } from '../services/SharedDocumentService'

type UseOrcamentoStoreOptions = {
  userId?: string | null
  expeditionId?: string | null
}

type BudgetPayload = {
  items: BudgetItem[]
}

function createBudgetItemId(
  gearItemId: string,
  pilgrim: string,
) {
  return `budget-${gearItemId}-${pilgrim.toLowerCase()}`
}

export function useOrcamentoStore({
  userId = null,
  expeditionId = null,
}: UseOrcamentoStoreOptions = {}) {
  const [budgetItems, setBudgetItems] =
    useState<BudgetItem[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  const [cloudReady, setCloudReady] =
    useState(false)

  useEffect(() => {
    let active = true

    async function loadBudget() {
      if (!userId || !expeditionId) {
        if (active) {
          setLoading(false)
          setCloudReady(false)
        }

        return
      }

      setLoading(true)
      setError(null)

      try {
        const document =
          await sharedDocumentService.getOrCreate<BudgetPayload>(
            expeditionId,
            'budget',
            {
              items: [],
            },
            userId,
          )

        if (!active) return

        setBudgetItems(
          document.payload.items ?? [],
        )

        setCloudReady(true)
      } catch (loadError) {
        if (!active) return

        console.error(
          'Erro ao carregar o orçamento compartilhado:',
          loadError,
        )

        setError(
          'Não foi possível carregar o orçamento compartilhado.',
        )

        setCloudReady(false)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadBudget()

    return () => {
      active = false
    }
  }, [expeditionId, userId])

  useEffect(() => {
    if (
      !cloudReady ||
      !userId ||
      !expeditionId ||
      loading
    ) {
      return
    }

    const currentUserId = userId
    const currentExpeditionId =
      expeditionId

    async function saveBudget() {
      try {
        setError(null)

        await sharedDocumentService.save<BudgetPayload>(
          currentExpeditionId,
          'budget',
          {
            items: budgetItems,
          },
          currentUserId,
        )
      } catch (saveError) {
        console.error(
          'Erro ao salvar o orçamento compartilhado:',
          saveError,
        )

        setError(
          'Não foi possível salvar o orçamento compartilhado.',
        )
      }
    }

    void saveBudget()
  }, [
    budgetItems,
    cloudReady,
    expeditionId,
    loading,
    userId,
  ])

  function saveBudgetItem(
    itemData: BudgetItemData,
  ) {
    setBudgetItems((currentItems) => {
      const existingItem =
        currentItems.find(
          (item) =>
            item.gearItemId ===
              itemData.gearItemId &&
            item.pilgrim ===
              itemData.pilgrim,
        )

      if (existingItem) {
        return currentItems.map(
          (item) =>
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

      return [
        ...currentItems,
        newItem,
      ]
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
    loading,
    error,
    saveBudgetItem,
    getBudgetItem,
  }
}