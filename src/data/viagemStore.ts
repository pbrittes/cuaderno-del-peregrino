import {
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  travelService,
  type TravelPayload,
} from '../services/TravelService'

export type Flight = {
  id: string
  airline: string
  flightNumber: string
  origin: string
  destination: string
  departureDate: string
  boardingTime: string
  arrivalAtBoardingTime: string
  arrivalTime: string
  notes: string
}

export type Stay = {
  id: string
  name: string
  city: string
  country: string
  checkIn: string
  checkOut: string
  address: string
  phone: string
  email: string
  site: string
  notes: string
}

export type Transfer = {
  id: string
  type: string
  company: string
  origin: string
  destination: string
  departureDate: string
  departureTime: string
  arrivalTime: string
  locator: string
  ticketUrl: string
  notes: string
}

export type TravelDocument = {
  id: string
  title: string
  owner: string
  documentNumber: string
  expirationDate: string
  fileUrl: string
  notes: string
}

export type Reservation = {
  id: string
  title: string
  category: string
  date: string
  city: string
  locator: string
  site: string
  notes: string
}

type CreateFlightInput = Omit<Flight, 'id'>
type CreateStayInput = Omit<Stay, 'id'>
type CreateTransferInput = Omit<Transfer, 'id'>
type CreateTravelDocumentInput =
  Omit<TravelDocument, 'id'>
type CreateReservationInput =
  Omit<Reservation, 'id'>

type UseViagemStoreParams = {
  userId?: string
  expeditionId?: string
}

