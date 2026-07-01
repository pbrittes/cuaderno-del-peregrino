import { agendaEvents } from '../../data/agenda'
import {
  formatKg,
  getBackpackProgress,
  getBackpackWeight,
} from '../../data/backpackEngine'
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

export function Home() {
  const days = getDaysUntilDeparture()
  const nextEvent = getNextEvent(agendaEvents)

  const backpackStatus = [
    {
      name: 'Pri',
      weight: getBackpackWeight('Pri'),
      progress: getBackpackProgress('Pri'),
    },
    {
      name: 'Tan',
      weight: getBackpackWeight('Tan'),
      progress: getBackpackProgress('Tan'),
    },
    {
      name: 'Deia',
      weight: getBackpackWeight('Deia'),
      progress: getBackpackProgress('Deia'),
    },
  ]

  return (
    <main className="home-page home-dashboard">
      <section className="countdown-card home-card home-card-large">
        <p className="eyebrow">¡Buen Camino!</p>

        <h2 className="greeting">Bom dia, peregrina.</h2>

        <div className="countdown-number">{days}</div>

        <p className="countdown-text">
          dias até colocarmos
          <br />
          os pés no Caminho.
        </p>
      </section>

      <section className="next-event-card home-card">
        <p className="eyebrow">Próximo compromisso</p>

        {nextEvent ? (
          <>
            <h3>📖 {nextEvent.title}</h3>
            <p className="event-date">{formatDate(nextEvent.date)}</p>
            {nextEvent.note && <p>{nextEvent.note}</p>}
          </>
        ) : (
          <p>Nenhum compromisso cadastrado.</p>
        )}
      </section>

      <section className="backpack-card home-card">
        <p className="eyebrow">Mochilas</p>

        {backpackStatus.map((item) => (
          <div className="backpack-row" key={item.name}>
            <strong>{item.name}</strong>

            <div className="backpack-bar">
              <span style={{ width: `${item.progress}%` }} />
            </div>

            <em>{formatKg(item.weight)}</em>
          </div>
        ))}
      </section>
    </main>
  )
}