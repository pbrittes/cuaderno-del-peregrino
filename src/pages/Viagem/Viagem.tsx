import { DocumentsSection } from '../../components/travel/DocumentsSection'
import { FlightsSection } from '../../components/travel/FlightsSection'
import { ReservationsSection } from '../../components/travel/ReservationsSection'
import { StaysSection } from '../../components/travel/StaysSection'
import { TransfersSection } from '../../components/travel/TransfersSection'

import { useAuth } from '../../contexts/AuthContext'
import { useExpedition } from '../../contexts/ExpeditionContext'
import { useViagemStore } from '../../data/viagemStore'

import './Viagem.css'

export function Viagem() {
  const { user } = useAuth()
  const { expedition } = useExpedition()

  const {
    flights,
    stays,
    transfers,
    documents,
    reservations,
    loading,
    error,
    addFlight,
    updateFlight,
    deleteFlight,
    addStay,
    updateStay,
    deleteStay,
    addTransfer,
    updateTransfer,
    deleteTransfer,
    addDocument,
    updateDocument,
    deleteDocument,
    addReservation,
    updateReservation,
    deleteReservation,
  } = useViagemStore({
    userId: user?.id,
    expeditionId: expedition?.id,
  })

  return (
    <main className="viagem-page">
      <section className="viagem-header">
        <p className="eyebrow">
          El Viaje
        </p>

        <h2>
          Informações operacionais da viagem
        </h2>

        <p>
          Um lugar único para consultar voos, hospedagens,
          deslocamentos, documentos e reservas importantes da
          Expedição Santiago 2026.
        </p>

        {error && (
          <p role="alert">
            {error}
          </p>
        )}
      </section>

      {loading ? (
        <p>
          Carregando dados da viagem...
        </p>
      ) : (
        <section className="viagem-grid">
          <FlightsSection
            flights={flights}
            addFlight={addFlight}
            updateFlight={updateFlight}
            deleteFlight={deleteFlight}
          />

          <StaysSection
            stays={stays}
            addStay={addStay}
            updateStay={updateStay}
            deleteStay={deleteStay}
          />

          <TransfersSection
            transfers={transfers}
            addTransfer={addTransfer}
            updateTransfer={updateTransfer}
            deleteTransfer={deleteTransfer}
          />

          <DocumentsSection
            documents={documents}
            addDocument={addDocument}
            updateDocument={updateDocument}
            deleteDocument={deleteDocument}
          />

          <ReservationsSection
            reservations={reservations}
            addReservation={addReservation}
            updateReservation={updateReservation}
            deleteReservation={deleteReservation}
          />
        </section>
      )}
    </main>
  )
}