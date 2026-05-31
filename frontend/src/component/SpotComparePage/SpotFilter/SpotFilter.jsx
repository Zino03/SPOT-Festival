import { useState } from 'react'
import './SpotFilter.css'

// 필터 옵션
const FILTERS = [
  { label: 'Free 우선',    value: 'free'     },
  { label: '도보 5분 이내', value: 'walk5'    },
  { label: '평점 4.5+',    value: 'rating45' },
  { label: '24시간',       value: '24hours'  },
]

function SpotFilter({ onFilterChange }) {
  const [activeFilters, setActiveFilters] = useState([])

  function handleToggle(value) {
    const updated = activeFilters.includes(value)
      ? activeFilters.filter(f => f !== value)  // 이미 선택된 거 → 해제
      : [...activeFilters, value]               // 새로 선택

    setActiveFilters(updated)
    // TODO: API 연동 시 onFilterChange(updated) 호출로 필터 적용
    if (onFilterChange) onFilterChange(updated)
  }

  return (
    <div className="spotfilter">

      {/* 필터 아이콘 */}
      <span className="spotfilter_icon">▽ 필터</span>

      {/* 필터 버튼 목록 */}
      {FILTERS.map(filter => (
        <button
          key={filter.value}
          className={`spotfilter_btn ${activeFilters.includes(filter.value) ? 'active' : ''}`}
          onClick={() => handleToggle(filter.value)}
        >
          {filter.label}
          {activeFilters.includes(filter.value) && (
            <span className="spotfilter_btn_remove">×</span>
          )}
        </button>
      ))}

      {/* 오른쪽 정렬 */}
      <div className="spotfilter_sort">
        <span>정렬: 종합 점수 높은 순 ▾</span>
      </div>

    </div>
  )
}

export default SpotFilter