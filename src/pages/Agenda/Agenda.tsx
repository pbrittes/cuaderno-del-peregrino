import { useState } from 'react'
import { useAgendaStore } from '../../data/agendaStore'
import { buildTimeline } from '../../data/expeditionEngine'
import type { AgendaEvent } from '../../data/agenda'

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
  const { events, createEvent, updateEvent, removeEvent } = useAgendaStore()
  const timeline = buildTimeline(events)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [type, setType] = useState<AgendaEvent['type']>('treino')

  let currentMonth = ''

  function resetForm() {
    setTitle('')
    setDate('')
    setType('treino')
    setEditingId(null)
    setShowForm(false)
  }

  function handleSaveEvent() {
    if (editingId) {
      updateEvent(editingId, { title, date, type })
    } else {
      createEvent(title, date, type)
    }

    resetForm()
  }

  function handleEditEvent(event: AgendaEvent) {
    setEditingId(event.id)
    setTitle(event.title)
    setDate(event.date)
    setType(event.type)
    setShowForm(true)
  }

  function handleRemoveEvent(id: string, title: string) {
    const confirmed = window.confirm(`Excluir "${title}" da agenda?`)

    if (confirmed) {
      removeEvent(id)
    }
  }

  return (
    <main className="agenda-page">
      <section className="agenda-header">
        <div className="agenda-header-top">
          <div>
            <p className="eyebrow">Agenda Mestre</p>
            <h2>Compromissos e janelas livres</h2>
          </div>

          <button
            className="mission-add-button"
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
          >
            +
          </button>
        </div>

        <p>
          Um resumo rápido para enxergar o que já está marcado e onde ainda há
          espaço para organizar treinos, compras e decisões da expedição.
        </p>

        {showForm && (
          <div className="agenda-form">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Novo compromisso..."
              autoFocus
            />

            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />

            <select
              value={type}
              onChange={(event) =>
                setType(event.target.value as AgendaEvent['type'])
              }
            >
              <option value="treino">Treino</option>
              <option value="show">Show</option>
              <option value="palestra">Palestra</option>
              <option value="bloqueio">Bloqueio</option>
              <option value="viagem">Viagem</option>
              <option value="tarefa">Tarefa</option>
            </select>

            <div>
              <button onClick={handleSaveEvent}>
                {editingId ? 'Salvar edição' : 'Salvar'}
              </button>
              <button onClick={resetForm}>Cancelar</button>
            </div>
          </div>
        )}
      </section>

      <section className="agenda-list">
        {timeline.map((item) => {
          const month = formatMonth(item.date)
          const showMonth = month !== currentMonth
          currentMonth = month

          const originalEvent = events.find((event) => event.id === item.id)

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

                {!item.automatic && originalEvent && (
                  <div className="agenda-actions">
                    <button
                      onClick={() => handleEditEvent(originalEvent)}
                      title="Editar compromisso"
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() => handleRemoveEvent(item.id, item.title)}
                      title="Excluir compromisso"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </article>
            </div>
          )
        })}
      </section>
    </main>
  )
}