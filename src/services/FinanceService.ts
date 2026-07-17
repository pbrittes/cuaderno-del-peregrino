import type { Expense } from '../data/financas'
import type { SharedDocument } from '../types/database'

import { sharedDocumentRepository } from '../repositories/SharedDocumentRepository'

export type FinancePayload = {
  expenses: Expense[]
}

export class FinanceService {
  async get(
    expeditionId: string,
  ): Promise<SharedDocument<FinancePayload> | null> {
    return sharedDocumentRepository.get<FinancePayload>(
      expeditionId,
      'finance',
    )
  }

  async save(
    expeditionId: string,
    payload: FinancePayload,
    userId: string,
  ): Promise<SharedDocument<FinancePayload>> {
    return sharedDocumentRepository.save<FinancePayload>(
      expeditionId,
      'finance',
      payload,
      userId,
    )
  }
}

export const financeService = new FinanceService()