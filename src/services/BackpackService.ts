import type { GearItem } from '../data/backpacks'
import type { SharedDocument } from '../types/database'

import { sharedDocumentRepository } from '../repositories/SharedDocumentRepository'

export type BackpackPayload = {
  items: GearItem[]
}

export class BackpackService {
  async get(
    expeditionId: string,
  ): Promise<
    SharedDocument<BackpackPayload> | null
  > {
    return sharedDocumentRepository.get<
      BackpackPayload
    >(
      expeditionId,
      'backpack',
    )
  }

  async save(
    expeditionId: string,
    items: GearItem[],
    userId: string,
  ): Promise<
    SharedDocument<BackpackPayload>
  > {
    return sharedDocumentRepository.save<
      BackpackPayload
    >(
      expeditionId,
      'backpack',
      {
        items,
      },
      userId,
    )
  }
}

export const backpackService =
  new BackpackService()