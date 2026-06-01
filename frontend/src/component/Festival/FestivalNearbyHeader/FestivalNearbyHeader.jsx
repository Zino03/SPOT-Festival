// 축제 상세 페이지 주변 정보 섹션 헤더 컴포넌트
// 좌측 타이틀 + 우측 카테고리 탭(식당 / 카페 / 주차장) 구성
// 탭 선택 시 FestivalPage의 activeCategory를 변경해 지도와 목록을 동시 갱신

import './FestivalNearbyHeader.css'

const CATEGORIES = [
  { label: '식당', icon: '🍴', value: 'restaurant' },
  { label: '카페', icon: '☕', value: 'cafe' },
  { label: '주차장', icon: '🅿', value: 'parking' },
]

function FestivalNearbyHeader({ activeCategory, onSelectCategory }) {
  return (
    <div className="festivalnearbyheader">

      {/* 좌측 섹션 타이틀 */}
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

      {/* 우측 카테고리 탭 */}
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
