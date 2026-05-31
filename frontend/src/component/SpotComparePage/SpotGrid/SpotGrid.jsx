import { useState } from 'react'
import './SpotGrid.css'

// 더미 데이터 (API 연동 전)
// TODO: API 연동 시 fetch('/api/festivals/:festivalId/compare?category=parking')로 교체
const DUMMY_SPOTS = {
  restaurant: [
    { id: 2, name: '△△한정식',   address: '청주시 서원구 사업구 200-1', score: 95, rating: 4.7, distance: '320m', isPaid: false, capacity: null, tags: ['넓은 자리', '헬프데이트', '보한 우수'], image: '' },
    { id: 3, name: '감성 베이커리', address: '청주시 서원구 포르동 31-4',  score: 88, rating: 4.4, distance: '440m', isPaid: false, capacity: null, tags: ['대형 자쟁 OK', '소도볼 친인'], image: '' },
    { id: 4, name: '축제장 정문 노상', address: '청주시 서원구 성앙로 70', score: 81, rating: 4.2, distance: '150m', isPaid: false, capacity: null, tags: ['빠른 진근', '선착순'], image: '' },
    { id: 5, name: 'OO병원 주차장',  address: '청주시 서원구 시산네로 22', score: 72, rating: 3.9, distance: '560m', isPaid: true,  capacity: null, tags: ['여유 자리'], image: '' },
    { id: 6, name: '공영 갓길 주차',  address: '청주시 서원구 삼남로 9번지', score: 17, rating: 2.4, distance: '230m', isPaid: false, capacity: null, tags: ['단속 주의'], image: '', isCaution: true },
  ],
  cafe: [
    { id: 2, name: '감성 베이커리', address: '청주시 서원구 포르동 31-4', score: 86, rating: 4.4, distance: '280m', isPaid: false, capacity: null, tags: ['조용한 분위기'], image: '' },
    { id: 3, name: '루프탑 카페',   address: '청주시 서원구 삼남로 12',   score: 80, rating: 4.1, distance: '400m', isPaid: false, capacity: null, tags: ['뷰 맛집'], image: '' },
  ],
  parking: [
    { id: 2, name: '충북 중앙 P타워',  address: '청주시 서원구 사업구 200-1', score: 95, rating: 4.7, distance: '320m', isPaid: false, capacity: 240, tags: ['넓은 자리', '헬프데이트', '보한 우수'], image: '' },
    { id: 3, name: '지하 P동',         address: '청주시 서원구 포르동 31-4',  score: 88, rating: 4.4, distance: '440m', isPaid: true,  capacity: 320, tags: ['대형 자쟁 OK', '소도볼 친인'], image: '' },
    { id: 4, name: '축제장 정문 노상',  address: '청주시 서원구 성앙로 70',   score: 81, rating: 4.2, distance: '150m', isPaid: false, capacity: 48,  tags: ['빠른 진근', '선착순'], image: '' },
    { id: 5, name: 'OO병원 주차장',    address: '청주시 서원구 시산네로 22', score: 72, rating: 3.9, distance: '560m', isPaid: true,  capacity: 120, tags: ['여유 자리'], image: '' },
    { id: 6, name: '공영 갓길 주차',   address: '청주시 서원구 삼남로 9번지', score: 17, rating: 2.4, distance: '230m', isPaid: false, capacity: null, tags: ['단속 주의'], image: '', isCaution: true },
  ],
}

const SHOW_COUNT = 5  // 처음에 보여줄 개수

function SpotGrid({ activeCategory }) {
  const [showAll, setShowAll] = useState(false)

  // TODO: API 연동 시 DUMMY_SPOTS → fetch 응답으로 교체
  const spots = DUMMY_SPOTS[activeCategory] || []
  const visibleSpots = showAll ? spots : spots.slice(0, SHOW_COUNT)
  const remainCount = spots.length - SHOW_COUNT

  return (
    <div className="spotgrid">

      {/* 헤더 */}
      <div className="spotgrid_header">
        <h3 className="spotgrid_title">다른 후보 {spots.length}곳 비교</h3>
        <p className="spotgrid_desc">
          모든 점수는 SPOT 알고리즘 (거리·요금·영업시간·여유·기준점)으로 산출됩니다.
        </p>
      </div>

      {/* 카드 그리드 */}
      <div className="spotgrid_grid">
        {visibleSpots.map(spot => (
          <div
            key={spot.id}
            className={`spotgrid_card ${spot.isCaution ? 'caution' : ''}`}
          >
            {/* 순위 뱃지 */}
            <div className="spotgrid_rank">{spot.id}</div>

            {/* 이미지 */}
            <div
              className="spotgrid_image"
              // TODO: 이미지 생기면 아래 style 주석 해제
              // style={{ backgroundImage: `url(${spot.image})` }}
            >
              {spot.isCaution && (
                <span className="spotgrid_caution_badge">⚠ 주의</span>
              )}
            </div>

            {/* 장소명 + 주소 */}
            <div className="spotgrid_info">
              <h4 className="spotgrid_name">{spot.name}</h4>
              <p className="spotgrid_address">{spot.address}</p>
            </div>

            {/* SPOT SCORE */}
            <div className="spotgrid_score_wrap">
              <span className="spotgrid_score_label">SPOT SCORE</span>
              <div className="spotgrid_score">
                <strong>{spot.score}</strong>
                <span>/100</span>
              </div>
              <div className="spotgrid_score_bar">
                <div
                  className="spotgrid_score_fill"
                  style={{ width: `${spot.score}%` }}
                />
              </div>
              <span className="spotgrid_rating">★ {spot.rating}</span>
            </div>

            {/* 통계 */}
            <div className="spotgrid_stats">
              <div className="spotgrid_stat">
                <span>거리</span>
                <strong>{spot.distance}</strong>
              </div>
              <div className="spotgrid_stat">
                <span>요금</span>
                <strong className={spot.isPaid ? 'paid' : 'free'}>
                  {spot.isPaid ? '유료' : 'Free'}
                </strong>
              </div>
              {spot.capacity && (
                <div className="spotgrid_stat">
                  <span>수용</span>
                  <strong>{spot.capacity}대</strong>
                </div>
              )}
            </div>

            {/* 태그 */}
            <div className="spotgrid_tags">
              {spot.tags.map((tag, i) => (
                <span key={i} className="spotgrid_tag">{tag}</span>
              ))}
            </div>

            {/* 선택하기 버튼 */}
            {/* TODO: 선택 기능 연동 */}
            <button className="spotgrid_btn">선택하기 →</button>

          </div>
        ))}
      </div>

      {/* 더보기 버튼 */}
      {!showAll && remainCount > 0 && (
        <button
          className="spotgrid_more_btn"
          onClick={() => setShowAll(true)}
        >
          나머지 {remainCount}개
          {activeCategory === 'parking' ? ' 주차장' : activeCategory === 'cafe' ? ' 카페' : ' 식당'}
          보기 →
        </button>
      )}

    </div>
  )
}

export default SpotGrid