import { useState } from 'react'
import {
  BlockIcon,
  DeleteIcon,
  EditIcon,
  FreeIcon,
  LectureIcon,
  MusicIcon,
  PlusIcon,
  TaskIcon,
  TrainingIcon,
  TravelIcon,
} from '../../components/icons/AppIcons'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import type { AgendaEvent } from '../../data/agenda'
import { useAgendaStore } from '../../data/agendaStore'
import {
  buildTimeline,
  type TimelineItem,
} from '../../data/expeditionEngine'

const itemIcons = {
  treino: TrainingIcon,
  show: MusicIcon,
  palestra: LectureIcon,
  bloqueio: BlockIcon,
  viagem: TravelIcon,
  tarefa: TaskIcon,
  livre: FreeIcon,
}

const shortNames = {
  Pri: 'Pri',
  Tania: 'Tan',
  Andrea: 'Deia',
}

const peopleOptions: AgendaEvent['people'] = [
  'Pri',
  'Tania',
  'Andrea',
]

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  })
}

function formatMonth(date: string) {
  return new Date(`${date}T12:00:00`)
    .toLocaleDateString('pt-BR', { month: 'long' })
    .toUpperCase()
}

export function Agenda() {
  const {
    events,
    createEvent,
    updateEvent,
    removeEvent,
  } = useAgendaStore()

  const timeline = buildTimeline(events)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [type, setType] =
    useState<AgendaEvent['type']>('treino')
  const [people, setPeople] =
    useState<AgendaEvent['people']>([...peopleOptions])
  const [formContext, setFormContext] = useState<
    'create' | 'edit' | 'reserve'
  >('create')
  const [eventToDelete, setEventToDelete] = useState<{
    id: string
    title: string
  } | null>(null)

  let currentMonth = ''

  function resetForm() {
    setTitle('')
    setDate('')
    setType('treino')
    setPeople([...peopleOptions])
    setEditingId(null)
    setFormContext('create')
    setShowForm(false)
  }

  function handleOpenCreateEvent() {
    resetForm()
    setShowForm(true)
  }

  function handleReserveFreeWeekend(item: TimelineItem) {
    setTitle('Treino longo')
    setDate(item.date)
    setType('treino')
    setPeople([...peopleOptions])
    setEditingId(null)
    setFormContext('reserve')
    setShowForm(true)
  }

  function togglePerson(person: AgendaEvent['people'][number]) {
    setPeople((currentPeople) =>
      currentPeople.includes(person)
        ? currentPeople.filter(
            (currentPerson) => currentPerson !== person,
          )
        : [...currentPeople, person],
    )
  }

  function handleSaveEvent() {
    if (!title.trim() || !date || people.length === 0) {
      return
    }

    if (editingId) {
      updateEvent(editingId, {
        title,
        date,
        type,
        people,
      })
    } else {
      createEvent(
        title,
        date,
        type,
        people,
      )
    }

    resetForm()
  }

  function handleEditEvent(event: AgendaEvent) {
    setEditingId(event.id)
    setTitle(event.title)
    setDate(event.date)
    setType(event.type)
    setPeople([...event.people])
    setFormContext('edit')
    setShowForm(true)
  }

  function handleRequestRemoveEvent(
    id: string,
    eventTitle: string,
  ) {
    setEventToDelete({
      id,
      title: eventTitle,
    })
  }

  function handleConfirmRemoveEvent() {
    if (!eventToDelete) return

    removeEvent(eventToDelete.id)
    setEventToDelete(null)
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
            onClick={handleOpenCreateEvent}
            title="Adicionar compromisso"
            aria-label="Adicionar compromisso"
          >
            <PlusIcon size={20} strokeWidth={2} />
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

            <div className="participants-block">
              <span>Quem vai participar?</span>

              <div className="participants-chips">
                {peopleOptions.map((person) => {
                  const isActive = people.includes(person)

                  return (
                    <button
                      key={person}
                      type="button"
                      className={`participant-chip ${
                        isActive ? 'active' : ''
                      }`}
                      onClick={() => togglePerson(person)}
                    >
                      {shortNames[person]}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="agenda-form-actions">
              <button onClick={handleSaveEvent}>
                {formContext === 'edit'
                  ? 'Salvar edição'
                  : formContext === 'reserve'
                    ? 'Reservar janela'
                    : 'Salvar'}
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
          const ItemIcon = itemIcons[item.type]

          currentMonth = month

          const originalEvent = events.find(
            (event) => event.id === item.id,
          )

          return (
            <div key={item.id}>
              {showMonth && (
                <h3 className="timeline-month">{month}</h3>
              )}

              <article
                className={`agenda-item ${item.type} ${
                  item.automatic ? 'automatic' : ''
                }`}
              >
                <div className="agenda-date">
                  <span>{formatDate(item.date)}</span>

                  {item.endDate && (
                    <small>até {formatDate(item.endDate)}</small>
                  )}
                </div>

                <div className="agenda-content">
                  <strong className="agenda-item-title">
                    <ItemIcon size={20} />
                    <span>{item.title}</span>
                  </strong>

                  {item.note && <p>{item.note}</p>}

                  {item.people.length > 0 ? (
                    <div className="agenda-people">
                      {item.people.map((person) => (
                        <span key={person}>
                          {shortNames[person]}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="agenda-people free">
                      <span>Livre</span>
                    </div>
                  )}
                </div>

                {item.automatic ? (
                  <div className="agenda-actions">
                    <button
                      onClick={() =>
                        handleReserveFreeWeekend(item)
                      }
                      title="Reservar janela livre"
                      aria-label="Reservar janela livre"
                    >
                      <EditIcon size={18} />
                    </button>
                  </div>
                ) : (
                  originalEvent && (
                    <div className="agenda-actions">
                      <button
                        onClick={() =>
                          handleEditEvent(originalEvent)
                        }
                        title="Editar compromisso"
                        aria-label="Editar compromisso"
                      >
                        <EditIcon size={18} />
                      </button>

                      <button
                        onClick={() =>
                          handleRequestRemoveEvent(
                            item.id,
                            item.title,
                          )
                        }
                        title="Excluir compromisso"
                        aria-label="Excluir compromisso"
                      >
                        <DeleteIcon size={18} />
                      </button>
                    </div>
                  )
                )}
              </article>
            </div>
          )
        })}
      </section>

      <ConfirmDialog
        open={Boolean(eventToDelete)}
        title="Excluir compromisso?"
        message={
          eventToDelete
            ? `O compromisso "${eventToDelete.title}" será removido da Agenda.`
            : ''
        }
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleConfirmRemoveEvent}
        onCancel={() => setEventToDelete(null)}
      />
    </main>
  )
}