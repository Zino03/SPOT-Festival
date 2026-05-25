import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './RegionFestivalList.css'

function calcIsLive(festivals) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return festivals.map(f => ({
    ...f,
    isLive: new Date(f.startDate) <= today && today <= new Date(f.endDate),
  }))
}

function RegionFestivalList({ onFestivalCountChange }) {
  const navigate = useNavigate()
  const { regionId } = useParams()
  const [festivals, setFestivals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`http://localhost:8080/api/festivals/region/${regionId}`)
      .then(res => res.json())
      .then(data => {
        const withLive = calcIsLive(data)
        setFestivals(withLive)
        onFestivalCountChange?.(withLive.length)
      })
      .catch(err => console.error('지역 축제 API 에러:', err))
      .finally(() => setLoading(false))
  }, [regionId])

  if (loading) return <div style={{ padding: '40px', color: '#aaa' }}>불러오는 중...</div>

  return (
    <div className="regionfestivallist">

      {/* 리스트 헤더 */}
      <div className="regionfestivallist_header">
        <p className="regionfestivallist_title">
          이 지역에서 열리는 <span>{festivals.length}개 축제</span>
        </p>
        <span className="regionfestivallist_sort">최근 등록순</span>
      </div>

      {/* 축제 카드 목록 */}
      <ul className="regionfestivallist_list">
        {festivals.map(festival => (
          <li
            key={festival.id}
            className={`regionfestivallist_item ${festival.isLive ? 'live' : ''}`}
            onClick={() => navigate(`/festival/${festival.id}`)}
          >
            {/* 축제 이미지 */}
            <div
              className="regionfestivallist_image"
              // TODO: 이미지 생기면 아래 style 주석 해제
              // style={{ backgroundImage: `url(${festival.image})` }}
            >
              {festival.isLive && (
                <span className="regionfestivallist_live_badge">LIVE</span>
              )}
            </div>

            {/* 축제 정보 */}
            <div className="regionfestivallist_info">
              <div className="regionfestivallist_meta">
                <span className="regionfestivallist_category">{festival.category}</span>
                <span className="regionfestivallist_rating">★ {festival.rating}</span>
              </div>
              <h3 className="regionfestivallist_name">{festival.name}</h3>
              <p className="regionfestivallist_date">
                📅 {festival.startDate?.slice(5).replace('-', '/')} ~ {festival.endDate?.slice(5).replace('-', '/')}
              </p>
              <p className="regionfestivallist_address">📍 {festival.address}</p>
            </div>

            {/* 화살표 */}
            <button className="regionfestivallist_arrow">›</button>
          </li>
        ))}
      </ul>

      {/* 하단 버튼 */}
      <div className="regionfestivallist_footer">
        <button className="regionfestivallist_btn_list">리스트로 정렬</button>
        <button className="regionfestivallist_btn_map">지도로 비교 →</button>
      </div>

    </div>
  )
}

export default RegionFestivalList