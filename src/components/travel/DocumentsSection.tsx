import { useState } from 'react'

import {
  DeleteIcon,
  DocumentIcon,
  EditIcon,
  PlusIcon,
} from '../icons/AppIcons'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import type { TravelDocument } from '../../data/viagemStore'

type DocumentsSectionProps = {
  documents: TravelDocument[]
  addDocument: (document: Omit<TravelDocument, 'id'>) => void
  updateDocument: (document: TravelDocument) => void
  deleteDocument: (documentId: string) => void
}

const emptyDocumentForm: Omit<TravelDocument, 'id'> = {
  title: '',
  owner: '',
  documentNumber: '',
  expirationDate: '',
  fileUrl: '',
  notes: '',
}

function formatDate(date: string) {
  if (!date) return ''

  return new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function hasExtraDocumentInfo(document: TravelDocument) {
  return Boolean(document.fileUrl || document.notes)
}

export function DocumentsSection({
  documents,
  addDocument,
  updateDocument,
  deleteDocument,
}: DocumentsSectionProps) {
  const [showDocumentForm, setShowDocumentForm] = useState(false)
  const [editingDocumentId, setEditingDocumentId] = useState<string | null>(
    null,
  )
  const [documentForm, setDocumentForm] =
    useState<Omit<TravelDocument, 'id'>>(emptyDocumentForm)
  const [documentToDelete, setDocumentToDelete] = useState<TravelDocument | null>(null)

  function resetDocumentForm() {
    setDocumentForm(emptyDocumentForm)
    setEditingDocumentId(null)
    setShowDocumentForm(false)
  }

  function handleOpenCreateDocument() {
    setDocumentForm(emptyDocumentForm)
    setEditingDocumentId(null)
    setShowDocumentForm(true)
  }

  function handleOpenEditDocument(document: TravelDocument) {
    setDocumentForm({
      title: document.title,
      owner: document.owner,
      documentNumber: document.documentNumber,
      expirationDate: document.expirationDate,
      fileUrl: document.fileUrl,
      notes: document.notes,
    })
    setEditingDocumentId(document.id)
    setShowDocumentForm(true)
  }

  function handleSaveDocument() {
    if (!documentForm.title.trim() || !documentForm.owner.trim()) {
      return
    }

    if (editingDocumentId) {
      updateDocument({
        id: editingDocumentId,
        ...documentForm,
      })
    } else {
      addDocument(documentForm)
    }

    resetDocumentForm()
  }

  function handleConfirmRemoveDocument() {
    if (!documentToDelete) return

    deleteDocument(documentToDelete.id)
    setDocumentToDelete(null)
  }

  function updateDocumentField(
    field: keyof Omit<TravelDocument, 'id'>,
    value: string,
  ) {
    setDocumentForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  return (
    <article className="viagem-card">
      <div className="viagem-card-header">
        <div>
          <p className="eyebrow">Documentos</p>

          <h3>
            <DocumentIcon size={30} />
            <span>Checklist essencial</span>
          </h3>
        </div>

        <button
          className="mission-add-button"
          onClick={handleOpenCreateDocument}
          title="Adicionar documento"
          aria-label="Adicionar documento"
        >
          <PlusIcon size={20} strokeWidth={2} />
        </button>
      </div>

      <p>
        Passaporte, seguro, credencial, vouchers e demais documentos da viagem.
      </p>

      {documents.length === 0 ? (
        <div className="viagem-empty-state">0 item cadastrado</div>
      ) : (
        <div className="viagem-list">
          {documents.map((document) => (
            <article className="viagem-list-item" key={document.id}>
              <div>
                <strong>{document.title}</strong>

                <span>
                  Titular: {document.owner}
                  {document.documentNumber
                    ? ` · Nº ${document.documentNumber}`
                    : ''}
                </span>

                {document.expirationDate && (
                  <small>
                    Validade: {formatDate(document.expirationDate)}
                  </small>
                )}

                {hasExtraDocumentInfo(document) && (
                  <small>
                    {document.fileUrl
                      ? `Arquivo/link: ${document.fileUrl}`
                      : ''}
                    {document.notes
                      ? `${document.fileUrl ? ' · ' : ''}${document.notes}`
                      : ''}
                  </small>
                )}
              </div>

              <div className="viagem-item-actions">
                <button
                  onClick={() => handleOpenEditDocument(document)}
                  title="Editar documento"
                  aria-label="Editar documento"
                >
                  <EditIcon size={18} />
                </button>

                <button
                  onClick={() => setDocumentToDelete(document)}
                  title="Excluir documento"
                  aria-label="Excluir documento"
                >
                  <DeleteIcon size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {showDocumentForm && (
        <div className="viagem-form">
          <input
            value={documentForm.title}
            onChange={(event) =>
              updateDocumentField('title', event.target.value)
            }
            placeholder="Documento: passaporte, seguro, credencial..."
            autoFocus
          />

          <input
            value={documentForm.owner}
            onChange={(event) =>
              updateDocumentField('owner', event.target.value)
            }
            placeholder="Titular"
          />

          <input
            value={documentForm.documentNumber}
            onChange={(event) =>
              updateDocumentField('documentNumber', event.target.value)
            }
            placeholder="Número do documento"
          />

          <label>
            Data de validade
            <input
              type="date"
              value={documentForm.expirationDate}
              onChange={(event) =>
                updateDocumentField('expirationDate', event.target.value)
              }
            />
          </label>

          <input
            value={documentForm.fileUrl}
            onChange={(event) =>
              updateDocumentField('fileUrl', event.target.value)
            }
            placeholder="Link do arquivo"
          />

          <textarea
            value={documentForm.notes}
            onChange={(event) =>
              updateDocumentField('notes', event.target.value)
            }
            placeholder="Observações"
          />

          <div>
            <button onClick={handleSaveDocument}>
              {editingDocumentId ? 'Salvar edição' : 'Salvar documento'}
            </button>

            <button onClick={resetDocumentForm}>Cancelar</button>
          </div>
        </div>
      )}
          <ConfirmDialog
        open={Boolean(documentToDelete)}
        title="Excluir documento?"
        message={
          documentToDelete
            ? `O documento "${documentToDelete.title}" será removido da viagem.`
            : ''
        }
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleConfirmRemoveDocument}
        onCancel={() => setDocumentToDelete(null)}
      />
    </article>
  )
}