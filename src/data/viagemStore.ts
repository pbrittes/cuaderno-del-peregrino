import { useEffect, useState } from "react"

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

type TravelData = {
  flights: Flight[]
  stays: Stay[]
  transfers: Transfer[]
  documents: TravelDocument[]
  reservations: Reservation[]
}

type CreateFlightInput = Omit<Flight, "id">
type CreateStayInput = Omit<Stay, "id">
type CreateTransferInput = Omit<Transfer, "id">
type CreateTravelDocumentInput = Omit<TravelDocument, "id">
type CreateReservationInput = Omit<Reservation, "id">

const STORAGE_KEY = "cuaderno-viagem"

const initialTravelData: TravelData = {
  flights: [],
  stays: [],
  transfers: [],
  documents: [],
  reservations: [],
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function loadTravelData(): TravelData {
  if (typeof window === "undefined") {
    return initialTravelData
  }

  try {
    const storedData = window.localStorage.getItem(STORAGE_KEY)

    if (!storedData) {
      return initialTravelData
    }

    const parsedData = JSON.parse(storedData) as Partial<TravelData>

    return {
      flights: Array.isArray(parsedData.flights) ? parsedData.flights : [],
      stays: Array.isArray(parsedData.stays) ? parsedData.stays : [],
      transfers: Array.isArray(parsedData.transfers) ? parsedData.transfers : [],
      documents: Array.isArray(parsedData.documents) ? parsedData.documents : [],
      reservations: Array.isArray(parsedData.reservations)
        ? parsedData.reservations
        : [],
    }
  } catch (error) {
    console.error("Erro ao carregar dados de viagem:", error)
    return initialTravelData
  }
}

function saveTravelData(data: TravelData) {
  if (typeof window === "undefined") {
    return
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error("Erro ao salvar dados de viagem:", error)
  }
}

export function useViagemStore() {
  const [travelData, setTravelData] = useState<TravelData>(() => loadTravelData())

  useEffect(() => {
    saveTravelData(travelData)
  }, [travelData])

  function addFlight(flight: CreateFlightInput) {
    const newFlight: Flight = {
      id: createId("flight"),
      ...flight,
    }

    setTravelData((currentData) => ({
      ...currentData,
      flights: [...currentData.flights, newFlight],
    }))
  }

  function updateFlight(updatedFlight: Flight) {
    setTravelData((currentData) => ({
      ...currentData,
      flights: currentData.flights.map((flight) =>
        flight.id === updatedFlight.id ? updatedFlight : flight,
      ),
    }))
  }

  function deleteFlight(flightId: string) {
    setTravelData((currentData) => ({
      ...currentData,
      flights: currentData.flights.filter((flight) => flight.id !== flightId),
    }))
  }

  function addStay(stay: CreateStayInput) {
    const newStay: Stay = {
      id: createId("stay"),
      ...stay,
    }

    setTravelData((currentData) => ({
      ...currentData,
      stays: [...currentData.stays, newStay],
    }))
  }

  function updateStay(updatedStay: Stay) {
    setTravelData((currentData) => ({
      ...currentData,
      stays: currentData.stays.map((stay) =>
        stay.id === updatedStay.id ? updatedStay : stay,
      ),
    }))
  }

  function deleteStay(stayId: string) {
    setTravelData((currentData) => ({
      ...currentData,
      stays: currentData.stays.filter((stay) => stay.id !== stayId),
    }))
  }

  function addTransfer(transfer: CreateTransferInput) {
    const newTransfer: Transfer = {
      id: createId("transfer"),
      ...transfer,
    }

    setTravelData((currentData) => ({
      ...currentData,
      transfers: [...currentData.transfers, newTransfer],
    }))
  }

  function updateTransfer(updatedTransfer: Transfer) {
    setTravelData((currentData) => ({
      ...currentData,
      transfers: currentData.transfers.map((transfer) =>
        transfer.id === updatedTransfer.id ? updatedTransfer : transfer,
      ),
    }))
  }

  function deleteTransfer(transferId: string) {
    setTravelData((currentData) => ({
      ...currentData,
      transfers: currentData.transfers.filter(
        (transfer) => transfer.id !== transferId,
      ),
    }))
  }

  function addDocument(document: CreateTravelDocumentInput) {
    const newDocument: TravelDocument = {
      id: createId("document"),
      ...document,
    }

    setTravelData((currentData) => ({
      ...currentData,
      documents: [...currentData.documents, newDocument],
    }))
  }

  function updateDocument(updatedDocument: TravelDocument) {
    setTravelData((currentData) => ({
      ...currentData,
      documents: currentData.documents.map((document) =>
        document.id === updatedDocument.id ? updatedDocument : document,
      ),
    }))
  }

  function deleteDocument(documentId: string) {
    setTravelData((currentData) => ({
      ...currentData,
      documents: currentData.documents.filter(
        (document) => document.id !== documentId,
      ),
    }))
  }

  function addReservation(reservation: CreateReservationInput) {
    const newReservation: Reservation = {
      id: createId("reservation"),
      ...reservation,
    }

    setTravelData((currentData) => ({
      ...currentData,
      reservations: [...currentData.reservations, newReservation],
    }))
  }

  function updateReservation(updatedReservation: Reservation) {
    setTravelData((currentData) => ({
      ...currentData,
      reservations: currentData.reservations.map((reservation) =>
        reservation.id === updatedReservation.id ? updatedReservation : reservation,
      ),
    }))
  }

  function deleteReservation(reservationId: string) {
    setTravelData((currentData) => ({
      ...currentData,
      reservations: currentData.reservations.filter(
        (reservation) => reservation.id !== reservationId,
      ),
    }))
  }

  return {
    flights: travelData.flights,
    stays: travelData.stays,
    transfers: travelData.transfers,
    documents: travelData.documents,
    reservations: travelData.reservations,
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

