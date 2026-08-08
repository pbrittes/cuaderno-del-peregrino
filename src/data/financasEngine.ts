import type {
  Expense,
  ExpenseCategory,
  Pilgrim,
} from './financas'

export type FinanceCategorySummary = {
  category: ExpenseCategory
  total: number
  percentage: number
}

export type FinancialSettlement = {
  from: Pilgrim
  to: Pilgrim
  amountInBRL: number
}

export type FinanceDebt = {
  from: Pilgrim
  to: Pilgrim
  amount: number
}

export type FinanceSummary = {
  totalTrip: number

  people: Record<
    Pilgrim,
    {
      paid: number
      consumed: number
      balance: number
    }
  >

  categories: FinanceCategorySummary[]
  debts: FinanceDebt[]
}

const pilgrims: Pilgrim[] = ['Pri', 'Tania', 'Andrea']

const categories: ExpenseCategory[] = [
  'alimentacao',
  'hospedagem',
  'transporte',
  'compras',
  'saude',
  'ingressos',
  'outros',
]

function round(value: number) {
  return Math.round(value * 100) / 100
}

function hasParticipantPaid(
  expense: Expense,
  participant: Pilgrim,
) {
  const participantPayment =
    expense.participantPayments?.[participant]

  if (participantPayment) {
    return participantPayment.paid === true
  }

  return expense.paid === true
}

function calculateCategoryTotals(expenses: Expense[]) {
  const totals: Record<ExpenseCategory, number> = {
    alimentacao: 0,
    hospedagem: 0,
    transporte: 0,
    compras: 0,
    saude: 0,
    ingressos: 0,
    outros: 0,
  }

  let totalTrip = 0

  for (const expense of expenses) {
    totals[expense.category] += expense.amountInBRL
    totalTrip += expense.amountInBRL
  }

  return {
    totals,
    totalTrip: round(totalTrip),
  }
}

function createPeopleSummary(): FinanceSummary['people'] {
  return {
    Pri: { paid: 0, consumed: 0, balance: 0 },
    Tania: { paid: 0, consumed: 0, balance: 0 },
    Andrea: { paid: 0, consumed: 0, balance: 0 },
  }
}

function createDebtMatrix() {
  return pilgrims.reduce(
    (matrix, from) => {
      matrix[from] = pilgrims.reduce(
        (row, to) => {
          row[to] = 0
          return row
        },
        {} as Record<Pilgrim, number>,
      )

      return matrix
    },
    {} as Record<Pilgrim, Record<Pilgrim, number>>,
  )
}

function calculateGrossDebts(expenses: Expense[]) {
  const debts = createDebtMatrix()

  for (const expense of expenses) {
    if (expense.participants.length === 0) {
      continue
    }

    const share = round(
      expense.amountInBRL /
        expense.participants.length,
    )

    for (const participant of expense.participants) {
      if (participant === expense.paidBy) {
        continue
      }

      if (
        hasParticipantPaid(
          expense,
          participant,
        )
      ) {
        continue
      }

      debts[participant][expense.paidBy] = round(
        debts[participant][expense.paidBy] + share,
      )
    }
  }

  return debts
}

function applySettlements(
  debts: Record<Pilgrim, Record<Pilgrim, number>>,
  settlements: FinancialSettlement[],
) {
  for (const settlement of settlements) {
    if (
      settlement.from === settlement.to ||
      settlement.amountInBRL <= 0
    ) {
      continue
    }

    debts[settlement.from][settlement.to] = round(
      debts[settlement.from][settlement.to] -
        settlement.amountInBRL,
    )
  }
}

function compensateReciprocalDebts(
  debts: Record<Pilgrim, Record<Pilgrim, number>>,
) {
  for (
    let fromIndex = 0;
    fromIndex < pilgrims.length;
    fromIndex += 1
  ) {
    for (
      let toIndex = fromIndex + 1;
      toIndex < pilgrims.length;
      toIndex += 1
    ) {
      const from = pilgrims[fromIndex]
      const to = pilgrims[toIndex]

      const netAmount = round(
        debts[from][to] - debts[to][from],
      )

      if (netAmount > 0) {
        debts[from][to] = netAmount
        debts[to][from] = 0
      } else if (netAmount < 0) {
        debts[from][to] = 0
        debts[to][from] = Math.abs(netAmount)
      } else {
        debts[from][to] = 0
        debts[to][from] = 0
      }
    }
  }
}

function convertDebtMatrixToList(
  debts: Record<Pilgrim, Record<Pilgrim, number>>,
) {
  const debtList: FinanceDebt[] = []

  for (const from of pilgrims) {
    for (const to of pilgrims) {
      if (from === to) {
        continue
      }

      const amount = round(debts[from][to])

      if (amount <= 0) {
        continue
      }

      debtList.push({
        from,
        to,
        amount,
      })
    }
  }

  return debtList.sort((a, b) => b.amount - a.amount)
}

function calculateBaseDebts(expenses: Expense[]) {
  const debtMatrix = calculateGrossDebts(expenses)

  compensateReciprocalDebts(debtMatrix)

  return convertDebtMatrixToList(debtMatrix)
}

function calculatePeople(
  expenses: Expense[],
  baseDebts: FinanceDebt[],
  settlements: FinancialSettlement[],
) {
  const people = createPeopleSummary()

  for (const expense of expenses) {
    const amount = expense.amountInBRL

    people[expense.paidBy].paid += amount

    const share =
      expense.participants.length === 0
        ? 0
        : amount / expense.participants.length

    for (const participant of expense.participants) {
      people[participant].consumed += share
    }
  }

  for (const debt of baseDebts) {
    people[debt.from].balance -= debt.amount
    people[debt.to].balance += debt.amount
  }

  for (const settlement of settlements) {
    if (
      settlement.from === settlement.to ||
      settlement.amountInBRL <= 0
    ) {
      continue
    }

    people[settlement.from].balance +=
      settlement.amountInBRL

    people[settlement.to].balance -=
      settlement.amountInBRL
  }

  for (const pilgrim of pilgrims) {
    people[pilgrim].paid = round(
      people[pilgrim].paid,
    )
    people[pilgrim].consumed = round(
      people[pilgrim].consumed,
    )
    people[pilgrim].balance = round(
      people[pilgrim].balance,
    )
  }

  return people
}

function calculateDebts(
  expenses: Expense[],
  settlements: FinancialSettlement[],
) {
  const debtMatrix = calculateGrossDebts(expenses)

  applySettlements(debtMatrix, settlements)
  compensateReciprocalDebts(debtMatrix)

  return convertDebtMatrixToList(debtMatrix)
}

export function calculateFinanceSummary(
  expenses: Expense[],
  settlements: FinancialSettlement[] = [],
): FinanceSummary {
  const { totals, totalTrip } =
    calculateCategoryTotals(expenses)

  const baseDebts = calculateBaseDebts(expenses)

  const debts = calculateDebts(
    expenses,
    settlements,
  )

  const people = calculatePeople(
    expenses,
    baseDebts,
    settlements,
  )

  const summary: FinanceSummary = {
    totalTrip,
    people,
    debts,
    categories: categories
      .map((category) => {
        const total = round(totals[category])

        return {
          category,
          total,
          percentage:
            totalTrip === 0
              ? 0
              : round((total / totalTrip) * 100),
        }
      })
      .filter((item) => item.total > 0)
      .sort((a, b) => b.total - a.total),
  }

  return summary
}