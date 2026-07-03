import { useMemo, useState } from 'react'

import { useBackpackItems } from '../../data/backpackStore'
import { useMissionStore } from '../../data/missionStore'

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
  const { missions, toggleMission, createMission } = useMissionStore()

  const [showMissionForm, setShowMissionForm] = useState(false)
  const [newMission, setNewMission] = useState('')

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

  function handleCreateMission() {
    createMission(newMission)
    setNewMission('')
    setShowMissionForm(false)
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
              onClick={() => setShowMissionForm(true)}
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
                  <small>{mission.category}</small>
                </div>

                <button
                  className="mission-done-button"
                  onClick={() => toggleMission(mission.id)}
                >
                  ✓
                </button>
              </div>
            ))
          )}

          {showMissionForm && (
            <div className="mission-form">
              <input
                value={newMission}
                onChange={(event) => setNewMission(event.target.value)}
                placeholder="Nova missão..."
                autoFocus
              />

              <div>
                <button onClick={handleCreateMission}>Salvar</button>
                <button onClick={() => setShowMissionForm(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}