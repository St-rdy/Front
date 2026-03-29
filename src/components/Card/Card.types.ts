export interface CardProps {
  id?: number | string
  title: string
  date: string
  imageUrl?: string
  isBookmark?: boolean // true면 하트 이미지, 아니면 옵션
  onClick?: () => void
  onOptionClick?: () => void
  onHeartClick?: () => void
}

export interface CardSectionResponse {
  items: CardProps[]
  totalCount: number
}
