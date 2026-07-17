import {
  useEffect,
  useState,
} from 'react'

import {
  gearItems,
  type GearCategory,
  type GearItem,
  type GearStatus,
  type Pilgrim,
} from './backpacks'

import { backpackService } from '../services/BackpackService'

const STORAGE_KEY = 'cuaderno-backpack-items'

type UseBackpackItemsOptions = {
  userId?: string | null
  expeditionId?: string | null
}

export type BackpackItemOwner =
  | Pilgrim
  | 'Todas'

type AddBackpackItemInput = {
  name: string
  category: GearCategory
  weight: number
  owner: BackpackItemOwner
}

type UpdateBackpackItemInput = {
  name: string
  category: GearCategory
  weight: number
  owner: BackpackItemOwner
}

function getLocalItems(): GearItem[] {
  const saved = localStorage.getItem(STORAGE_KEY)

  if (!saved) {
    return gearItems
  }

  try {
    return JSON.parse(saved) as GearItem[]
  } catch {
    return gearItems
  }
}

function createItemId() {
  return `custom-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`
}

function getUpdatedCustomStatus(
  item: GearItem,
  owner: BackpackItemOwner,
): Record<Pilgrim, GearStatus> {
  const isForEveryone = owner === 'Todas'

  return {
    Pri:
      isForEveryone || owner === 'Pri'
        ? item.status.Pri === 'dispensado'
          ? 'comprar'
          : item.status.Pri
        : 'dispensado',
    Tan:
      isForEveryone || owner === 'Tan'
        ? item.status.Tan === 'dispensado'
          ? 'comprar'
          : item.status.Tan
        : 'dispensado',
    Deia:
      isForEveryone || owner === 'Deia'
        ? item.status.Deia === 'dispensado'
          ? 'comprar'
          : item.status.Deia
        : 'dispensado',
  }
}

export function useBackpackItems({
  userId = null,
  expeditionId = null,
}: UseBackpackItemsOptions = {}) {
  const [items, setItems] =
    useState<GearItem[]>(getLocalItems)

  const [loading, setLoading] = useState(true)

  const [cloudEnabled, setCloudEnabled] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadSharedBackpack() {
      if (!userId || !expeditionId) {
        if (active) {
          setCloudEnabled(false)
          setLoading(false)
        }

        return
      }

      setLoading(true)
      setError(null)

      try {
        const document =
          await backpackService.get(
            expeditionId,
          )

        if (!active) return

        if (document) {
          const sharedItems =
            document.payload.items ?? []

          setItems(sharedItems)
          setCloudEnabled(true)
        } else {
          setCloudEnabled(false)
        }
      } catch (loadError) {
        if (!active) return

        console.error(
          'Erro ao carregar a Mochila compartilhada:',
          loadError,
        )

        setError(
          'Não foi possível carregar a Mochila compartilhada.',
        )

        setCloudEnabled(false)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadSharedBackpack()

    return () => {
      active = false
    }
  }, [expeditionId, userId])

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items),
    )
  }, [items])

  useEffect(() => {
    if (
      !cloudEnabled ||
      !userId ||
      !expeditionId ||
      loading
    ) {
      return
    }

    const currentUserId = userId
    const currentExpeditionId = expeditionId

    async function saveSharedBackpack() {
      try {
        setError(null)

        await backpackService.save(
          currentExpeditionId,
          items,
          currentUserId,
        )
      } catch (saveError) {
        console.error(
          'Erro ao salvar a Mochila compartilhada:',
          saveError,
        )

        setError(
          'Não foi possível salvar a Mochila compartilhada.',
        )
      }
    }

    void saveSharedBackpack()
  }, [
    cloudEnabled,
    expeditionId,
    items,
    loading,
    userId,
  ])

  async function migrateToSharedBackpack() {
    if (!userId || !expeditionId) {
      throw new Error(
        'Usuária ou expedição não disponível.',
      )
    }

    const currentUserId = userId
    const currentExpeditionId = expeditionId

    setLoading(true)
    setError(null)

    try {
      const existingDocument =
        await backpackService.get(
          currentExpeditionId,
        )

      if (existingDocument) {
        throw new Error(
          'Já existe uma Mochila compartilhada. A migração local foi interrompida para evitar sobrescrever dados.',
        )
      }

      await backpackService.save(
        currentExpeditionId,
        items,
        currentUserId,
      )

      setCloudEnabled(true)
    } catch (migrationError) {
      console.error(
        'Erro ao migrar a Mochila:',
        migrationError,
      )

      setError(
        migrationError instanceof Error
          ? migrationError.message
          : 'Não foi possível migrar a Mochila.',
      )

      throw migrationError
    } finally {
      setLoading(false)
    }
  }

  function updateStatus(
    itemId: string,
    pilgrim: Pilgrim,
    status: GearStatus,
  ) {
    setItems((current) =>
      current.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: {
                ...item.status,
                [pilgrim]: status,
              },
            }
          : item,
      ),
    )
  }

  function addItem({
    name,
    category,
    weight,
    owner,
  }: AddBackpackItemInput) {
    const isForEveryone =
      owner === 'Todas'

    const newItem: GearItem = {
      id: createItemId(),
      name: name.trim(),
      quantity: 1,
      category,
      weight,
      owner: isForEveryone
        ? undefined
        : owner,
      custom: true,
      status: {
        Pri:
          isForEveryone ||
          owner === 'Pri'
            ? 'comprar'
            : 'dispensado',
        Tan:
          isForEveryone ||
          owner === 'Tan'
            ? 'comprar'
            : 'dispensado',
        Deia:
          isForEveryone ||
          owner === 'Deia'
            ? 'comprar'
            : 'dispensado',
      },
    }

    setItems((current) => [
      ...current,
      newItem,
    ])
  }

  function removeItem(itemId: string) {
    setItems((current) =>
      current.filter(
        (item) => item.id !== itemId,
      ),
    )
  }

  function updateItem(
    itemId: string,
    {
      name,
      category,
      weight,
      owner,
    }: UpdateBackpackItemInput,
  ) {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== itemId) {
          return item
        }

        if (!item.custom) {
          return {
            ...item,
            weight,
          }
        }

        return {
          ...item,
          name: name.trim(),
          category,
          weight,
          owner:
            owner === 'Todas'
              ? undefined
              : owner,
          status: getUpdatedCustomStatus(
            item,
            owner,
          ),
        }
      }),
    )
  }

  return {
    items,
    loading,
    error,
    cloudEnabled,
    updateStatus,
    addItem,
    updateItem,
    removeItem,
    migrateToSharedBackpack,
  }
}