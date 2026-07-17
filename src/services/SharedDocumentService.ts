import type { SharedDocument } from '../types/database'

import { sharedDocumentRepository } from '../repositories/SharedDocumentRepository'

export class SharedDocumentService {
  async getOrCreate<T>(
    expeditionId: string,
    module:
      | 'budget'
      | 'travel'
      | 'finance',
    initialPayload: T,
    userId: string,
  ): Promise<SharedDocument<T>> {
    const existing =
      await sharedDocumentRepository.get<T>(
        expeditionId,
        module,
      )

    if (existing) {
      return existing
    }

    return sharedDocumentRepository.save<T>(
      expeditionId,
      module,
      initialPayload,
      userId,
    )
  }

  async save<T>(
    expeditionId: string,
    module:
      | 'budget'
      | 'travel'
      | 'finance',
    payload: T,
    userId: string,
  ): Promise<SharedDocument<T>> {
    return sharedDocumentRepository.save<T>(
      expeditionId,
      module,
      payload,
      userId,
    )
  }
}

export const sharedDocumentService =
  new SharedDocumentService()