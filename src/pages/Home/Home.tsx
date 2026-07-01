import { useMemo } from 'react'

import { useBackpackItems } from '../../data/backpackStore'
import { agendaEvents } from '../../data/agenda'
import {
  getDaysUntilDeparture,
  getNextEvent,
} from '../../data/expeditionEngine'

function formatDate(date: string) {
  return new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
  })
}

function formatWeight(grams: number) {
  return `${(grams / 1000).toFixed(1).replace('.', ',')} kg`
}

export function Home() {
  const days = getDaysUntilDeparture()
  const nextEvent = getNextEvent(agendaEvents)

  const { items } = useBackpackItems()

  const backpackStatus = useMemo(() => {
    const pilgrims = ['Pri', 'Tan', 'Deia'] as const

    return pilgrims.map((name) => {
      const weight = items.reduce((total, item) => {
        return item.status[name] === 'tem'
          ? total + item.weight
          : total
      }, 0)

      return {
        name,
        weight,
        progress: Math.min((weight / 10000) * 100, 100),
      }
    })
  }, [items])

  return (
    <main className="home-page">
      <div className="home-dashboard">

        <section className="countdown-card">
          <p className="eyebrow">¡Buen Camino!</p>

          <h2>Bom dia, peregrina.</h2>

          <div className="countdown-number">{days}</div>

          <p className="countdown-text">
            dias até colocarmos
            <br />
            os pés no Caminho.
          </p>
        </section>

        <section className="next-event-card">
          <p className="eyebrow">Próximo compromisso</p>

          {nextEvent && (
            <>
              <h3>📖 {nextEvent.title}</h3>

              <p className="event-date">
                {formatDate(nextEvent.date)}
              </p>

              {nextEvent.note && (
                <p>{nextEvent.note}</p>
              )}
            </>
          )}
        </section>

        <section className="backpack-card">
          <p className="eyebrow">Mochilas</p>

          {backpackStatus.map((item) => (
            <div className="backpack-row" key={item.name}>
              <strong>{item.name}</strong>

              <div className="backpack-bar">
                <span
                  style={{
                    width: `${item.progress}%`,
                  }}
                />
              </div>

              <em>{formatWeight(item.weight)}</em>
            </div>
          ))}
        </section>

      </div>
    </main>
  )
}