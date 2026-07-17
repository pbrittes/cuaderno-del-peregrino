import type { Mission } from '../data/missions'
import type { SharedDocument } from '../types/database'

import { sharedDocumentRepository } from '../repositories/SharedDocumentRepository'

export type MissionPayload = {
  missions: Mission[]
}

export class MissionService {
  async get(
    expeditionId: string,
  ): Promise<SharedDocument<MissionPayload> | null> {
    return sharedDocumentRepository.get<MissionPayload>(
      expeditionId,
      'missions',
    )
  }

  async save(
    expeditionId: string,
    payload: MissionPayload,
    userId: string,
  ): Promise<SharedDocument<MissionPayload>> {
    return sharedDocumentRepository.save<MissionPayload>(
      expeditionId,
      'missions',
      payload,
      userId,
    )
  }
}

export const missionService = new MissionService()