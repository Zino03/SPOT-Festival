import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchPhoto } from '../utils/unsplash'
import './FestivalDetailPage.css'

// 5개 쿼리 순환 → 5번 캐시 후 API 요청 없음
const FESTIVAL_QUERIES = [
  'Korean outdoor festival night lantern',
  'Korea traditional festival crowd colorful',
  'Korea summer festival fireworks celebration',
  'Korea spring cherry blossom festival street',
  'Korea autumn harvest festival cultural',
]

function FestivalDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [festival, setFestival] = useState(null)
  const [parkings, setParkings] = useState([])
  const [loading, setLoading] = useState(true)
  const [heroBg, setHeroBg] = useState(`https://picsum.photos/seed/${id}/1400/500`)

  useEffect(() => {
    fetch(`http://localhost:8080/api/festivals/${id}`)
      .then(res => res.json())
      .then(data => {
        setFestival(data)
        // ID 기준으로 5개 쿼리 순환 → 캐시 채운 후 API 요청 없음
        const query = FESTIVAL_QUERIES[data.id % FESTIVAL_QUERIES.length]
        fetchPhoto(query).then(url => { if (url) setHeroBg(url) })
        return fetch(`http://localhost:8080/api/parking/nearby?lat=${data.lat}&lng=${data.lng}`)
      })
      .then(res => res.json())
      .then(data => setParkings(data || []))
      .catch(err => console.error('축제 상세 API 에러:', err))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="festivaldetail_loading">불러오는 중...</div>
  if (!festival) return <div className="festivaldetail_loading">축제 정보를 찾을 수 없습니다.</div>

  const startDate = festival.startDate?.slice(0, 10).replace(/-/g, '.')
  const endDate = festival.endDate?.slice(0, 10).replace(/-/g, '.')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const isLive = new Date(festival.startDate) <= today && today <= new Date(festival.endDate)

  return (
    <main className="festivaldetail">

      {/* 히어로 */}
      <div
        className="festivaldetail_hero"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="festivaldetail_hero_overlay">

          <button className="festivaldetail_back" onClick={() => navigate(-1)}>
            ← 뒤로
          </button>

          <div className="festivaldetail_hero_content">
            <div className="festivaldetail_hero_top">
              <span className="festivaldetail_region">{festival.region}</span>
              {isLive && <span className="festivaldetail_live">● LIVE</span>}
            </div>
            <h1 className="festivaldetail_name">{festival.name}</h1>
            <div className="festivaldetail_meta">
              <span>📅 {startDate} ~ {endDate}</span>
              <span className="festivaldetail_rating">★ {festival.rating}</span>
              <span className="festivaldetail_views">조회 {festival.viewCount}</span>
            </div>
          </div>

        </div>
      </div>

      {/* 본문 2단 */}
      <div className="festivaldetail_body">

        {/* 왼쪽: 축제 정보 */}
        <div className="festivaldetail_info">
          <div className="festivaldetail_info_card">
            <h2 className="festivaldetail_section_title">축제 정보</h2>
            <div className="festivaldetail_info_row">
              <span className="festivaldetail_info_label">📍 장소</span>
              <span className="festivaldetail_info_value">{festival.address}</span>
            </div>
            <div className="festivaldetail_info_row">
              <span className="festivaldetail_info_label">📅 기간</span>
              <span className="festivaldetail_info_value">{startDate} ~ {endDate}</span>
            </div>
            <div className="festivaldetail_info_row">
              <span className="festivaldetail_info_label">📌 지역</span>
              <span className="festivaldetail_info_value">{festival.region}</span>
            </div>
            <div className="festivaldetail_info_row">
              <span className="festivaldetail_info_label">⭐ 평점</span>
              <span className="festivaldetail_info_value festivaldetail_rating">{festival.rating} / 5.0</span>
            </div>
          </div>

          {/* 지도 자리 */}
          <div className="festivaldetail_map_placeholder">
            <p className="festivaldetail_map_icon">🗺️</p>
            <p className="festivaldetail_map_title">카카오 지도</p>
            <p className="festivaldetail_map_desc">지도 연동 예정</p>
          </div>
        </div>

        {/* 오른쪽: 주변 주차장 */}
        <div className="festivaldetail_parking">
          <h2 className="festivaldetail_section_title">
            주변 주차장
            <span className="festivaldetail_parking_count">{parkings.length}개</span>
          </h2>
          {parkings.length === 0 ? (
            <p className="festivaldetail_parking_empty">주변 주차장 정보가 없습니다.</p>
          ) : (
            <ul className="festivaldetail_parking_list">
              {parkings.map((p, i) => (
                <li key={i} className="festivaldetail_parking_item">
                  <div className="festivaldetail_parking_rank">{i + 1}</div>
                  <div className="festivaldetail_parking_info">
                    <span className="festivaldetail_parking_name">{p.place_name}</span>
                    <span className="festivaldetail_parking_address">
                      {p.road_address_name || p.address_name}
                    </span>
                  </div>
                  <span className="festivaldetail_parking_distance">{p.distance}m</span>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </main>
  )
}

export default FestivalDetailPage
