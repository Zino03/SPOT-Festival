import './SpotBest.css'

// 더미 데이터 (API 연동 전)
// TODO: API 연동 시 fetch('/api/festivals/:festivalId/compare?category=parking&rank=1')로 교체
const DUMMY_BEST = {
  restaurant: {
    name: 'OO국밥',
    address: '청주시 서원구 삼남로 69번길 12',
    score: 97,
    distance: '200m',
    walk: '3분',
    capacity: null,
    image: '',
  },
  cafe: {
    name: '한적 카페',
    address: '청주시 서원구 삼남로 45번길 8',
    score: 95,
    distance: '320m',
    walk: '4분',
    capacity: null,
    image: '',
  },
  parking: {
    name: '한강 공영주차장',
    address: '청주시 서원구 삼남로 69번길 12',
    score: 97,
    distance: '180m',
    walk: '2분',
    capacity: 168,
    image: '',
  },
}

// 카테고리별 통계 라벨
const STAT_LABELS = {
  restaurant: ['거리', '도보', '평점'],
  cafe:       ['거리', '도보', '평점'],
  parking:    ['거리', '도보', '수용'],
}

function SpotBest({ activeCategory }) {
  // TODO: API 연동 시 DUMMY_BEST → fetch 응답으로 교체
  const best = DUMMY_BEST[activeCategory]
  const labels = STAT_LABELS[activeCategory]

  return (
    <div className="spotbest">

      {/* 순위 뱃지 */}
      <div className="spotbest_rank">1</div>

      {/* 이미지 */}
      <div
        className="spotbest_image"
        // TODO: 이미지 생기면 아래 style 주석 해제
        // style={{ backgroundImage: `url(${best.image})` }}
      />

      {/* 정보 영역 */}
      <div className="spotbest_info">
        <p className="spotbest_label">✦ SPOT'S BEST · 종합 1위</p>
        <h2 className="spotbest_name">{best.name}</h2>
        <p className="spotbest_address">📍 {best.address}</p>

        {/* 통계 */}
        <div className="spotbest_stats">
          <div className="spotbest_stat">
            <span className="spotbest_stat_label">SCORE</span>
            <strong>{best.score}<span>/100</span></strong>
          </div>
          <div className="spotbest_stat">
            <span className="spotbest_stat_label">{labels[0]}</span>
            <strong>{best.distance}</strong>
          </div>
          <div className="spotbest_stat">
            <span className="spotbest_stat_label">{labels[1]}</span>
            <strong>{best.walk}</strong>
          </div>
          {best.capacity && (
            <div className="spotbest_stat">
              <span className="spotbest_stat_label">{labels[2]}</span>
              <strong>{best.capacity}대</strong>
            </div>
          )}
        </div>
      </div>

      {/* 오른쪽 버튼 */}
      <div className="spotbest_actions">
        {/* TODO: 선택 기능 연동 */}
        <button className="spotbest_btn_select">
          이 {activeCategory === 'parking' ? '주차장' : activeCategory === 'cafe' ? '카페' : '식당'} 선택 →
        </button>
        <button className="spotbest_btn_map">지도에서 보기 📍</button>
      </div>

    </div>
  )
}

export default SpotBest