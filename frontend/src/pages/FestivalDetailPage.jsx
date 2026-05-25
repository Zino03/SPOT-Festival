import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './FestivalDetailPage.css'

function FestivalDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [festival, setFestival] = useState(null)
  const [parkings, setParkings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`http://localhost:8080/api/festivals/${id}`)
      .then(res => res.json())
      .then(data => {
        setFestival(data)
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

      {/* 뒤로 가기 */}
      <button className="festivaldetail_back" onClick={() => navigate(-1)}>← 뒤로</button>

      {/* 헤더 */}
      <div className="festivaldetail_header">
        <div className="festivaldetail_header_top">
          <span className="festivaldetail_region">{festival.region}</span>
          {isLive && <span className="festivaldetail_live">● LIVE</span>}
        </div>
        <h1 className="festivaldetail_name">{festival.name}</h1>
        <div className="festivaldetail_meta">
          <span className="festivaldetail_date">📅 {startDate} ~ {endDate}</span>
          <span className="festivaldetail_rating">★ {festival.rating}</span>
          <span className="festivaldetail_views">조회 {festival.viewCount}</span>
        </div>
        <p className="festivaldetail_address">📍 {festival.address}</p>
      </div>

      {/* 주변 주차장 */}
      <div className="festivaldetail_parking">
        <h2 className="festivaldetail_parking_title">주변 주차장 ({parkings.length}개)</h2>
        {parkings.length === 0 ? (
          <p className="festivaldetail_parking_empty">주변 주차장 정보가 없습니다.</p>
        ) : (
          <ul className="festivaldetail_parking_list">
            {parkings.map((p, i) => (
              <li key={i} className="festivaldetail_parking_item">
                <div className="festivaldetail_parking_info">
                  <span className="festivaldetail_parking_name">{p.place_name}</span>
                  <span className="festivaldetail_parking_address">{p.road_address_name || p.address_name}</span>
                </div>
                <span className="festivaldetail_parking_distance">{p.distance}m</span>
              </li>
            ))}
          </ul>
        )}
      </div>

    </main>
  )
}

export default FestivalDetailPage
