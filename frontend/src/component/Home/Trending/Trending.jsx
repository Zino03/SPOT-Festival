import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchPhotos } from '../../../utils/unsplash'
import './Trending.css'


// 오늘 날짜 기준으로 isLive 자동 계산
function calcIsLive(festivals) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return festivals.map(f => ({
    ...f,
    // 시작일 <= 오늘 <= 종료일 이면 LIVE
    isLive: new Date(f.start_date) <= today && today <= new Date(f.end_date)
  }))
}

function Trending() {
    const navigate = useNavigate()
    const [festivals, setFestivals] = useState([])
    const [images, setImages] = useState([])

    useEffect(() => {
    fetch('http://localhost:8080/api/festivals/trending')
      .then(res => res.json())
      .then(data => {
        // 백엔드에서 온 데이터(JSON)를 프론트엔드 UI 변수명에 맞게 매핑
        const mappedData = data.map(f => ({
          id: f.id,
          region: f.region,
          name: f.name,
          start_date: f.startDate,
          end_date: f.endDate,
          rating: f.rating,
          views: f.viewCount,
        }));

        const live = calcIsLive(mappedData)
        setFestivals(live)
        // 축제 수만큼 이미지 일괄 요청
        fetchPhotos('Korean festival outdoor event', live.length)
          .then(urls => setImages(urls))
      })
      .catch(err => console.error("트렌딩 API 호출 에러:", err));
    }, [])

  return (
    <section className="trending">

      {/* 상단 헤더 */}
      <div className="trending_header">
        <div className="trending_header_left">
          <p className="trending_label">
            <span className="trending_label_line"></span>
            TRENDING THIS WEEK · 이번 주 뜨는 축제
          </p>
          <h2 className="trending_title">지금, 사람들이 가장 많이 검색해요.</h2>
        </div>
      </div>

        {/* 축제 카드 그리드 영역 */}
        <div className="trending_grid">
          {festivals.map((festival, idx) => (
            <div key={festival.id} className="trending_card" onClick={() => navigate(`/festival/${festival.id}`)}>

              <div className="trending_card_image" style={{ backgroundImage: `url(${images[idx % images.length] || `https://picsum.photos/seed/${festival.id}/800/400`})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="trending_card_top_left">
                  {festival.isLive && (
                    <span className="trending_live_badge">● LIVE</span>
                  )}
                </div>
              </div>

              <div className="trending_card_body">
                <div className="trending_card_meta">
                  <span className="trending_region">{festival.region}</span>
                  <span className="trending_rating">👁 {festival.views?.toLocaleString()}</span>
                </div>
                <h3 className="trending_name">{festival.name}</h3>
                <div className="trending_card_footer">
                  <span className="trending_date">
                    📅 {festival.start_date.slice(5).replace('-', '/')} ~ {festival.end_date.slice(5).replace('-', '/')}
                  </span>

                  <button className="trending_detail_btn" onClick={() => navigate(`/festival/${festival.id}`)}>자세히 →</button>
                </div>
              </div>

            </div>
          ))}
        </div>

    </section>
  )
}

export default Trending