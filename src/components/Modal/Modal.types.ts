export interface ModalButton {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  content: string
  image?: string // 이미지는 URL
  buttons: [ModalButton] | [ModalButton, ModalButton]
  className?: string
  variant?: 'center' | 'bottom'
}
