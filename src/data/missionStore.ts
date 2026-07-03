import { useEffect, useState } from 'react'
import { initialMissions, type Mission } from './missions'

const STORAGE_KEY = 'cuaderno-missions'

export function useMissionStore() {
  const [missions, setMissions] = useState<Mission[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (!saved) {
      return initialMissions
    }

    try {
      return JSON.parse(saved) as Mission[]
    } catch {
      return initialMissions
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(missions))
  }, [missions])

  function createMission(title: string) {
    const trimmed = title.trim()

    if (!trimmed) return

    const mission: Mission = {
      id: crypto.randomUUID(),
      title: trimmed,
      description: '',
      category: 'geral',
      priority: 'média',
      status: 'todo',
      source: 'manual',
    }

    setMissions((current) => [...current, mission])
  }

  function addMission(mission: Mission) {
    setMissions((current) => [...current, mission])
  }

  function updateMission(id: string, data: Partial<Mission>) {
    setMissions((current) =>
      current.map((mission) =>
        mission.id === id
          ? { ...mission, ...data }
          : mission,
      ),
    )
  }

  function removeMission(id: string) {
    setMissions((current) =>
      current.filter((mission) => mission.id !== id),
    )
  }

  function toggleMission(id: string) {
    setMissions((current) =>
      current.map((mission) =>
        mission.id === id
          ? {
              ...mission,
              status: mission.status === 'done' ? 'todo' : 'done',
            }
          : mission,
      ),
    )
  }

  return {
    missions,
    createMission,
    addMission,
    updateMission,
    removeMission,
    toggleMission,
  }
}