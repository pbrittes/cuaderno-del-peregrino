export type Currency = 'BRL' | 'EUR'

export type ExpenseCategory =
  | 'alimentacao'
  | 'hospedagem'
  | 'transporte'
  | 'compras'
  | 'saude'
  | 'ingressos'
  | 'outros'

export type Pilgrim = 'Pri' | 'Tania' | 'Andrea'

export type Expense = {
  id: string

  title: string
  category: ExpenseCategory

  amount: number
  currency: Currency

  exchangeRate: number
  amountInBRL: number

  paidBy: Pilgrim
  participants: Pilgrim[]

  date: string

  notes: string
}

export const expenseCategories: Array<{
  value: ExpenseCategory
  label: string
}> = [
  {
    value: 'alimentacao',
    label: 'Alimentação',
  },
  {
    value: 'hospedagem',
    label: 'Hospedagem',
  },
  {
    value: 'transporte',
    label: 'Transporte',
  },
  {
    value: 'compras',
    label: 'Compras',
  },
  {
    value: 'saude',
    label: 'Saúde',
  },
  {
    value: 'ingressos',
    label: 'Ingressos',
  },
  {
    value: 'outros',
    label: 'Outros',
  },
]

export const pilgrims: Pilgrim[] = [
  'Pri',
  'Tania',
  'Andrea',
]