import type {
  RoteiroItem,
} from '../data/roteiroStore'

import type {
  SharedDocument,
} from '../types/database'

import {
  sharedDocumentRepository,
} from '../repositories/SharedDocumentRepository'

export type RoteiroPayload = {
  items: RoteiroItem[]
}

export class RoteiroService {
  async get(
    expeditionId: string,
  ): Promise<
    SharedDocument<RoteiroPayload> | null
  > {
    return sharedDocumentRepository.get<
      RoteiroPayload
    >(
      expeditionId,
      'itinerary',
    )
  }

  async save(
    expeditionId: string,
    payload: RoteiroPayload,
    userId: string,
  ): Promise<
    SharedDocument<RoteiroPayload>
  > {
    return sharedDocumentRepository.save<
      RoteiroPayload
    >(
      expeditionId,
      'itinerary',
      payload,
      userId,
    )
  }
}

export const roteiroService =
  new RoteiroService()