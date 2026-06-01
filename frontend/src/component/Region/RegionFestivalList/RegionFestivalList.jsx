// 지역 페이지 우측 축제 목록 컴포넌트
// 해당 지역의 전체 축제를 날짜순 / 인기순으로 정렬해 카드 리스트로 표시
// 데이터 로드 완료 후 onFestivalCountChange 콜백으로 축제 수를 RegionPage에 전달

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchPhotos } from '../../../utils/unsplash'
import './RegionFestivalList.css'

// 오늘 기준으로 진행 중인 축제인지 계산해 isLive 필드를 추가한다.
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
        // 최대 30개 이미지를 1번의 배치 요청으로 처리
        fetchPhotos('Korean outdoor festival celebration', Math.min(withLive.length, 30))
          .then(urls => setImages(urls))
      })
      .catch(err => console.error('지역 축제 API 에러:', err))
      .finally(() => setLoading(false))
  }, [regionId])

  // 원본 배열을 직접 변경하지 않기 위해 spread로 복사
  const sorted = [...festivals].sort((a, b) => {
    if (sortBy === 'views') return (b.viewCount || 0) - (a.viewCount || 0)
    return new Date(a.startDate) - new Date(b.startDate)
  })

  if (loading) return <div style={{ padding: '40px', color: '#aaa' }}>불러오는 중...</div>

  return (
    <div className="regionfestivallist">

      {/* 축제 수 + 정렬 버튼 */}
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
            {/* 이미지 — 이미지 수보다 축제가 많으면 나머지로 채움 */}
            <div
              className="regionfestivallist_image"
              style={{
                backgroundImage: `url(${images[idx % images.length] || `https://picsum.photos/seed/${festival.id}/800/400`})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {festival.isLive && (
                <span className="regionfestivallist_live_badge">LIVE</span>
              )}
            </div>

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

            <button className="regionfestivallist_arrow">›</button>
          </li>
        ))}
      </ul>

    </div>
  )
}

export default RegionFestivalList
