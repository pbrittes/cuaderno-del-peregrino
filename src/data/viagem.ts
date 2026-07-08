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
  origin: string
  destination: string
  date: string
  time: string
  company: string
  number: string
  notes: string
}

export type TravelDocument = {
  id: string
  type: string
  number: string
  expirationDate: string
  status: 'pendente' | 'disponível'
  notes: string
}

export type Reservation = {
  id: string
  type: string
  company: string
  city: string
  date: string
  time: string
  notes: string
}

export type TravelData = {
  flights: Flight[]
  stays: Stay[]
  transfers: Transfer[]
  documents: TravelDocument[]
  reservations: Reservation[]
}

export const initialTravelData: TravelData = {
  flights: [],
  stays: [],
  transfers: [],
  documents: [],
  reservations: [],
}