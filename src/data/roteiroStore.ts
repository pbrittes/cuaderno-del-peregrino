import {
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  roteiroService,
  type RoteiroPayload,
} from '../services/RoteiroService'

export type RoteiroStatus =
  | 'planned'
  | 'completed'

export type RoteiroItem = {
  id: string
  date: string
  city: string
  summary: string
  overnightCity: string
  notes: string
  status: RoteiroStatus
}

export type CreateRoteiroItemInput = Omit<
  RoteiroItem,
  | 'id'
  | 'status'
>

type UseRoteiroStoreParams = {
  userId?: string
  expeditionId?: string
}

const initialRoteiroData: RoteiroPayload = {
  items: [],
}

function createId() {
  return `itinerary-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`
}

function sortItems(items: RoteiroItem[]) {
  return [...items].sort((a, b) => {
    const dateComparison = a.date.localeCompare(b.date)

    if (dateComparison !== 0) {
      return dateComparison
    }

    return a.city.localeCompare(b.city, 'pt-BR')
  })
}

function normalizeRoteiroData(
  payload?: Partial<RoteiroPayload>,
): RoteiroPayload {
  return {
    items: Array.isArray(payload?.items)
      ? sortItems(payload.items)
      : [],
  }
}

export function useRoteiroStore({
  userId,
  expeditionId,
}: UseRoteiroStoreParams = {}) {
  const [roteiroData, setRoteiroData] =
    useState<RoteiroPayload>(initialRoteiroData)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  const roteiroDataRef =
    useRef<RoteiroPayload>(initialRoteiroData)

  function updateLocalData(
    nextData: RoteiroPayload,
  ) {
    const normalizedData =
      normalizeRoteiroData(nextData)

    roteiroDataRef.current = normalizedData
    setRoteiroData(normalizedData)
  }

  useEffect(() => {
    let active = true

    async function loadRoteiroData() {
      if (!userId || !expeditionId) {
        if (active) {
          updateLocalData(initialRoteiroData)
          setLoading(false)
        }

        return
      }

      setLoading(true)
      setError(null)

      try {
        const document =
          await roteiroService.get(expeditionId)

        if (!active) {
          return
        }

        if (document) {
          updateLocalData(
            normalizeRoteiroData(
              document.payload,
            ),
          )
        } else {
          const createdDocument =
            await roteiroService.save(
              expeditionId,
              initialRoteiroData,
              userId,
            )

          if (active) {
            updateLocalData(
              normalizeRoteiroData(
                createdDocument.payload,
              ),
            )
          }
        }
      } catch (loadError) {
        console.error(
          'Erro ao carregar o roteiro:',
          loadError,
        )

        if (active) {
          setError(
            'Não foi possível carregar o roteiro.',
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadRoteiroData()

    return () => {
      active = false
    }
  }, [userId, expeditionId])

  async function persistRoteiroData(
    nextData: RoteiroPayload,
  ) {
    if (!userId || !expeditionId) {
      return
    }

    const previousData =
      roteiroDataRef.current

    const normalizedData =
      normalizeRoteiroData(nextData)

    updateLocalData(normalizedData)
    setError(null)

    try {
      await roteiroService.save(
        expeditionId,
        normalizedData,
        userId,
      )
    } catch (saveError) {
      console.error(
        'Erro ao salvar o roteiro:',
        saveError,
      )

      updateLocalData(previousData)

      setError(
        'Não foi possível salvar o roteiro.',
      )
    }
  }

  function addItem(
    item: CreateRoteiroItemInput,
  ) {
    const newItem: RoteiroItem = {
      id: createId(),
      status: 'planned',
      ...item,
    }

    void persistRoteiroData({
      items: [
        ...roteiroDataRef.current.items,
        newItem,
      ],
    })
  }

  function updateItem(
    updatedItem: RoteiroItem,
  ) {
    void persistRoteiroData({
      items: roteiroDataRef.current.items.map(
        (item) =>
          item.id === updatedItem.id
            ? updatedItem
            : item,
      ),
    })
  }

  function completeItem(itemId: string) {
    void persistRoteiroData({
      items: roteiroDataRef.current.items.map(
        (item) =>
          item.id === itemId
            ? {
                ...item,
                status: 'completed',
              }
            : item,
      ),
    })
  }

  function reopenItem(itemId: string) {
    void persistRoteiroData({
      items: roteiroDataRef.current.items.map(
        (item) =>
          item.id === itemId
            ? {
                ...item,
                status: 'planned',
              }
            : item,
      ),
    })
  }

  function deleteItem(itemId: string) {
    void persistRoteiroData({
      items: roteiroDataRef.current.items.filter(
        (item) => item.id !== itemId,
      ),
    })
  }

  return {
    items: roteiroData.items,
    loading,
    error,
    addItem,
    updateItem,
    completeItem,
    reopenItem,
    deleteItem,
  }
}