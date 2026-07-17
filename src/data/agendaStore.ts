import {
  useEffect,
  useState,
} from 'react'

import {
  agendaEvents,
  type AgendaEvent,
} from './agenda'

import { agendaService } from '../services/AgendaService'

const STORAGE_KEY = 'cuaderno-agenda-events'

type UseAgendaStoreOptions = {
  userId?: string | null
  expeditionId?: string | null
}

function getLocalEvents(): AgendaEvent[] {
  const saved = localStorage.getItem(STORAGE_KEY)

  if (!saved) {
    return agendaEvents
  }

  try {
    return JSON.parse(saved) as AgendaEvent[]
  } catch {
    return agendaEvents
  }
}

export function useAgendaStore({
  userId = null,
  expeditionId = null,
}: UseAgendaStoreOptions = {}) {
  const [events, setEvents] =
    useState<AgendaEvent[]>(getLocalEvents)

  const [loading, setLoading] = useState(true)

  const [cloudEnabled, setCloudEnabled] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadSharedAgenda() {
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
        const document = await agendaService.get(
          expeditionId,
        )

        if (!active) return

        if (document) {
          const sharedEvents =
            document.payload.events ?? []

          setEvents(sharedEvents)
          setCloudEnabled(true)
        } else {
          setCloudEnabled(false)
        }
      } catch (loadError) {
        if (!active) return

        console.error(
          'Erro ao carregar a Agenda compartilhada:',
          loadError,
        )

        setError(
          'Não foi possível carregar a Agenda compartilhada.',
        )

        setCloudEnabled(false)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadSharedAgenda()

    return () => {
      active = false
    }
  }, [expeditionId, userId])

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(events),
    )
  }, [events])

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

    async function saveSharedAgenda() {
      try {
        setError(null)

        await agendaService.save(
          currentExpeditionId,
          events,
          currentUserId,
        )
      } catch (saveError) {
        console.error(
          'Erro ao salvar a Agenda compartilhada:',
          saveError,
        )

        setError(
          'Não foi possível salvar a Agenda compartilhada.',
        )
      }
    }

    void saveSharedAgenda()
  }, [
    cloudEnabled,
    events,
    expeditionId,
    loading,
    userId,
  ])

  async function migrateToSharedAgenda() {
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
        await agendaService.get(
          currentExpeditionId,
        )

      if (existingDocument) {
        throw new Error(
          'Já existe uma Agenda compartilhada. A migração local foi interrompida para evitar sobrescrever dados.',
        )
      }

      await agendaService.save(
        currentExpeditionId,
        events,
        currentUserId,
      )

      setCloudEnabled(true)
    } catch (migrationError) {
      console.error(
        'Erro ao migrar a Agenda:',
        migrationError,
      )

      setError(
        migrationError instanceof Error
          ? migrationError.message
          : 'Não foi possível migrar a Agenda.',
      )

      throw migrationError
    } finally {
      setLoading(false)
    }
  }

  function createEvent(
    title: string,
    date: string,
    type: AgendaEvent['type'],
    people: AgendaEvent['people'],
  ) {
    if (
      !title.trim() ||
      !date ||
      people.length === 0
    ) {
      return
    }

    const event: AgendaEvent = {
      id: crypto.randomUUID(),
      title: title.trim(),
      date,
      type,
      people,
      status: 'pendente',
      completed: false,
    }

    setEvents((current) =>
      [...current, event].sort((a, b) =>
        a.date.localeCompare(b.date),
      ),
    )
  }

  function addEvent(event: AgendaEvent) {
    setEvents((current) =>
      [...current, event].sort((a, b) =>
        a.date.localeCompare(b.date),
      ),
    )
  }

  function updateEvent(
    id: string,
    data: Partial<AgendaEvent>,
  ) {
    setEvents((current) =>
      current
        .map((event) =>
          event.id === id
            ? {
                ...event,
                ...data,
              }
            : event,
        )
        .sort((a, b) =>
          a.date.localeCompare(b.date),
        ),
    )
  }

  function completeEvent(id: string) {
    updateEvent(id, {
      completed: true,
    })
  }

  function reopenEvent(id: string) {
    updateEvent(id, {
      completed: false,
    })
  }

  function removeEvent(id: string) {
    setEvents((current) =>
      current.filter(
        (event) => event.id !== id,
      ),
    )
  }

  return {
    events,
    loading,
    error,
    cloudEnabled,
    createEvent,
    addEvent,
    updateEvent,
    completeEvent,
    reopenEvent,
    removeEvent,
    migrateToSharedAgenda,
  }
}