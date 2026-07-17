import type {
  Flight,
  Reservation,
  Stay,
  Transfer,
  TravelDocument,
} from '../data/viagemStore'

import type { SharedDocument } from '../types/database'

import { sharedDocumentRepository } from '../repositories/SharedDocumentRepository'

export type TravelPayload = {
  flights: Flight[]
  stays: Stay[]
  transfers: Transfer[]
  documents: TravelDocument[]
  reservations: Reservation[]
}

export class TravelService {
  async get(
    expeditionId: string,
  ): Promise<
    SharedDocument<TravelPayload> | null
  > {
    return sharedDocumentRepository.get<
      TravelPayload
    >(
      expeditionId,
      'travel',
    )
  }

  async save(
    expeditionId: string,
    payload: TravelPayload,
    userId: string,
  ): Promise<
    SharedDocument<TravelPayload>
  > {
    return sharedDocumentRepository.save<
      TravelPayload
    >(
      expeditionId,
      'travel',
      payload,
      userId,
    )
  }
}

export const travelService =
  new TravelService()