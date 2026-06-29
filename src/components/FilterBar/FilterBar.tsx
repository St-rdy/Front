import type { FilterBarProps } from './FilterBar.types'
import './FilterBar.css'

export default function FilterBar({
  categories,
  selected,
  onChange,
}: FilterBarProps) {
  return (
    <div className="filter-bar">
      {categories.map((category, index) => (
        <button
          key={category}
          className={`filter-bar__item ${
            selected === category ? 'filter-bar__item--active' : ''
          }`}
          onClick={() => onChange(category)}
        >
          {index === 0 && <span className="filter-bar__icon">≡</span>}
          {category}
        </button>
      ))}
    </div>
  )
}
