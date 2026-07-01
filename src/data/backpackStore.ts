import { useEffect, useState } from 'react'
import { gearItems, type GearItem, type GearStatus, type Pilgrim } from './backpacks'

const STORAGE_KEY = 'cuaderno-backpack-items'

export function useBackpackItems() {
  const [items, setItems] = useState<GearItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (!saved) {
      return gearItems
    }

    try {
      return JSON.parse(saved) as GearItem[]
    } catch {
      return gearItems
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  function updateStatus(itemId: string, pilgrim: Pilgrim, status: GearStatus) {
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

  return {
    items,
    updateStatus,
  }
}