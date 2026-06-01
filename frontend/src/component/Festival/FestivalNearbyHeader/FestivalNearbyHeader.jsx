import { useState } from 'react'
import './FestivalNearbyHeader.css'

const CATEGORIES = [
  { label: '식당', icon: '🍴', value: 'restaurant' },
  { label: '카페', icon: '☕', value: 'cafe' },
  { label: '주차장', icon: '🅿', value: 'parking' },
]

function FestivalNearbyHeader({ activeCategory, onSelectCategory }) {
  return (
    <div className="festivalnearbyheader">

      {/* 왼쪽 텍스트 */}
      <div className="festivalnearbyheader_left">
        <p className="festivalnearbyheader_label">
          <span className="festivalnearbyheader_label_line"></span>
          NEARBY · 주변 정보
        </p>
        <h2 className="festivalnearbyheader_title">
          축제 주변, 이건 꼭 챙겨가세요.
        </h2>
        <p className="festivalnearbyheader_desc">
          식당·카페·주차장을 지도와 리스트로 동시에 비교.
        </p>
      </div>

      {/* 오른쪽 카테고리 탭 */}
      {/* TODO: API 연동 시 각 카테고리 개수 동적으로 표시 */}
      <div className="festivalnearbyheader_tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            className={`festivalnearbyheader_tab ${activeCategory === cat.value ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.value)}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

    </div>
  )
}

export default FestivalNearbyHeader