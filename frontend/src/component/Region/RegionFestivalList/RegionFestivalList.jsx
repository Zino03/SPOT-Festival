import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchPhotos } from '../../../utils/unsplash'
import './RegionFestivalList.css'

function calcIsLive(festivals) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return festivals.map(f => ({
    ...f,
    isLive: new Date(f.startDate) <= today && today <= new Date(f.endDate),
  }))
}

function RegionFestivalList({ onFestivalCountChange, onStatsChange }) {
  const navigate = useNavigate()
  const { regionId } = useParams()
  const [festivals, setFestivals] = useState([])
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('date') // 'date' | 'views'

  useEffect(() => {
    setLoading(true)
    fetch(`http://localhost:8080/api/festivals/region/${regionId}`)
      .then(res => res.json())
      .then(data => {
        const withLive = calcIsLive(data)
        setFestivals(withLive)
        onFestivalCountChange?.(withLive.length)
        fetchPhotos('Korean outdoor festival celebration', Math.min(withLive.length, 30))
          .then(urls => setImages(urls))
        const liveCount = withLive.filter(f => f.isLive).length
        onStatsChange?.({ festivalCount: withLive.length, liveCount })
      })
      .catch(err => console.error('지역 축제 API 에러:', err))
      .finally(() => setLoading(false))
  }, [regionId])

  const sorted = [...festivals].sort((a, b) => {
    if (sortBy === 'views') return (b.viewCount || 0) - (a.viewCount || 0)
    return new Date(a.startDate) - new Date(b.startDate)
  })

  if (loading) return <div style={{ padding: '40px', color: '#aaa' }}>불러오는 중...</div>

  return (
    <div className="regionfestivallist">

      {/* 리스트 헤더 */}
      <div className="regionfestivallist_header">
        <p className="regionfestivallist_title">
          이 지역에서 열리는 <span>{festivals.length}개 축제</span>
        </p>
        <div className="regionfestivallist_sort_btns">
          <button
            className={`regionfestivallist_sort_btn ${sortBy === 'date' ? 'active' : ''}`}
            onClick={() => setSortBy('date')}
          >날짜순</button>
          <button
            className={`regionfestivallist_sort_btn ${sortBy === 'views' ? 'active' : ''}`}
            onClick={() => setSortBy('views')}
          >인기순</button>
        </div>
      </div>

      {/* 축제 카드 목록 */}
      <ul className="regionfestivallist_list">
        {sorted.map((festival, idx) => (
          <li
            key={festival.id}
            className={`regionfestivallist_item ${festival.isLive ? 'live' : ''}`}
            onClick={() => navigate(`/festival/${festival.id}`)}
          >
            <div
              className="regionfestivallist_image"
              style={{ backgroundImage: `url(${images[idx % images.length] || `https://picsum.photos/seed/${festival.id}/800/400`})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              {festival.isLive && (
                <span className="regionfestivallist_live_badge">LIVE</span>
              )}
            </div>

            {/* 축제 정보 */}
            <div className="regionfestivallist_info">
              <div className="regionfestivallist_meta">
                <span className="regionfestivallist_rating">👁 {festival.viewCount?.toLocaleString()}</span>
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


    </div>
  )
}

export default RegionFestivalList