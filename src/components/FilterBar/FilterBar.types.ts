export interface FilterBarProps {
  categories: string[]
  selected: string
  onChange: (category: string) => void
}
