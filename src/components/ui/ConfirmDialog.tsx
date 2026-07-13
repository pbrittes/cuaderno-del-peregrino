import './ConfirmDialog.css'

type ConfirmDialogProps = {
  open: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmText = 'Excluir',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div
        className="confirm-dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <h3>{title}</h3>

        <p>{message}</p>

        <div className="confirm-actions">
          <button
            className="confirm-cancel"
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            className="confirm-confirm"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}