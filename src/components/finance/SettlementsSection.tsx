import {
  useMemo,
  useState,
  type FormEvent,
} from 'react'

import type {
  Expense,
  Pilgrim,
  Settlement,
} from '../../data/financas'
import { calculateSettlements } from '../../data/financasSettlementEngine'
import { DeleteIcon, EditIcon } from '../icons/AppIcons'

type CreateSettlementInput = Omit<Settlement, 'id'>

export type SettlementQuery = {
  startDate?: string
  endDate?: string
  fromFilter: Pilgrim | 'all'
  toFilter: Pilgrim | 'all'
  statusFilter:
    | 'all'
    | 'pending'
    | 'settled'
  sortOption:
    | 'highest'
    | 'lowest'
    | 'payer'
    | 'receiver'
}

type SettlementsSectionProps = {
  expenses: Expense[]
  settlements?: Settlement[]
  query?: SettlementQuery
  addSettlement?: (
    settlement: CreateSettlementInput,
  ) => void
  updateSettlement?: (
    settlement: Settlement,
  ) => void
  deleteSettlement?: (
    settlementId: string,
  ) => void
}

type SettlementDebt = ReturnType<
  typeof calculateSettlements
>[number]

type NetSettlement = {
  from: SettlementDebt['from']
  to: SettlementDebt['to']
  amount: number
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function formatDate(date: string) {
  if (!date) {
    return ''
  }

  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}

function getCurrentDate() {
  return new Date().toISOString().slice(0, 10)
}

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100
}


function getPairKey(
  first: SettlementDebt['from'],
  second: SettlementDebt['to'],
) {
  return [first, second].sort().join('::')
}

function calculateNetSettlements(
  debts: SettlementDebt[],
  registeredSettlements: Settlement[],
): NetSettlement[] {
  const balances = new Map<
    string,
    {
      first: SettlementDebt['from']
      second: SettlementDebt['to']
      balance: number
    }
  >()

  const activePairs = new Set(
    debts.map((debt) =>
      getPairKey(debt.from, debt.to),
    ),
  )

  function addMovement(
    from: SettlementDebt['from'],
    to: SettlementDebt['to'],
    amount: number,
  ) {
    const [first, second] = [from, to].sort() as [
      SettlementDebt['from'],
      SettlementDebt['to'],
    ]
    const key = getPairKey(first, second)
    const current = balances.get(key) ?? {
      first,
      second,
      balance: 0,
    }

    const direction = from === first ? 1 : -1

    balances.set(key, {
      ...current,
      balance: roundCurrency(
        current.balance + amount * direction,
      ),
    })
  }

  debts.forEach((debt) => {
    addMovement(debt.from, debt.to, debt.amount)
  })

  registeredSettlements.forEach((settlement) => {
    if (
      !activePairs.has(
        getPairKey(
          settlement.from,
          settlement.to,
        ),
      )
    ) {
      return
    }

    addMovement(
      settlement.from,
      settlement.to,
      -settlement.amount,
    )
  })

  return Array.from(balances.values())
    .map(({ first, second, balance }) => {
      const roundedBalance = roundCurrency(balance)

      if (roundedBalance > 0) {
        return {
          from: first,
          to: second,
          amount: roundedBalance,
        }
      }

      return {
        from: second,
        to: first,
        amount: Math.abs(roundedBalance),
      }
    })
    .filter((settlement) => settlement.amount > 0)
}

function getPaymentsForDebt(
  debt: SettlementDebt,
  registeredSettlements: Settlement[],
) {
  return registeredSettlements.filter(
    (settlement) =>
      (settlement.from === debt.from &&
        settlement.to === debt.to) ||
      (settlement.from === debt.to &&
        settlement.to === debt.from),
  )
}

