import type { TravelDocument } from '../../data/viagemStore'

type DocumentCardProps = {
  document: TravelDocument
  onEdit: (document: TravelDocument) => void
  onRemove: (document: TravelDocument) => void
}

function formatDate(date: string) {
  if (!date) return ''

  return new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function DocumentCard({
  document,
  onEdit,
  onRemove,
}: DocumentCardProps) {
  return (
    <article className="viagem-list-item">
      <div>
        <strong>{document.title}</strong>

        <span>
          {document.owner}
          {document.documentNumber ? ` · Nº ${document.documentNumber}` : ''}
        </span>

        {document.expirationDate && (
          <small>Validade: {formatDate(document.expirationDate)}</small>
        )}

        {(document.fileUrl || document.notes) && (
          <small>
            {document.fileUrl ? `Arquivo/link: ${document.fileUrl}` : ''}
            {document.notes
              ? `${document.fileUrl ? ' · ' : ''}${document.notes}`
              : ''}
          </small>
        )}
      </div>

      <div className="viagem-item-actions">
        <button onClick={() => onEdit(document)} title="Editar documento">
          ✏️
        </button>

        <button onClick={() => onRemove(document)} title="Excluir documento">
          🗑️
        </button>
      </div>
    </article>
  )
}