const initialTravelData: TravelPayload = {
  flights: [],
  stays: [],
  transfers: [],
  documents: [],
  reservations: [],
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`
}

function normalizeTravelData(
  payload?: Partial<TravelPayload>,
): TravelPayload {
  return {
    flights: Array.isArray(payload?.flights)
      ? payload.flights
      : [],
    stays: Array.isArray(payload?.stays)
      ? payload.stays
      : [],
    transfers: Array.isArray(payload?.transfers)
      ? payload.transfers
      : [],
    documents: Array.isArray(payload?.documents)
      ? payload.documents
      : [],
    reservations: Array.isArray(
      payload?.reservations,
    )
      ? payload.reservations
      : [],
  }
}

export function useViagemStore({
  userId,
  expeditionId,
}: UseViagemStoreParams = {}) {
  const [travelData, setTravelData] =
    useState<TravelPayload>(initialTravelData)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  const travelDataRef =
    useRef<TravelPayload>(initialTravelData)

  function updateLocalData(
    nextData: TravelPayload,
  ) {
    travelDataRef.current = nextData
    setTravelData(nextData)
  }

  useEffect(() => {
    let active = true

    async function loadTravelData() {
      if (!userId || !expeditionId) {
        if (active) {
          updateLocalData(initialTravelData)
          setLoading(false)
        }

        return
      }

      setLoading(true)
      setError(null)

      try {
        const document =
          await travelService.get(expeditionId)

        if (!active) {
          return
        }

        if (document) {
          updateLocalData(
            normalizeTravelData(
              document.payload,
            ),
          )
        } else {
          const createdDocument =
            await travelService.save(
              expeditionId,
              initialTravelData,
              userId,
            )

          if (active) {
            updateLocalData(
              normalizeTravelData(
                createdDocument.payload,
              ),
            )
          }
        }
      } catch (loadError) {
        console.error(
          'Erro ao carregar dados de viagem:',
          loadError,
        )

        if (active) {
          setError(
            'Não foi possível carregar os dados da viagem.',
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadTravelData()

    return () => {
      active = false
    }
  }, [userId, expeditionId])

  async function persistTravelData(
    nextData: TravelPayload,
  ) {
    if (!userId || !expeditionId) {
      return
    }

    const previousData =
      travelDataRef.current

    updateLocalData(nextData)
    setError(null)

    try {
      await travelService.save(
        expeditionId,
        nextData,
        userId,
      )
    } catch (saveError) {
      console.error(
        'Erro ao salvar dados de viagem:',
        saveError,
      )

      updateLocalData(previousData)

      setError(
        'Não foi possível salvar os dados da viagem.',
      )
    }
  }

  function addFlight(
    flight: CreateFlightInput,
  ) {
    const newFlight: Flight = {
      id: createId('flight'),
      ...flight,
    }

    void persistTravelData({
      ...travelDataRef.current,
      flights: [
        ...travelDataRef.current.flights,
        newFlight,
      ],
    })
  }

  function updateFlight(
    updatedFlight: Flight,
  ) {
    void persistTravelData({
      ...travelDataRef.current,
      flights:
        travelDataRef.current.flights.map(
          (flight) =>
            flight.id === updatedFlight.id
              ? updatedFlight
              : flight,
        ),
    })
  }

  function deleteFlight(
    flightId: string,
  ) {
    void persistTravelData({
      ...travelDataRef.current,
      flights:
        travelDataRef.current.flights.filter(
          (flight) =>
            flight.id !== flightId,
        ),
    })
  }

  function addStay(
    stay: CreateStayInput,
  ) {
    const newStay: Stay = {
      id: createId('stay'),
      ...stay,
    }

    void persistTravelData({
      ...travelDataRef.current,
      stays: [
        ...travelDataRef.current.stays,
        newStay,
      ],
    })
  }

  function updateStay(
    updatedStay: Stay,
  ) {
    void persistTravelData({
      ...travelDataRef.current,
      stays:
        travelDataRef.current.stays.map(
          (stay) =>
            stay.id === updatedStay.id
              ? updatedStay
              : stay,
        ),
    })
  }

  function deleteStay(
    stayId: string,
  ) {
    void persistTravelData({
      ...travelDataRef.current,
      stays:
        travelDataRef.current.stays.filter(
          (stay) => stay.id !== stayId,
        ),
    })
  }

  function addTransfer(
    transfer: CreateTransferInput,
  ) {
    const newTransfer: Transfer = {
      id: createId('transfer'),
      ...transfer,
    }

    void persistTravelData({
      ...travelDataRef.current,
      transfers: [
        ...travelDataRef.current.transfers,
        newTransfer,
      ],
    })
  }

  function updateTransfer(
    updatedTransfer: Transfer,
  ) {
    void persistTravelData({
      ...travelDataRef.current,
      transfers:
        travelDataRef.current.transfers.map(
          (transfer) =>
            transfer.id ===
            updatedTransfer.id
              ? updatedTransfer
              : transfer,
        ),
    })
  }

  function deleteTransfer(
    transferId: string,
  ) {
    void persistTravelData({
      ...travelDataRef.current,
      transfers:
        travelDataRef.current.transfers.filter(
          (transfer) =>
            transfer.id !== transferId,
        ),
    })
  }

  function addDocument(
    document: CreateTravelDocumentInput,
  ) {
    const newDocument: TravelDocument = {
      id: createId('document'),
      ...document,
    }

    void persistTravelData({
      ...travelDataRef.current,
      documents: [
        ...travelDataRef.current.documents,
        newDocument,
      ],
    })
  }

  function updateDocument(
    updatedDocument: TravelDocument,
  ) {
    void persistTravelData({
      ...travelDataRef.current,
      documents:
        travelDataRef.current.documents.map(
          (document) =>
            document.id ===
            updatedDocument.id
              ? updatedDocument
              : document,
        ),
    })
  }

  function deleteDocument(
    documentId: string,
  ) {
    void persistTravelData({
      ...travelDataRef.current,
      documents:
        travelDataRef.current.documents.filter(
          (document) =>
            document.id !== documentId,
        ),
    })
  }

  function addReservation(
    reservation: CreateReservationInput,
  ) {
    const newReservation: Reservation = {
      id: createId('reservation'),
      ...reservation,
    }

    void persistTravelData({
      ...travelDataRef.current,
      reservations: [
        ...travelDataRef.current.reservations,
        newReservation,
      ],
    })
  }

  function updateReservation(
    updatedReservation: Reservation,
  ) {
    void persistTravelData({
      ...travelDataRef.current,
      reservations:
        travelDataRef.current.reservations.map(
          (reservation) =>
            reservation.id ===
            updatedReservation.id
              ? updatedReservation
              : reservation,
        ),
    })
  }

  function deleteReservation(
    reservationId: string,
  ) {
    void persistTravelData({
      ...travelDataRef.current,
      reservations:
        travelDataRef.current.reservations.filter(
          (reservation) =>
            reservation.id !== reservationId,
        ),
    })
  }

  return {
    flights: travelData.flights,
    stays: travelData.stays,
    transfers: travelData.transfers,
    documents: travelData.documents,
    reservations:
      travelData.reservations,
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
  }
}