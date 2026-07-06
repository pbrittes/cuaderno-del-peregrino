import { useMemo, useState } from 'react'

import { useBackpackItems } from '../../data/backpackStore'
import { useMissionStore } from '../../data/missionStore'
import type { Mission, MissionCategory } from '../../data/missions'

import { agendaEvents } from '../../data/agenda'
import {
  getDaysUntilDeparture,
  getNextEvent,
} from '../../data/expeditionEngine'

const missionCategories: { value: MissionCategory; label: string }[] = [
  { value: 'viagem', label: 'Viagem' },
  { value: 'equipamentos', label: 'Equipamentos' },
  { value: 'hospedagem', label: 'Hospedagem' },
  { value: 'financeiro', label: 'Financeiro' },
  { value: 'treinos', label: 'Treinos' },
  { value: 'documentos', label: 'Documentos' },
  { value: 'saúde', label: 'Saúde' },
  { value: 'compras', label: 'Compras' },
  { value: 'geral', label: 'Geral' },
]

function getMissionCategoryLabel(category: MissionCategory) {
  return (
    missionCategories.find((item) => item.value === category)?.label ??
    'Geral'
  )
}

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
  const { missions, toggleMission, createMission, updateMission } =
    useMissionStore()

  const [showMissionForm, setShowMissionForm] = useState(false)
  const [missionTitle, setMissionTitle] = useState('')
  const [missionCategory, setMissionCategory] =
    useState<MissionCategory>('geral')
  const [editingMission, setEditingMission] = useState<Mission | null>(null)

  const nextMissions = missions.filter(
    (mission) => mission.status !== 'done',
  )

  const backpackStatus = useMemo(() => {
    const pilgrims = ['Pri', 'Tan', 'Deia'] as const

    return pilgrims.map((name) => {
      const weight = items.reduce((total, item) => {
        return item.status[name] === 'tem' ? total + item.weight : total
      }, 0)

      return {
        name,
        weight,
        progress: Math.min((weight / 10000) * 100, 100),
      }
    })
  }, [items])

  function resetMissionForm() {
    setMissionTitle('')
    setMissionCategory('geral')
    setEditingMission(null)
    setShowMissionForm(false)
  }

  function handleOpenCreateMission() {
    setMissionTitle('')
    setMissionCategory('geral')
    setEditingMission(null)
    setShowMissionForm(true)
  }

  function handleOpenEditMission(mission: Mission) {
    setMissionTitle(mission.title)
    setMissionCategory(mission.category)
    setEditingMission(mission)
    setShowMissionForm(true)
  }

  function handleSaveMission() {
    const trimmedTitle = missionTitle.trim()

    if (!trimmedTitle) return

    if (editingMission) {
      updateMission(editingMission.id, {
        title: trimmedTitle,
        category: missionCategory,
      })
    } else {
      createMission(trimmedTitle, missionCategory)
    }

    resetMissionForm()
  }

  return (
    <main className="home-page">
      <div className="home-dashboard">
        <section className="countdown-card">
          <p className="eyebrow">¡Buen Camino!</p>
          <h2>Bom dia, peregrinas.</h2>

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
              <p className="event-date">{formatDate(nextEvent.date)}</p>
              {nextEvent.note && <p>{nextEvent.note}</p>}
            </>
          )}
        </section>

        <section className="backpack-card">
          <p className="eyebrow">Mochilas</p>

          {backpackStatus.map((item) => (
            <div className="backpack-row" key={item.name}>
              <strong>{item.name}</strong>

              <div className="backpack-bar">
                <span style={{ width: `${item.progress}%` }} />
              </div>

              <em>{formatWeight(item.weight)}</em>
            </div>
          ))}
        </section>

        <section className="missions-card">
          <div className="missions-header">
            <p className="eyebrow">Missões da Semana</p>

            <button
              className="mission-add-button"
              onClick={handleOpenCreateMission}
            >
              +
            </button>
          </div>

          {nextMissions.length === 0 ? (
            <p>Todas as missões concluídas 🎉</p>
          ) : (
            nextMissions.map((mission) => (
              <div className="mission-row" key={mission.id}>
                <div>
                  <strong>{mission.title}</strong>
                  <small>
                    {getMissionCategoryLabel(mission.category)}
                  </small>
                </div>

                <div className="mission-actions">
                  <button
                    className="mission-edit-button"
                    onClick={() => handleOpenEditMission(mission)}
                    title="Editar missão"
                  >
                    ✎
                  </button>

                  <button
                    className="mission-done-button"
                    onClick={() => toggleMission(mission.id)}
                    title="Concluir missão"
                  >
                    ✓
                  </button>
                </div>
              </div>
            ))
          )}

          {showMissionForm && (
            <div className="mission-form">
              <input
                value={missionTitle}
                onChange={(event) =>
                  setMissionTitle(event.target.value)
                }
                placeholder="Nova missão..."
                autoFocus
              />

              <select
                value={missionCategory}
                onChange={(event) =>
                  setMissionCategory(
                    event.target.value as MissionCategory,
                  )
                }
              >
                {missionCategories.map((category) => (
                  <option
                    value={category.value}
                    key={category.value}
                  >
                    {category.label}
                  </option>
                ))}
              </select>

              <div>
                <button onClick={handleSaveMission}>
                  {editingMission ? 'Salvar alterações' : 'Salvar'}
                </button>

                <button onClick={resetMissionForm}>Cancelar</button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}