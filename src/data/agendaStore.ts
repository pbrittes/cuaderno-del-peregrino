import { useEffect, useState } from 'react'
import { agendaEvents, type AgendaEvent } from './agenda'

const STORAGE_KEY = 'cuaderno-agenda-events'

export function useAgendaStore() {
  const [events, setEvents] = useState<AgendaEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (!saved) {
      return agendaEvents
    }

    try {
      return JSON.parse(saved) as AgendaEvent[]
    } catch {
      return agendaEvents
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  }, [events])

  function createEvent(
    title: string,
    date: string,
    type: AgendaEvent['type'],
  ) {
    if (!title.trim() || !date) return

    const event: AgendaEvent = {
      id: crypto.randomUUID(),
      title: title.trim(),
      date,
      type,
      people: ['Pri', 'Tania', 'Andrea'],
      status: 'pendente',
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

  function updateEvent(id: string, data: Partial<AgendaEvent>) {
    setEvents((current) =>
      current.map((event) =>
        event.id === id
          ? { ...event, ...data }
          : event,
      ),
    )
  }

  function removeEvent(id: string) {
    setEvents((current) =>
      current.filter((event) => event.id !== id),
    )
  }

  return {
    events,
    createEvent,
    addEvent,
    updateEvent,
    removeEvent,
  }
}