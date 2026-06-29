import { agendaEvents } from '../../data/agenda'
import { buildTimeline } from '../../data/expeditionEngine'

const itemIcon = {
  treino: '🥾',
  show: '🎵',
  palestra: '📖',
  bloqueio: '🚫',
  viagem: '✈️',
  tarefa: '□',
  livre: '✨',
}

const shortNames = {
  Pri: 'Pri',
  Tania: 'Tan',
  Andrea: 'Deia',
}

function formatDate(date: string) {
  return new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  })
}

function formatMonth(date: string) {
  return new Date(date + 'T12:00:00')
    .toLocaleDateString('pt-BR', { month: 'long' })
    .toUpperCase()
}

export function Agenda() {
  const timeline = buildTimeline(agendaEvents)

  let currentMonth = ''

  return (
    <main className="agenda-page">
      <section className="agenda-header">
        <p className="eyebrow">Agenda Mestre</p>
        <h2>Compromissos e janelas livres</h2>
        <p>
          Um resumo rápido para enxergar o que já está marcado e onde ainda há
          espaço para organizar treinos, compras e decisões da expedição.
        </p>
      </section>

      <section className="agenda-list">
        {timeline.map((item) => {
          const month = formatMonth(item.date)
          const showMonth = month !== currentMonth
          currentMonth = month

          return (
            <div key={item.id}>
              {showMonth && <h3 className="timeline-month">{month}</h3>}

              <article
                className={`agenda-item ${item.type} ${
                  item.automatic ? 'automatic' : ''
                }`}
              >
                <div className="agenda-date">
                  <span>{formatDate(item.date)}</span>
                  {item.endDate && <small>até {formatDate(item.endDate)}</small>}
                </div>

                <div className="agenda-content">
                  <strong>
                    {itemIcon[item.type]} {item.title}
                  </strong>

                  {item.note && <p>{item.note}</p>}

                  {item.people.length > 0 ? (
                    <div className="agenda-people">
                      {item.people.map((person) => (
                        <span key={person}>{shortNames[person]}</span>
                      ))}
                    </div>
                  ) : (
                    <div className="agenda-people free">
                      <span>Livre</span>
                    </div>
                  )}
                </div>
              </article>
            </div>
          )
        })}
      </section>
    </main>
  )
}