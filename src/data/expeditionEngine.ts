import type { AgendaEvent } from './agenda'

export type TimelineItem = {
  id: string
  date: string
  endDate?: string
  title: string
  type: AgendaEvent['type'] | 'livre'
  people: Array<'Pri' | 'Tania' | 'Andrea'>
  note?: string
  automatic?: boolean
  completed?: boolean
}

function toDate(date: string) {
  return new Date(`${date}T12:00:00`)
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function eventTouchesDate(event: AgendaEvent, date: Date) {
  const start = toDate(event.date)
  const end = event.endDate ? toDate(event.endDate) : start
  return date >= start && date <= end
}

function weekendSuggestion(index: number) {
  const suggestions = [
    'Excelente janela para treino longo.',
    'Boa data para reunião de passagens ou equipamentos.',
    'Pode virar treino com mochila parcial.',
    'Janela boa para simular um dia de Caminho.',
  ]

  return suggestions[index % suggestions.length]
}

export function buildTimeline(events: AgendaEvent[]): TimelineItem[] {
  const activeEvents = events.filter((event) => !event.completed)
  const items: TimelineItem[] = [...activeEvents]

  let current = toDate('2026-07-01')
  const end = toDate('2026-10-25')
  let freeIndex = 0

  while (current <= end) {
    if (current.getDay() === 6) {
      const saturday = current
      const sunday = addDays(current, 1)

      const hasSaturdayEvent = events.some((event) =>
        eventTouchesDate(event, saturday),
      )

      const hasSundayEvent = events.some((event) =>
        eventTouchesDate(event, sunday),
      )

      if (!hasSaturdayEvent && !hasSundayEvent) {
        items.push({
          id: `livre-${saturday.toISOString().slice(0, 10)}`,
          date: saturday.toISOString().slice(0, 10),
          endDate: sunday.toISOString().slice(0, 10),
          title: 'Final de semana livre',
          type: 'livre',
          people: [],
          note: weekendSuggestion(freeIndex),
          automatic: true,
        })

        freeIndex += 1
      }
    }

    current = addDays(current, 1)
  }

  return items.sort(
    (a, b) => toDate(a.date).getTime() - toDate(b.date).getTime(),
  )
}

export function buildHistory(events: AgendaEvent[]): TimelineItem[] {
  return events
    .filter((event) => event.completed)
    .sort(
      (a, b) =>
        toDate(b.date).getTime() - toDate(a.date).getTime(),
    )
}

export function getDaysUntilDeparture(
  departureDate = '2026-10-30',
) {
  const today = new Date()
  const departure = toDate(departureDate)

  const diff = departure.getTime() - today.getTime()

  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function getNextEvent(
  events: AgendaEvent[],
) {
  const today = new Date()

  return events
    .filter(
      (event) =>
        !event.completed &&
        toDate(event.date) >= today,
    )
    .sort(
      (a, b) =>
        toDate(a.date).getTime() -
        toDate(b.date).getTime(),
    )[0]
}