import {
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  missionService,
  type MissionPayload,
} from '../services/MissionService'

import type {
  Mission,
  MissionCategory,
} from './missions'

type UseMissionStoreParams = {
  userId?: string
  expeditionId?: string
}

const initialMissionData: MissionPayload = {
  missions: [],
}

function normalizeMissionData(
  payload?: Partial<MissionPayload>,
): MissionPayload {
  return {
    missions: Array.isArray(payload?.missions)
      ? payload.missions
      : [],
  }
}

function createId() {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID()
  }

  return `mission-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`
}

export function useMissionStore({
  userId,
  expeditionId,
}: UseMissionStoreParams = {}) {
  const [missionData, setMissionData] =
    useState<MissionPayload>(
      initialMissionData,
    )

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  const missionDataRef =
    useRef<MissionPayload>(
      initialMissionData,
    )

  function updateLocalData(
    nextData: MissionPayload,
  ) {
    missionDataRef.current = nextData
    setMissionData(nextData)
  }

  useEffect(() => {
    let active = true

    async function loadMissionData() {
      if (!userId || !expeditionId) {
        if (active) {
          updateLocalData(
            initialMissionData,
          )
          setLoading(false)
        }

        return
      }

      setLoading(true)
      setError(null)

      try {
        const document =
          await missionService.get(
            expeditionId,
          )

        if (!active) {
          return
        }

        if (document) {
          updateLocalData(
            normalizeMissionData(
              document.payload,
            ),
          )
        } else {
          const createdDocument =
            await missionService.save(
              expeditionId,
              initialMissionData,
              userId,
            )

          if (active) {
            updateLocalData(
              normalizeMissionData(
                createdDocument.payload,
              ),
            )
          }
        }
      } catch (loadError) {
        console.error(
          'Erro ao carregar missões:',
          loadError,
        )

        if (active) {
          setError(
            'Não foi possível carregar as missões.',
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadMissionData()

    return () => {
      active = false
    }
  }, [userId, expeditionId])

  async function persistMissionData(
    nextData: MissionPayload,
  ) {
    if (!userId || !expeditionId) {
      return
    }

    const previousData =
      missionDataRef.current

    updateLocalData(nextData)
    setError(null)

    try {
      await missionService.save(
        expeditionId,
        nextData,
        userId,
      )
    } catch (saveError) {
      console.error(
        'Erro ao salvar missões:',
        saveError,
      )

      updateLocalData(previousData)

      setError(
        'Não foi possível salvar as missões.',
      )
    }
  }

  function createMission(
    title: string,
    category: MissionCategory = 'geral',
  ) {
    const trimmed = title.trim()

    if (!trimmed) {
      return
    }

    const mission: Mission = {
      id: createId(),
      title: trimmed,
      description: '',
      category,
      priority: 'média',
      status: 'todo',
      source: 'manual',
    }

    void persistMissionData({
      ...missionDataRef.current,
      missions: [
        mission,
        ...missionDataRef.current.missions,
      ],
    })
  }

  function addMission(
    mission: Mission,
  ) {
    void persistMissionData({
      ...missionDataRef.current,
      missions: [
        mission,
        ...missionDataRef.current.missions,
      ],
    })
  }

  function updateMission(
    id: string,
    data: Partial<Mission>,
  ) {
    void persistMissionData({
      ...missionDataRef.current,
      missions:
        missionDataRef.current.missions.map(
          (mission) =>
            mission.id === id
              ? {
                  ...mission,
                  ...data,
                }
              : mission,
        ),
    })
  }

  function removeMission(
    id: string,
  ) {
    void persistMissionData({
      ...missionDataRef.current,
      missions:
        missionDataRef.current.missions.filter(
          (mission) =>
            mission.id !== id,
        ),
    })
  }

  function toggleMission(
    id: string,
  ) {
    void persistMissionData({
      ...missionDataRef.current,
      missions:
        missionDataRef.current.missions.map(
          (mission) =>
            mission.id === id
              ? {
                  ...mission,
                  status:
                    mission.status === 'done'
                      ? 'todo'
                      : 'done',
                }
              : mission,
        ),
    })
  }

  return {
    missions: missionData.missions,
    loading,
    error,
    createMission,
    addMission,
    updateMission,
    removeMission,
    toggleMission,
  }
}