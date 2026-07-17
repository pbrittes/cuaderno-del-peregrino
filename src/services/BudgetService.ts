import type { BudgetItem } from '../data/orcamento'
import type { SharedDocument } from '../types/database'

import { sharedDocumentRepository } from '../repositories/SharedDocumentRepository'

export type BudgetPayload = {
  items: BudgetItem[]
}

export class BudgetService {
  async get(
    expeditionId: string,
  ): Promise<
    SharedDocument<BudgetPayload> | null
  > {
    return sharedDocumentRepository.get<
      BudgetPayload
    >(
      expeditionId,
      'budget',
    )
  }

  async save(
    expeditionId: string,
    items: BudgetItem[],
    userId: string,
  ): Promise<
    SharedDocument<BudgetPayload>
  > {
    return sharedDocumentRepository.save<
      BudgetPayload
    >(
      expeditionId,
      'budget',
      {
        items,
      },
      userId,
    )
  }
}

export const budgetService =
  new BudgetService()