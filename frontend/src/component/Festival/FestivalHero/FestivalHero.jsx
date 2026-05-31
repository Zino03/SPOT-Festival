import { useParams } from 'react-router-dom'
import './FestivalHero.css'

// 더미 데이터 (API 연동 전)
// TODO: API 연동 시 fetch('/api/festivals/:festivalId')로 교체
const DUMMY_FESTIVAL = {
  id: 1,
  name: '청주시 음악 축제',
  category: '음악',
  score: 99,
  rating: 4.6,
  ratingCount: 1842,
  start_date: '2026-10-17',
  end_date: '2026-10-29',
  address: '충북 청주시 서원구 삼남로 69번길 12',
  isLive: true,
  image: '',
  thumbnails: ['', '', '', ''],  // TODO: API 연동 시 이미지 URL로 교체
}

function FestivalHero() {
  const { festivalId } = useParams()

  // TODO: API 연동 시 DUMMY_FESTIVAL → fetch 응답으로 교체
  const festival = DUMMY_FESTIVAL

  return (
    <div className="festivalhero">

      {/* 배경 이미지 영역 */}
      <div
        className="festivalhero_bg"
        // TODO: 이미지 생기면 아래 style 주석 해제
        // style={{ backgroundImage: `url(${festival.image})` }}
      >
        {/* 우측 상단 썸네일 */}
        <div className="festivalhero_thumbnails">
          {festival.thumbnails.slice(0, 3).map((thumb, index) => (
            <div
              key={index}
              className="festivalhero_thumbnail"
              // TODO: 이미지 생기면 아래 style 주석 해제
              // style={{ backgroundImage: `url(${thumb})` }}
            />
          ))}
          {festival.thumbnails.length > 3 && (
            <div className="festivalhero_thumbnail_more">
              +{festival.thumbnails.length - 3}<br />more
            </div>
          )}
        </div>

        {/* 하단 정보 */}
        <div className="festivalhero_info">

          {/* 뱃지 묶음 */}
          <div className="festivalhero_badges">
            {festival.isLive && (
              <span className="festivalhero_badge_live">● LIVE NOW</span>
            )}
            <span className="festivalhero_badge_category">{festival.category}</span>
            <span className="festivalhero_badge_score">P SCORE {festival.score}</span>
          </div>

          {/* 축제명 */}
          <h1 className="festivalhero_title">{festival.name}</h1>

          {/* 날짜 / 주소 / 평점 / 액션 버튼 */}
          <div className="festivalhero_meta">
            <div className="festivalhero_meta_left">
              <span>📅 {festival.start_date.slice(5).replace('-', '/')} ~ {festival.end_date.slice(5).replace('-', '/')}</span>
              <span>📍 {festival.address}</span>
              <span>★ {festival.rating} ({festival.ratingCount.toLocaleString()})</span>
            </div>
            <div className="festivalhero_meta_right">
              <button className="festivalhero_btn_icon">🔖</button>
              <button className="festivalhero_btn_icon">↗</button>
              {/* TODO: 코스에 추가 기능 연동 */}
              <button className="festivalhero_btn_course">코스에 추가 →</button>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}

export default FestivalHero