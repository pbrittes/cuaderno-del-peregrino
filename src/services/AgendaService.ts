import type { AgendaEvent } from '../data/agenda'
import type { SharedDocument } from '../types/database'

import { sharedDocumentRepository } from '../repositories/SharedDocumentRepository'

export type AgendaPayload = {
  events: AgendaEvent[]
}

export class AgendaService {
  async get(
    expeditionId: string,
  ): Promise<SharedDocument<AgendaPayload> | null> {
    return sharedDocumentRepository.get<AgendaPayload>(
      expeditionId,
      'agenda',
    )
  }

  async save(
    expeditionId: string,
    events: AgendaEvent[],
    userId: string,
  ): Promise<SharedDocument<AgendaPayload>> {
    return sharedDocumentRepository.save<AgendaPayload>(
      expeditionId,
      'agenda',
      {
        events,
      },
      userId,
    )
  }
}

export const agendaService = new AgendaService()