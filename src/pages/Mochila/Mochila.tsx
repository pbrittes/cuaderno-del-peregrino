import {
  useState,
} from 'react'
import type {
  ComponentType,
  FormEvent,
} from 'react'

import {
  BootIcon,
  CheckCircleIcon,
  DeleteIcon,
  EditIcon,
  PlusIcon,
  ShoppingCartIcon,
} from '../../components/icons/AppIcons'

import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { useAuth } from '../../contexts/AuthContext'
import { useExpedition } from '../../contexts/ExpeditionContext'

import {
  type GearCategory,
  type GearItem,
  type GearStatus,
  type Pilgrim,
} from '../../data/backpacks'

import { formatKg } from '../../data/backpackEngine'
import {
  type BackpackItemOwner,
  useBackpackItems,
} from '../../data/backpackStore'

const pilgrims: Pilgrim[] = [
  'Pri',
  'Tan',
  'Deia',
]

const ownerOptions: BackpackItemOwner[] = [
  ...pilgrims,
  'Todas',
]

const gearCategories: GearCategory[] = [
  'mochila',
  'calçado',
  'roupa',
  'dormir',
  'higiene',
  'saúde',
  'eletrônicos',
  'acessórios',
]

type StatusIconComponent = ComponentType<{
  size?: number
  className?: string
  strokeWidth?: number
}>

const statusIcons: Partial<
  Record<GearStatus, StatusIconComponent>
> = {
  comprar: ShoppingCartIcon,
  testar: BootIcon,
  tem: CheckCircleIcon,
}

function getNextStatus(
  status: GearStatus,
): GearStatus {
  if (status === 'comprar') return 'testar'
  if (status === 'testar') return 'tem'
  if (status === 'tem') return 'comprar'

  return 'comprar'
}

function itemLabel(
  name: string,
  quantity: number,
) {
  return quantity > 1
    ? `${quantity} × ${name}`
    : name
}

function renderStatusIcon(
  status: GearStatus,
  size: number,
) {
  const StatusIcon = statusIcons[status]

  if (!StatusIcon) {
    return (
      <span aria-hidden="true">
        —
      </span>
    )
  }

  return <StatusIcon size={size} />
}

function getItemOwner(
  item: GearItem,
): BackpackItemOwner {
  return item.owner ?? 'Todas'
}