export function SettlementsSection({
  expenses,
  settlements = [],
  query,
  addSettlement,
  updateSettlement,
  deleteSettlement,
}: SettlementsSectionProps) {
  const calculatedSettlements =
    calculateSettlements(expenses)

  const {
    startDate = '',
    endDate = '',
    fromFilter = 'all',
    toFilter = 'all',
    statusFilter = 'all',
    sortOption = 'highest',
  } = query ?? {}

  const [selectedDebt, setSelectedDebt] =
    useState<SettlementDebt | null>(null)

  const [editingSettlement, setEditingSettlement] =
    useState<Settlement | null>(null)

  const [isChoosingDebt, setIsChoosingDebt] =
    useState(false)

  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(getCurrentDate())
  const [notes, setNotes] = useState('')

  const settlementSummaries = useMemo(
    () =>
      calculatedSettlements.map((debt) => {
        const payments = getPaymentsForDebt(
          debt,
          settlements,
        )

        const netPaid = roundCurrency(
          payments.reduce(
            (total, payment) => {
              const sameDirection =
                payment.from === debt.from &&
                payment.to === debt.to

              return roundCurrency(
                total +
                  (sameDirection
                    ? payment.amount
                    : -payment.amount),
              )
            },
            0,
          ),
        )

        const paid = roundCurrency(
          Math.max(netPaid, 0),
        )

        const remaining = roundCurrency(
          Math.max(debt.amount - netPaid, 0),
        )

        const credit = roundCurrency(
          Math.max(netPaid - debt.amount, 0),
        )

        return {
          debt,
          payments,
          paid,
          remaining,
          credit,
          settled: remaining <= 0,
        }
      }),
    [calculatedSettlements, settlements],
  )

  const pendingSettlements = useMemo(
    () =>
      calculateNetSettlements(
        calculatedSettlements,
        settlements,
      ),
    [calculatedSettlements, settlements],
  )

  const visibleSettlementSummaries = useMemo(() => {
    const filteredSummaries = settlementSummaries.filter(
      (summary) => {
        const { debt, payments, settled } = summary

        if (
          fromFilter !== 'all' &&
          debt.from !== fromFilter
        ) {
          return false
        }

        if (
          toFilter !== 'all' &&
          debt.to !== toFilter
        ) {
          return false
        }

        const isPending = !settled

        if (
          statusFilter === 'pending' &&
          !isPending
        ) {
          return false
        }

        if (
          statusFilter === 'settled' &&
          !settled
        ) {
          return false
        }

        if (startDate || endDate) {
          const hasPaymentInPeriod = payments.some(
            (payment) => {
              if (
                startDate &&
                payment.date < startDate
              ) {
                return false
              }

              if (
                endDate &&
                payment.date > endDate
              ) {
                return false
              }

              return true
            },
          )

          if (!hasPaymentInPeriod) {
            return false
          }
        }

        return true
      },
    )

    return [...filteredSummaries].sort((a, b) => {
      if (sortOption === 'lowest') {
        return a.debt.amount - b.debt.amount
      }

      if (sortOption === 'payer') {
        return (
          a.debt.from.localeCompare(b.debt.from) ||
          a.debt.to.localeCompare(b.debt.to)
        )
      }

      if (sortOption === 'receiver') {
        return (
          a.debt.to.localeCompare(b.debt.to) ||
          a.debt.from.localeCompare(b.debt.from)
        )
      }

      return b.debt.amount - a.debt.amount
    })
  }, [
    settlementSummaries,
    startDate,
    endDate,
    fromFilter,
    toFilter,
    statusFilter,
    sortOption,
  ])

  const visiblePendingSettlements = useMemo(() => {
    if (
      statusFilter === 'settled' ||
      startDate ||
      endDate
    ) {
      return []
    }

    return pendingSettlements
      .filter((settlement) => {
        if (
          fromFilter !== 'all' &&
          settlement.from !== fromFilter
        ) {
          return false
        }

        if (
          toFilter !== 'all' &&
          settlement.to !== toFilter
        ) {
          return false
        }

        const relatedSummary =
          settlementSummaries.find(
            (summary) =>
              summary.debt.from === settlement.from &&
              summary.debt.to === settlement.to,
          )

        if (!relatedSummary) {
          return statusFilter === 'all'
        }

        const isPending =
          !relatedSummary.settled

        if (
          statusFilter === 'pending' &&
          !isPending
        ) {
          return false
        }

        return true
      })
      .sort((a, b) => {
        if (sortOption === 'lowest') {
          return a.amount - b.amount
        }

        if (sortOption === 'payer') {
          return (
            a.from.localeCompare(b.from) ||
            a.to.localeCompare(b.to)
          )
        }

        if (sortOption === 'receiver') {
          return (
            a.to.localeCompare(b.to) ||
            a.from.localeCompare(b.from)
          )
        }

        return b.amount - a.amount
      })
  }, [
    pendingSettlements,
    settlementSummaries,
    startDate,
    endDate,
    fromFilter,
    toFilter,
    statusFilter,
    sortOption,
  ])

  const orphanSettlements = useMemo(() => {
    const activePairs = new Set(
      calculatedSettlements.map((debt) =>
        getPairKey(debt.from, debt.to),
      ),
    )

    return settlements.filter(
      (settlement) =>
        !activePairs.has(
          getPairKey(
            settlement.from,
            settlement.to,
          ),
        ),
    )
  }, [calculatedSettlements, settlements])

  const visibleOrphanSettlements = useMemo(() => {
    if (
      statusFilter !== 'all' &&
      statusFilter !== 'pending'
    ) {
      return []
    }

    return orphanSettlements
      .filter((payment) => {
        if (
          fromFilter !== 'all' &&
          payment.from !== fromFilter
        ) {
          return false
        }

        if (
          toFilter !== 'all' &&
          payment.to !== toFilter
        ) {
          return false
        }

        if (
          startDate &&
          payment.date < startDate
        ) {
          return false
        }

        if (
          endDate &&
          payment.date > endDate
        ) {
          return false
        }

        return true
      })
      .sort((a, b) => {
        if (sortOption === 'lowest') {
          return a.amount - b.amount
        }

        if (sortOption === 'payer') {
          return (
            a.from.localeCompare(b.from) ||
            a.to.localeCompare(b.to)
          )
        }

        if (sortOption === 'receiver') {
          return (
            a.to.localeCompare(b.to) ||
            a.from.localeCompare(b.from)
          )
        }

        return b.amount - a.amount
      })
  }, [
    orphanSettlements,
    startDate,
    endDate,
    fromFilter,
    toFilter,
    statusFilter,
    sortOption,
  ])

  function resetForm() {
    setSelectedDebt(null)
    setEditingSettlement(null)
    setIsChoosingDebt(false)
    setAmount('')
    setDate(getCurrentDate())
    setNotes('')
  }

  function startNewPayment(
    debt: SettlementDebt,
    remaining: number,
  ) {
    setSelectedDebt(debt)
    setEditingSettlement(null)
    setIsChoosingDebt(false)
    setAmount(
      remaining > 0
        ? remaining.toFixed(2).replace('.', ',')
        : '',
    )
    setDate(getCurrentDate())
    setNotes('')
  }

  function startEditingPayment(
    settlement: Settlement,
    debt: SettlementDebt,
  ) {
    setSelectedDebt(debt)
    setEditingSettlement(settlement)
    setIsChoosingDebt(false)
    setAmount(
      settlement.amount
        .toFixed(2)
        .replace('.', ','),
    )
    setDate(settlement.date)
    setNotes(settlement.notes)
  }

  function parseAmount(value: string) {
    const normalizedValue = value
      .trim()
      .replace(/\s/g, '')
      .replace(/\./g, '')
      .replace(',', '.')

    return Number(normalizedValue)
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (!selectedDebt) {
      return
    }

    const parsedAmount = parseAmount(amount)

    if (
      !Number.isFinite(parsedAmount) ||
      parsedAmount <= 0 ||
      !date
    ) {
      return
    }

    if (editingSettlement) {
      updateSettlement?.({
        ...editingSettlement,
        from: editingSettlement.from,
        to: editingSettlement.to,
        amount: roundCurrency(parsedAmount),
        date,
        notes: notes.trim(),
      })
    } else {
      addSettlement?.({
        from: selectedDebt.from,
        to: selectedDebt.to,
        amount: roundCurrency(parsedAmount),
        date,
        notes: notes.trim(),
      })
    }

    resetForm()
  }

  function handleDelete(settlementId: string) {
    const confirmed = window.confirm(
      'Excluir este pagamento registrado?',
    )

    if (!confirmed) {
      return
    }

    deleteSettlement?.(settlementId)

    if (
      editingSettlement?.id === settlementId
    ) {
      resetForm()
    }
  }

  function handleOpenPayment() {
    if (pendingSettlements.length === 0) {
      return
    }

    setSelectedDebt(null)
    setEditingSettlement(null)
    setAmount('')
    setDate(getCurrentDate())
    setNotes('')
    setIsChoosingDebt((current) => !current)
  }

  return (
    <section className="finance-section settlements-section">
      <div className="section-header">
        <p className="eyebrow">
          Acertos Financeiros
        </p>

        <button
          className="section-add-button"
          type="button"
          title="Registrar pagamento"
          aria-label="Registrar pagamento"
          onClick={handleOpenPayment}
          disabled={
            !addSettlement || pendingSettlements.length === 0
          }
        >
          +
        </button>
      </div>

      {isChoosingDebt && (
        <div className="settlement-form">
          <p className="settlement-form-title">
            Selecione o acerto
          </p>

          <div className="settlement-form-actions">
            {pendingSettlements.map((settlement) => (
              <button
                key={`${settlement.from}-${settlement.to}`}
                type="button"
                className="finance-button finance-button-secondary"
                onClick={() =>
                  startNewPayment(
                    settlement,
                    settlement.amount,
                  )
                }
              >
                {settlement.from} → {settlement.to} ·{' '}
                {formatCurrency(settlement.amount)}
              </button>
            ))}
          </div>
        </div>
      )}

      {pendingSettlements.length === 0 ? (
        <div className="empty-state">
          <p>
            Todas as contas estão acertadas. 🎉
          </p>
        </div>
      ) : visiblePendingSettlements.length === 0 ? (
        <div className="empty-state">
          <p>
            Nenhum acerto pendente encontrado com estes filtros.
          </p>
        </div>
      ) : (
        <div className="expenses-list settlements-balance-list">
          {visiblePendingSettlements.map((settlement) => (
            <article
              key={`${settlement.from}-${settlement.to}`}
              className="expense-placeholder settlement-balance-card"
            >
              <div className="settlement-balance-content">
                <div className="settlement-person settlement-person-from">
                  <span>Quem paga</span>
                  <strong>{settlement.from}</strong>
                </div>

                <div className="settlement-person settlement-person-to">
                  <span>Quem recebe</span>
                  <strong>{settlement.to}</strong>
                </div>

                <div className="settlement-balance-value">
                  <span>Valor pendente</span>
                  <strong className="settlement-balance-amount">
                    {formatCurrency(settlement.amount)}
                  </strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {visibleSettlementSummaries.length > 0 && (
        <div className="expenses-list settlement-groups">
          {visibleSettlementSummaries.map(
            ({
              debt,
              payments,
              paid,
              remaining,
              settled,
              credit,
            }) => (
              <article
                key={`${debt.from}-${debt.to}`}
                className={`expense-placeholder settlement-group-card ${
                  settled
                    ? 'settlement-group-card-settled'
                    : payments.length > 0
                      ? 'settlement-group-card-partial'
                      : 'settlement-group-card-pending'
                }`}
              >
                <div className="settlement-group-header">
                  <div className="settlement-route-details">
                    <div className="settlement-person settlement-person-from">
                      <span>Quem paga</span>
                      <strong>{debt.from}</strong>
                    </div>

                    <div className="settlement-person settlement-person-to">
                      <span>Quem recebe</span>
                      <strong>{debt.to}</strong>
                    </div>
                  </div>

                  <span className="settlement-group-status">
                    {credit > 0
                      ? 'Crédito gerado'
                      : settled
                        ? 'Pagamento concluído'
                      : payments.length > 0
                        ? 'Pagamento parcial'
                        : 'Pagamento pendente'}
                  </span>
                </div>

                <div className="settlement-financial-summary">
                  <div className="settlement-financial-item">
                    <span>Valor do acerto</span>
                    <strong>
                      {formatCurrency(debt.amount)}
                    </strong>
                  </div>

                  <div className="settlement-financial-item">
                    <span>Valor pago</span>
                    <strong>
                      {formatCurrency(paid)}
                    </strong>
                  </div>

                  <div className="settlement-financial-item settlement-financial-item-remaining">
                    <span>
                      {credit > 0
                        ? 'Crédito'
                        : 'Valor restante'}
                    </span>
                    <strong>
                      {formatCurrency(
                        credit > 0 ? credit : remaining,
                      )}
                    </strong>
                  </div>
                </div>

                {selectedDebt &&
                  !editingSettlement &&
                  selectedDebt.from === debt.from &&
                  selectedDebt.to === debt.to && (
                  <form
                    className="settlement-form"
                    onSubmit={handleSubmit}
                  >
                    <p className="settlement-form-title">
                      {editingSettlement
                        ? `Editar pagamento — ${selectedDebt.from} → ${selectedDebt.to}`
                        : `Registrar pagamento — ${selectedDebt.from} → ${selectedDebt.to}`}
                    </p>

                    <div className="settlement-form-grid">
                      <label className="settlement-form-field">
                        <span>Valor pago</span>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={amount}
                          onChange={(event)=>setAmount(event.target.value)}
                          required
                        />
                      </label>

                      <label className="settlement-form-field">
                        <span>Data</span>
                        <input
                          type="date"
                          value={date}
                          onChange={(event)=>setDate(event.target.value)}
                          required
                        />
                      </label>

                      <label className="settlement-form-field settlement-form-notes">
                        <span>Observações</span>
                        <textarea
                          value={notes}
                          onChange={(event)=>setNotes(event.target.value)}
                        />
                      </label>
                    </div>

                    <div className="settlement-form-actions">
                      <button
                        type="submit"
                        className="finance-button finance-button-primary"
                      >
                        {editingSettlement
                          ? 'Salvar alterações'
                          : 'Confirmar pagamento'}
                      </button>

                      <button
                        type="button"
                        className="finance-button finance-button-secondary"
                        onClick={resetForm}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                )}

                {payments.length > 0 ? (
                  <div className="settlement-payments">
                    <p className="settlement-payments-title">
                      Histórico de pagamentos
                    </p>

                    <div className="settlement-payments-list">
                      {payments.map((payment) => (
                        <div key={payment.id}>
                          <div
                            className="expense-placeholder settlement-payment-card"
                          >
                            <div className="settlement-payment-content">
                              <span className="settlement-payment-date">
                                {formatDate(
                                  payment.date,
                                )}{' · '}
                                {payment.from} → {payment.to}
                              </span>

                              <strong className="settlement-payment-amount">
                                {formatCurrency(
                                  payment.amount,
                                )}
                              </strong>

                              {payment.notes && (
                                <p className="settlement-payment-notes">
                                  {payment.notes}
                                </p>
                              )}
                            </div>

                            <div className="settlement-payment-actions">
                              <button
                                type="button"
                                className="icon-button settlement-action-button"
                                onClick={() =>
                                  startEditingPayment(
                                    payment,
                                    debt,
                                  )
                                }
                                disabled={
                                  !updateSettlement
                                }
                                aria-label="Editar pagamento"
                                title="Editar pagamento"
                              >
                                <EditIcon size={18} />
                              </button>

                              <button
                                type="button"
                                className="icon-button settlement-action-button settlement-delete-button"
                                onClick={() =>
                                  handleDelete(
                                    payment.id,
                                  )
                                }
                                disabled={
                                  !deleteSettlement
                                }
                                aria-label="Excluir pagamento"
                                title="Excluir pagamento"
                              >
                                <DeleteIcon size={18} />
                              </button>
                            </div>
                          </div>

                          {editingSettlement?.id === payment.id &&
                            selectedDebt &&
                            selectedDebt.from === debt.from &&
                            selectedDebt.to === debt.to && (
                              <form
                                className="settlement-form"
                                onSubmit={handleSubmit}
                              >
                                <p className="settlement-form-title">
                                  {`Editar pagamento — ${selectedDebt.from} → ${selectedDebt.to}`}
                                </p>

                                <div className="settlement-form-grid">
                                  <label className="settlement-form-field">
                                    <span>Valor pago</span>
                                    <input
                                      type="text"
                                      inputMode="decimal"
                                      value={amount}
                                      onChange={(event) =>
                                        setAmount(event.target.value)
                                      }
                                      required
                                    />
                                  </label>

                                  <label className="settlement-form-field">
                                    <span>Data</span>
                                    <input
                                      type="date"
                                      value={date}
                                      onChange={(event) =>
                                        setDate(event.target.value)
                                      }
                                      required
                                    />
                                  </label>

                                  <label className="settlement-form-field settlement-form-notes">
                                    <span>Observações</span>
                                    <textarea
                                      value={notes}
                                      onChange={(event) =>
                                        setNotes(event.target.value)
                                      }
                                    />
                                  </label>
                                </div>

                                <div className="settlement-form-actions">
                                  <button
                                    type="submit"
                                    className="finance-button finance-button-primary"
                                  >
                                    Salvar alterações
                                  </button>

                                  <button
                                    type="button"
                                    className="finance-button finance-button-secondary"
                                    onClick={resetForm}
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              </form>
                            )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="settlement-payments-empty">
                    Nenhum pagamento registrado.
                  </p>
                )}

              </article>
            ),
          )}
        </div>
      )}


      {visibleOrphanSettlements.length > 0 && (
        <div className="expenses-list settlement-groups">
          {visibleOrphanSettlements.map((payment) => (
            <article
              key={payment.id}
              className="expense-placeholder settlement-group-card settlement-group-card-pending"
            >
              <div className="settlement-group-header">
                <div className="settlement-route-details">
                  <div className="settlement-person settlement-person-from">
                    <span>Quem pagou</span>
                    <strong>{payment.from}</strong>
                  </div>

                  <div className="settlement-person settlement-person-to">
                    <span>Quem recebeu</span>
                    <strong>{payment.to}</strong>
                  </div>
                </div>

                <span className="settlement-group-status">
                  Sem acerto ativo
                </span>
              </div>

              <div className="settlement-payments">
                <p className="settlement-payments-title">
                  Pagamento registrado
                </p>

                <div className="settlement-payments-list">
                  <div className="expense-placeholder settlement-payment-card">
                    <div className="settlement-payment-content">
                      <span className="settlement-payment-date">
                        {formatDate(payment.date)}{' · '}
                        {payment.from} → {payment.to}
                      </span>

                      <strong className="settlement-payment-amount">
                        {formatCurrency(payment.amount)}
                      </strong>

                      {payment.notes && (
                        <p className="settlement-payment-notes">
                          {payment.notes}
                        </p>
                      )}
                    </div>

                    <div className="settlement-payment-actions">
                      <button
                        type="button"
                        className="icon-button settlement-action-button settlement-delete-button"
                        onClick={() =>
                          handleDelete(payment.id)
                        }
                        disabled={!deleteSettlement}
                        aria-label="Excluir pagamento"
                        title="Excluir pagamento"
                      >
                        <DeleteIcon size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

    </section>
  )
}