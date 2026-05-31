import { useState } from 'react'
import './SpotHeader.css'

// 카테고리별 타이틀
const CATEGORY_TITLE = {
  restaurant: '식사할 곳',
  cafe:       '휴식할 곳',
  parking:    '주차할 곳',
}

// 카테고리별 설명
// TODO: API 연동 시 베스트 장소명 동적으로 교체
const CATEGORY_DESC = {
  restaurant: '청주시 음악 축제 주변 18개 식당을 거리·유금·여유·평점으로 종합 분석, OO국밥이 가장 높은 점수를 받았어요.',
  cafe:       '청주시 음악 축제 주변 12개 카페를 거리·유금·여유·평점으로 종합 분석, 한적 카페가 가장 높은 점수를 받았어요.',
  parking:    '청주시 음악 축제 주변 18개 주차장을 거리·유금·여유·평점으로 종합 분석, 한강 공영주차장이 가장 높은 점수를 받았어요.',
}

const CATEGORIES = [
  { label: '식당', icon: '🍴', value: 'restaurant', count: 12 },
  { label: '카페', icon: '☕', value: 'cafe',       count: 12 },
  { label: '주차장', icon: '🅿', value: 'parking',  count: 38 },
]

function SpotHeader({ activeCategory, onSelectCategory }) {
  return (
    <div className="spotheader">

      {/* 왼쪽 텍스트 */}
      <div className="spotheader_left">
        <p className="spotheader_label">
          <span className="spotheader_label_line"></span>
          SPOT COMPARE · 베스트 스팟 비교
        </p>
        <h1 className="spotheader_title">
          {/* TODO: API 연동 시 베스트 장소명 동적으로 교체 */}
          {CATEGORY_TITLE[activeCategory]}, <span>여기가 1등.</span>
        </h1>
        <p className="spotheader_desc">
          {/* TODO: API 연동 시 CATEGORY_DESC → fetch 응답으로 교체 */}
          {CATEGORY_DESC[activeCategory]}
        </p>
      </div>

      {/* 오른쪽 카테고리 탭 */}
      {/* TODO: API 연동 시 count 동적으로 교체 */}
      <div className="spotheader_tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            className={`spotheader_tab ${activeCategory === cat.value ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.value)}
          >
            {cat.icon} {cat.label}
            <span className="spotheader_tab_count">{cat.count}</span>
          </button>
        ))}
      </div>

    </div>
  )
}

export default SpotHeader