export function Mochila() {
  const { user } = useAuth()
  const { expedition } = useExpedition()

  const {
    items,
    loading,
    error,
    cloudEnabled,
    updateStatus,
    addItem,
    updateItem,
    removeItem,
    migrateToSharedBackpack,
  } = useBackpackItems({
    userId: user?.id,
    expeditionId: expedition?.id,
  })

  const [migrating, setMigrating] =
    useState(false)

  const [itemToDelete, setItemToDelete] =
    useState<GearItem | null>(null)

  const [showItemForm, setShowItemForm] =
    useState(false)

  const [editingItemId, setEditingItemId] =
    useState<string | null>(null)

  const [itemName, setItemName] =
    useState('')

  const [itemCategory, setItemCategory] =
    useState<GearCategory>('acessórios')

  const [itemWeight, setItemWeight] =
    useState('')

  const [itemOwner, setItemOwner] =
    useState<BackpackItemOwner>('Pri')

  const [
    openCategories,
    setOpenCategories,
  ] = useState<GearCategory[]>([
    'mochila',
    'calçado',
    'roupa',
    'dormir',
    'higiene',
    'saúde',
    'eletrônicos',
    'acessórios',
  ])

  const categories = Array.from(
    new Set(
      items.map(
        (item) => item.category,
      ),
    ),
  )

  const editingItem = editingItemId
    ? items.find(
        (item) =>
          item.id === editingItemId,
      ) ?? null
    : null

  const isEditingCustomItem =
    Boolean(editingItem?.custom)

  function toggleStatus(
    itemId: string,
    pilgrim: Pilgrim,
  ) {
    const item = items.find(
      (currentItem) =>
        currentItem.id === itemId,
    )

    if (!item) return

    updateStatus(
      itemId,
      pilgrim,
      getNextStatus(
        item.status[pilgrim],
      ),
    )
  }

  function toggleCategory(
    category: GearCategory,
  ) {
    setOpenCategories((current) =>
      current.includes(category)
        ? current.filter(
            (item) =>
              item !== category,
          )
        : [...current, category],
    )
  }

  function resetItemForm() {
    setEditingItemId(null)
    setItemName('')
    setItemCategory('acessórios')
    setItemWeight('')
    setItemOwner('Pri')
    setShowItemForm(false)
  }

  function handleOpenItemForm() {
    resetItemForm()
    setShowItemForm(true)
  }

  function handleEditItem(
    item: GearItem,
  ) {
    setEditingItemId(item.id)
    setItemName(item.name)
    setItemCategory(item.category)
    setItemWeight(String(item.weight))
    setItemOwner(getItemOwner(item))
    setShowItemForm(true)
  }

  function handleSaveItem(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    const weight = Number(itemWeight)

    if (
      !Number.isFinite(weight) ||
      weight <= 0
    ) {
      return
    }

    if (editingItemId) {
      if (
        isEditingCustomItem &&
        !itemName.trim()
      ) {
        return
      }

      updateItem(editingItemId, {
        name: itemName,
        category: itemCategory,
        weight,
        owner: itemOwner,
      })
    } else {
      if (!itemName.trim()) {
        return
      }

      addItem({
        name: itemName,
        category: itemCategory,
        weight,
        owner: itemOwner,
      })
    }

    setOpenCategories((current) =>
      current.includes(itemCategory)
        ? current
        : [...current, itemCategory],
    )

    resetItemForm()
  }

  function handleConfirmRemoveItem() {
    if (!itemToDelete) return

    removeItem(itemToDelete.id)

    if (
      editingItemId === itemToDelete.id
    ) {
      resetItemForm()
    }

    setItemToDelete(null)
  }

  async function handleMigrateBackpack() {
    setMigrating(true)

    try {
      await migrateToSharedBackpack()
    } catch {
      /*
       * A mensagem é tratada pela Store
       * e exibida na interface.
       */
    } finally {
      setMigrating(false)
    }
  }

  return (
    <main className="mochila-page">
      <style>
        {`
          .gear-desktop-meta {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            white-space: nowrap;
          }

          .gear-mobile-meta {
            display: none;
          }

          .gear-item-actions {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            flex-shrink: 0;
          }

          .gear-item-action-button {
            width: 24px !important;
            height: 24px !important;
            min-width: 24px !important;
            padding: 0 !important;
          }

          @media (max-width: 768px) {
            .gear-desktop-meta {
              display: none;
            }

            .gear-item-info {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 12px;
              width: 100%;
            }

            .gear-mobile-meta {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              white-space: nowrap;
              flex-shrink: 0;
            }
          }
        `}
      </style>

      <section className="agenda-header">
        <div className="agenda-header-top">
          <div>
            <p className="eyebrow">
              Mochilas
            </p>

            <h2>
              Checklist da expedição
            </h2>
          </div>

          <button
            className="mission-add-button"
            onClick={handleOpenItemForm}
            title="Adicionar item"
            aria-label="Adicionar item"
          >
            <PlusIcon
              size={20}
              strokeWidth={2}
            />
          </button>
        </div>

        <p>
          Um clique muda o status:
          comprar → testar → tenho.
        </p>

        {!loading && !cloudEnabled && (
          <div className="agenda-form">
            <p>
              Esta Mochila ainda está
              salva apenas neste navegador.
            </p>

            <div className="agenda-form-actions">
              <button
                type="button"
                onClick={
                  handleMigrateBackpack
                }
                disabled={
                  migrating ||
                  !user ||
                  !expedition
                }
              >
                {migrating
                  ? 'Migrando...'
                  : 'Compartilhar Mochila'}
              </button>
            </div>
          </div>
        )}

        {!loading && cloudEnabled && (
          <p>
            Mochila compartilhada com
            a Expedição.
          </p>
        )}

        {error && (
          <p role="alert">
            {error}
          </p>
        )}

        {showItemForm && (
          <form
            className="agenda-form"
            onSubmit={handleSaveItem}
          >
            <input
              type="text"
              value={itemName}
              onChange={(event) =>
                setItemName(
                  event.target.value,
                )
              }
              placeholder="Novo item..."
              autoFocus
              required={
                !editingItemId ||
                isEditingCustomItem
              }
              disabled={
                Boolean(editingItemId) &&
                !isEditingCustomItem
              }
            />

            <select
              value={itemCategory}
              onChange={(event) =>
                setItemCategory(
                  event.target
                    .value as GearCategory,
                )
              }
              disabled={
                Boolean(editingItemId) &&
                !isEditingCustomItem
              }
            >
              {gearCategories.map(
                (category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ),
              )}
            </select>

            <input
              type="number"
              min="1"
              step="1"
              value={itemWeight}
              onChange={(event) =>
                setItemWeight(
                  event.target.value,
                )
              }
              placeholder="Peso em gramas"
              aria-label="Peso em gramas"
              required
            />

            <select
              value={itemOwner}
              onChange={(event) =>
                setItemOwner(
                  event.target
                    .value as BackpackItemOwner,
                )
              }
              aria-label="Peregrina"
              disabled={
                Boolean(editingItemId) &&
                !isEditingCustomItem
              }
            >
              {ownerOptions.map(
                (owner) => (
                  <option
                    key={owner}
                    value={owner}
                  >
                    {owner}
                  </option>
                ),
              )}
            </select>

            <div className="agenda-form-actions">
              <button type="submit">
                {editingItemId
                  ? 'Salvar edição'
                  : 'Salvar'}
              </button>

              <button
                type="button"
                onClick={resetItemForm}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </section>

      <section className="gear-table">
        <div className="gear-table-header">
          <span>Item</span>
          <span>Peso</span>

          {pilgrims.map((pilgrim) => (
            <span key={pilgrim}>
              {pilgrim}
            </span>
          ))}
        </div>

        {categories.map((category) => {
          const isOpen =
            openCategories.includes(
              category,
            )

          const categoryItems =
            items.filter(
              (item) =>
                item.category ===
                category,
            )

          return (
            <div
              key={category}
              className="gear-category"
            >
              <button
                className="gear-category-title"
                onClick={() =>
                  toggleCategory(category)
                }
              >
                <span>
                  {isOpen ? '▾' : '▸'}
                </span>

                {category}
              </button>

              {isOpen &&
                categoryItems.map(
                  (item) => (
                    <article
                      className="gear-table-row"
                      key={item.id}
                    >
                      <div className="gear-item-info">
                        <strong>
                          {itemLabel(
                            item.name,
                            item.quantity,
                          )}
                        </strong>

                        <div className="gear-mobile-meta">
                          <span>
                            {formatKg(
                              item.weight,
                            )}
                          </span>

                          <div className="gear-item-actions">
                            <button
                              type="button"
                              className="mission-add-button gear-item-action-button"
                              onClick={() =>
                                handleEditItem(item)
                              }
                              title={`Editar ${item.name}`}
                              aria-label={`Editar ${item.name}`}
                            >
                              <EditIcon size={12} />
                            </button>

                            <button
                              type="button"
                              className="mission-add-button gear-item-action-button"
                              onClick={() =>
                                setItemToDelete(item)
                              }
                              title={`Excluir ${item.name}`}
                              aria-label={`Excluir ${item.name}`}
                            >
                              <DeleteIcon size={12} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="gear-weight gear-desktop-meta">
                        <span>
                          {formatKg(
                            item.weight,
                          )}
                        </span>

                        <div className="gear-item-actions">
                          <button
                            type="button"
                            className="mission-add-button gear-item-action-button"
                            onClick={() =>
                              handleEditItem(item)
                            }
                            title={`Editar ${item.name}`}
                            aria-label={`Editar ${item.name}`}
                          >
                            <EditIcon size={12} />
                          </button>

                          <button
                            type="button"
                            className="mission-add-button gear-item-action-button"
                            onClick={() =>
                              setItemToDelete(item)
                            }
                            title={`Excluir ${item.name}`}
                            aria-label={`Excluir ${item.name}`}
                          >
                            <DeleteIcon size={12} />
                          </button>
                        </div>
                      </div>

                      <div className="gear-mobile-statuses">
                        {pilgrims.map(
                          (pilgrim) => {
                            const status =
                              item.status[
                                pilgrim
                              ]

                            return (
                              <button
                                key={
                                  pilgrim
                                }
                                className={`status-button ${status}`}
                                onClick={() =>
                                  toggleStatus(
                                    item.id,
                                    pilgrim,
                                  )
                                }
                                title={`${pilgrim}: ${status}`}
                                aria-label={`${pilgrim}: ${status}`}
                                disabled={
                                  status ===
                                  'dispensado'
                                }
                              >
                                <span>
                                  {
                                    pilgrim
                                  }
                                </span>

                                <strong>
                                  {renderStatusIcon(
                                    status,
                                    20,
                                  )}
                                </strong>
                              </button>
                            )
                          },
                        )}
                      </div>

                      {pilgrims.map(
                        (pilgrim) => {
                          const status =
                            item.status[
                              pilgrim
                            ]

                          return (
                            <button
                              key={
                                pilgrim
                              }
                              className={`status-button desktop-status ${status}`}
                              onClick={() =>
                                toggleStatus(
                                  item.id,
                                  pilgrim,
                                )
                              }
                              title={`${pilgrim}: ${status}`}
                              aria-label={`${pilgrim}: ${status}`}
                              disabled={
                                status ===
                                'dispensado'
                              }
                            >
                              {renderStatusIcon(
                                status,
                                20,
                              )}
                            </button>
                          )
                        },
                      )}
                    </article>
                  ),
                )}
            </div>
          )
        })}
      </section>

      <ConfirmDialog
        open={Boolean(itemToDelete)}
        title="Excluir item?"
        message={
          itemToDelete
            ? `O item "${itemToDelete.name}" será removido da Mochila.`
            : ''
        }
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={
          handleConfirmRemoveItem
        }
        onCancel={() =>
          setItemToDelete(null)
        }
      />
    </main>
  )
}