import type {
  Expedition,
  ExpeditionMember,
} from '../types/database'

import { expeditionRepository } from '../repositories'

export class ExpeditionService {
  async getCurrent(userId: string): Promise<Expedition | null> {
    return expeditionRepository.getCurrent(userId)
  }

  async createDefault(userId: string): Promise<Expedition> {
    return expeditionRepository.create(
      'Santiago 2026',
      userId,
    )
  }

  async addMemberByEmail(
    expeditionId: string,
    email: string,
  ): Promise<void> {
    return expeditionRepository.addMemberByEmail(
      expeditionId,
      email,
    )
  }

  async removeMember(
    expeditionId: string,
    userId: string,
  ): Promise<void> {
    return expeditionRepository.removeMember(
      expeditionId,
      userId,
    )
  }

  async getMembers(
    expeditionId: string,
  ): Promise<ExpeditionMember[]> {
    return expeditionRepository.getMembers(
      expeditionId,
    )
  }
}

export const expeditionService =
  new ExpeditionService()