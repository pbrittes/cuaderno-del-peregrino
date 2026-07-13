import type { Pilgrim } from './backpacks'

export type BudgetItem = {
  id: string
  gearItemId: string
  pilgrim: Pilgrim
  estimatedAmount: number
  paidAmount: number
  notes: string
}

export type BudgetItemData = Omit<BudgetItem, 'id'>

export type PilgrimBudgetSummary = {
  pilgrim: Pilgrim
  estimatedTotal: number
  paidTotal: number
  remainingToSpend: number
  savingsTotal: number
}