import type { Transfer } from "../../data/viagemStore"

type TransferCardProps = {
  transfer: Transfer
  onEdit: (transfer: Transfer) => void
  onDelete: (id: string) => void
}

export default function TransferCard({
  transfer,
  onEdit,
  onDelete,
}: TransferCardProps) {
  return (
    <article className="travel-card">
      <div className="travel-card__header">
        <div>
          <p className="eyebrow">{transfer.type || "Deslocamento"}</p>
          <h3>
            {transfer.origin} → {transfer.destination}
          </h3>
        </div>
      </div>

      <div className="travel-card__content">
        {transfer.company && (
          <p>
            <strong>Empresa:</strong> {transfer.company}
          </p>
        )}

        {transfer.departureDate && (
          <p>
            <strong>Data:</strong> {transfer.departureDate}
          </p>
        )}

        {transfer.departureTime && (
          <p>
            <strong>Saída:</strong> {transfer.departureTime}
          </p>
        )}

        {transfer.arrivalTime && (
          <p>
            <strong>Chegada:</strong> {transfer.arrivalTime}
          </p>
        )}

        {transfer.locator && (
          <p>
            <strong>Localizador:</strong> {transfer.locator}
          </p>
        )}

        {transfer.ticketUrl && (
          <p>
            <strong>Bilhete:</strong>{" "}
            <a href={transfer.ticketUrl} target="_blank" rel="noreferrer">
              Abrir bilhete
            </a>
          </p>
        )}

        {transfer.notes && (
          <p>
            <strong>Observações:</strong> {transfer.notes}
          </p>
        )}
      </div>

      <div className="travel-card__actions">
        <button type="button" onClick={() => onEdit(transfer)}>
          Editar
        </button>

        <button type="button" onClick={() => onDelete(transfer.id)}>
          Excluir
        </button>
      </div>
    </article>
  )
}
