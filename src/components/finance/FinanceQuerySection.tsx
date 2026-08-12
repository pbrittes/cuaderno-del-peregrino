import {
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'

import type {
  ExpenseCategory,
  Pilgrim,
} from '../../data/financas'
import {
  expenseCategories,
  pilgrims,
} from '../../data/financas'

import './FinanceQuerySection.css'

export type FinanceQueryType =
  | 'expenses'
  | 'settlements'

export type ExpenseSortOption =
  | 'newest'
  | 'oldest'
  | 'highest'
  | 'lowest'

export type SettlementStatusFilter =
  | 'all'
  | 'pending'
  | 'settled'

export type SettlementSortOption =
  | 'highest'
  | 'lowest'
  | 'payer'
  | 'receiver'

type FinanceQuerySectionProps = {
  queryType: FinanceQueryType
  setQueryType: Dispatch<
    SetStateAction<FinanceQueryType>
  >

  startDate: string
  setStartDate: Dispatch<
    SetStateAction<string>
  >

  endDate: string
  setEndDate: Dispatch<
    SetStateAction<string>
  >

  categoryFilter:
    | ExpenseCategory
    | 'all'
  setCategoryFilter: Dispatch<
    SetStateAction<
      ExpenseCategory | 'all'
    >
  >

  paidByFilter: Pilgrim | 'all'
  setPaidByFilter: Dispatch<
    SetStateAction<Pilgrim | 'all'>
  >

  participantFilter:
    | Pilgrim
    | 'all'
  setParticipantFilter: Dispatch<
    SetStateAction<Pilgrim | 'all'>
  >

  sortOption: ExpenseSortOption
  setSortOption: Dispatch<
    SetStateAction<ExpenseSortOption>
  >

  settlementFromFilter?:
    | Pilgrim
    | 'all'
  setSettlementFromFilter?: Dispatch<
    SetStateAction<Pilgrim | 'all'>
  >

  settlementToFilter?:
    | Pilgrim
    | 'all'
  setSettlementToFilter?: Dispatch<
    SetStateAction<Pilgrim | 'all'>
  >

  settlementStatusFilter?: SettlementStatusFilter
  setSettlementStatusFilter?: Dispatch<
    SetStateAction<SettlementStatusFilter>
  >

  settlementSortOption?: SettlementSortOption
  setSettlementSortOption?: Dispatch<
    SetStateAction<SettlementSortOption>
  >

}

export function FinanceQuerySection({
  queryType,
  setQueryType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  categoryFilter,
  setCategoryFilter,
  paidByFilter,
  setPaidByFilter,
  participantFilter,
  setParticipantFilter,
  sortOption,
  setSortOption,
  settlementFromFilter,
  setSettlementFromFilter,
  settlementToFilter,
  setSettlementToFilter,
  settlementStatusFilter,
  setSettlementStatusFilter,
  settlementSortOption,
  setSettlementSortOption,
}: FinanceQuerySectionProps) {
  const [
    localSettlementFromFilter,
    setLocalSettlementFromFilter,
  ] = useState<Pilgrim | 'all'>('all')

  const [
    localSettlementToFilter,
    setLocalSettlementToFilter,
  ] = useState<Pilgrim | 'all'>('all')

  const [
    localSettlementStatusFilter,
    setLocalSettlementStatusFilter,
  ] = useState<SettlementStatusFilter>('all')

  const [
    localSettlementSortOption,
    setLocalSettlementSortOption,
  ] = useState<SettlementSortOption>(
    'highest',
  )

  const currentSettlementFromFilter =
    settlementFromFilter ??
    localSettlementFromFilter

  const currentSettlementToFilter =
    settlementToFilter ??
    localSettlementToFilter

  const currentSettlementStatusFilter =
    settlementStatusFilter ??
    localSettlementStatusFilter

  const currentSettlementSortOption =
    settlementSortOption ??
    localSettlementSortOption

  function handleSettlementFromChange(
    value: Pilgrim | 'all',
  ) {
    if (setSettlementFromFilter) {
      setSettlementFromFilter(value)
      return
    }

    setLocalSettlementFromFilter(value)
  }

  function handleSettlementToChange(
    value: Pilgrim | 'all',
  ) {
    if (setSettlementToFilter) {
      setSettlementToFilter(value)
      return
    }

    setLocalSettlementToFilter(value)
  }

  function handleSettlementStatusChange(
    value: SettlementStatusFilter,
  ) {
    if (setSettlementStatusFilter) {
      setSettlementStatusFilter(value)
      return
    }

    setLocalSettlementStatusFilter(value)
  }

  function handleSettlementSortChange(
    value: SettlementSortOption,
  ) {
    if (setSettlementSortOption) {
      setSettlementSortOption(value)
      return
    }

    setLocalSettlementSortOption(value)
  }

  return (
    <section className="finance-section finance-query-section">
      <div className="section-header">
        <p className="eyebrow">
          Consulta
        </p>
      </div>

      <div className="finance-query-content">
        <fieldset className="finance-query-type">
          <legend>
            O que deseja consultar?
          </legend>

          <div className="finance-query-options">
            <label
              className={
                queryType === 'expenses'
                  ? 'finance-query-option is-active'
                  : 'finance-query-option'
              }
            >
              <input
                type="radio"
                name="finance-query-type"
                value="expenses"
                checked={
                  queryType === 'expenses'
                }
                onChange={() =>
                  setQueryType('expenses')
                }
              />

              <span>Despesas</span>
            </label>

            <label
              className={
                queryType === 'settlements'
                  ? 'finance-query-option is-active'
                  : 'finance-query-option'
              }
            >
              <input
                type="radio"
                name="finance-query-type"
                value="settlements"
                checked={
                  queryType ===
                  'settlements'
                }
                onChange={() =>
                  setQueryType(
                    'settlements',
                  )
                }
              />

              <span>
                Acertos Financeiros
              </span>
            </label>
          </div>
        </fieldset>

        {queryType === 'expenses' ? (
          <div className="finance-filters">
            <div className="finance-filters-grid">
              <label className="finance-field">
                <span>Data inicial</span>

                <input
                  type="date"
                  value={startDate}
                  onChange={(event) =>
                    setStartDate(
                      event.target.value,
                    )
                  }
                />
              </label>

              <label className="finance-field">
                <span>Data final</span>

                <input
                  type="date"
                  value={endDate}
                  onChange={(event) =>
                    setEndDate(
                      event.target.value,
                    )
                  }
                />
              </label>

              <label className="finance-field">
                <span>Categoria</span>

                <select
                  value={categoryFilter}
                  onChange={(event) =>
                    setCategoryFilter(
                      event.target.value as
                        | ExpenseCategory
                        | 'all',
                    )
                  }
                >
                  <option value="all">
                    Todas
                  </option>

                  {expenseCategories.map(
                    (category) => (
                      <option
                        key={
                          category.value
                        }
                        value={
                          category.value
                        }
                      >
                        {category.label}
                      </option>
                    ),
                  )}
                </select>
              </label>

              <label className="finance-field">
                <span>Quem pagou</span>

                <select
                  value={paidByFilter}
                  onChange={(event) =>
                    setPaidByFilter(
                      event.target.value as
                        | Pilgrim
                        | 'all',
                    )
                  }
                >
                  <option value="all">
                    Todas
                  </option>

                  {pilgrims.map(
                    (pilgrim) => (
                      <option
                        key={pilgrim}
                        value={pilgrim}
                      >
                        {pilgrim}
                      </option>
                    ),
                  )}
                </select>
              </label>

              <label className="finance-field">
                <span>Participante</span>

                <select
                  value={
                    participantFilter
                  }
                  onChange={(event) =>
                    setParticipantFilter(
                      event.target.value as
                        | Pilgrim
                        | 'all',
                    )
                  }
                >
                  <option value="all">
                    Todas
                  </option>

                  {pilgrims.map(
                    (pilgrim) => (
                      <option
                        key={pilgrim}
                        value={pilgrim}
                      >
                        {pilgrim}
                      </option>
                    ),
                  )}
                </select>
              </label>

              <label className="finance-field">
                <span>Ordenação</span>

                <select
                  value={sortOption}
                  onChange={(event) =>
                    setSortOption(
                      event.target.value as
                        ExpenseSortOption,
                    )
                  }
                >
                  <option value="newest">
                    Mais recentes
                  </option>

                  <option value="oldest">
                    Mais antigas
                  </option>

                  <option value="highest">
                    Maior valor
                  </option>

                  <option value="lowest">
                    Menor valor
                  </option>
                </select>
              </label>
            </div>
          </div>
        ) : (
          <div className="finance-filters">
            <div className="finance-filters-grid">
              <label className="finance-field">
                <span>Data inicial</span>

                <input
                  type="date"
                  value={startDate}
                  onChange={(event) =>
                    setStartDate(event.target.value)
                  }
                />
              </label>

              <label className="finance-field">
                <span>Data final</span>

                <input
                  type="date"
                  value={endDate}
                  onChange={(event) =>
                    setEndDate(event.target.value)
                  }
                />
              </label>

              <label className="finance-field">
                <span>Quem paga</span>

                <select
                  value={
                    currentSettlementFromFilter
                  }
                  onChange={(event) =>
                    handleSettlementFromChange(
                      event.target.value as
                        | Pilgrim
                        | 'all',
                    )
                  }
                >
                  <option value="all">
                    Todas
                  </option>

                  {pilgrims.map(
                    (pilgrim) => (
                      <option
                        key={pilgrim}
                        value={pilgrim}
                      >
                        {pilgrim}
                      </option>
                    ),
                  )}
                </select>
              </label>

              <label className="finance-field">
                <span>Quem recebe</span>

                <select
                  value={
                    currentSettlementToFilter
                  }
                  onChange={(event) =>
                    handleSettlementToChange(
                      event.target.value as
                        | Pilgrim
                        | 'all',
                    )
                  }
                >
                  <option value="all">
                    Todas
                  </option>

                  {pilgrims.map(
                    (pilgrim) => (
                      <option
                        key={pilgrim}
                        value={pilgrim}
                      >
                        {pilgrim}
                      </option>
                    ),
                  )}
                </select>
              </label>

              <label className="finance-field">
                <span>Status</span>

                <select
                  value={
                    currentSettlementStatusFilter
                  }
                  onChange={(event) =>
                    handleSettlementStatusChange(
                      event.target
                        .value as SettlementStatusFilter,
                    )
                  }
                >
                  <option value="all">
                    Todos
                  </option>

                  <option value="pending">
                    Pendentes
                  </option>


                  <option value="settled">
                    Concluídos
                  </option>
                </select>
              </label>

              <label className="finance-field">
                <span>Ordenação</span>

                <select
                  value={
                    currentSettlementSortOption
                  }
                  onChange={(event) =>
                    handleSettlementSortChange(
                      event.target
                        .value as SettlementSortOption,
                    )
                  }
                >
                  <option value="highest">
                    Maior valor
                  </option>

                  <option value="lowest">
                    Menor valor
                  </option>

                  <option value="payer">
                    Quem paga
                  </option>

                  <option value="receiver">
                    Quem recebe
                  </option>
                </select>
              </label>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}