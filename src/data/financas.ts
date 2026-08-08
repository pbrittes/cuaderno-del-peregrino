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

export type ParticipantPayment = {
  paid: boolean
  paidAt?: string
}

export type ParticipantPayments = Partial<
  Record<Pilgrim, ParticipantPayment>
>

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

  /**
   * Competência financeira no formato AAAA-MM.
   *
   * Temporariamente opcional para manter compatibilidade
   * com despesas antigas já salvas.
   */
  competence?: string

  /**
   * Identificador comum das parcelas de uma mesma compra.
   * Ausente em despesas à vista.
   */
  installmentGroupId?: string

  /**
   * Número da parcela atual.
   * Exemplo: 1 em uma compra dividida em 3 vezes.
   */
  installmentNumber?: number

  /**
   * Quantidade total de parcelas.
   * Exemplo: 3 em uma compra dividida em 3 vezes.
   */
  installmentCount?: number

  /**
   * Situação do pagamento de cada participante
   * nesta parcela.
   *
   * Somente participantes incluídos na despesa
   * precisam possuir um registro.
   */
  participantPayments?: ParticipantPayments

  /**
   * Campo antigo de pagamento geral.
   *
   * Mantido temporariamente para compatibilidade
   * com despesas já salvas.
   */
  paid?: boolean

  /**
   * Campo antigo da data de pagamento geral.
   *
   * Mantido temporariamente para compatibilidade
   * com despesas já salvas.
   */
  paidAt?: string

  notes: string
}

export type Settlement = {
  id: string

  from: Pilgrim
  to: Pilgrim

  amount: number
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