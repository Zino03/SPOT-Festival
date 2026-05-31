import './FestivalNearbyMap.css'

const CATEGORY_FILTERS = [
  { label: '식당', icon: '🍴', value: 'restaurant' },
  { label: '카페', icon: '☕', value: 'cafe' },
  { label: '주차장', icon: '🅿', value: 'parking' },
]

function FestivalNearbyMap({ activeCategory, onSelectCategory }) {
  return (
    <div className="festivalnearbymap">

      {/* 지도 상단 필터 */}
      <div className="festivalnearbymap_filters">
        {CATEGORY_FILTERS.map(cat => (
          <button
            key={cat.value}
            className={`festivalnearbymap_filter ${activeCategory === cat.value ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.value)}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* TODO: 지도 API 연동 자리 */}
      {/* 카카오맵, 네이버맵 등 지도 API 연동 예정 */}
      {/* activeCategory 기준으로 주변 장소 마커 표시 */}
      <div className="festivalnearbymap_placeholder">
        <p className="festivalnearbymap_placeholder_icon">🗺️</p>
        <p className="festivalnearbymap_placeholder_title">주변 지도</p>
        <p className="festivalnearbymap_placeholder_desc">지도 API 연동 예정</p>
      </div>

      {/* 지도 컨트롤 버튼 */}
      <div className="festivalnearbymap_controls">
        <button>+</button>
        <button>−</button>
        <button>⊡</button>
      </div>

      {/* 축척 */}
      <div className="festivalnearbymap_scale">
        <div className="festivalnearbymap_scale_bar"></div>
        <span>0　200m　400m</span>
      </div>

    </div>
  )
}

export default FestivalNearbyMap