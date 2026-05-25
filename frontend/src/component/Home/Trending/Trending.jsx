import { useState, useEffect } from 'react'
import './Trending.css'

const CATEGORIES = ['전체', '음악', '전통', '푸드', '꽃·계절', '야경']

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
    const [activeCategory, setActiveCategory] = useState('전체')
    const [festivals, setFestivals] = useState([]) // 백엔드에서 가져온 데이터를 담을 상태

    // 화면이 처음 켜질 때 백엔드 API 1회 호출
    useEffect(() => {
    fetch('http://localhost:8080/api/festivals/trending')
      .then(res => res.json())
      .then(data => {
        // 백엔드에서 온 데이터(JSON)를 프론트엔드 UI 변수명에 맞게 매핑
        const mappedData = data.map(f => ({
          id: f.id,
          region: f.region,
          name: f.name,
          start_date: f.startDate, // Spring의 startDate -> React의 start_date
          end_date: f.endDate,     // Spring의 endDate -> React의 end_date
          rating: f.rating,        // 평점
          views: f.viewCount,      // 조회수

          // 아래 두 개는 아직 DB에 없는 컬럼이므로 UI를 위해 임시로 랜덤 값을 넣습니다.
          // 나중에 AI가 카테고리를 분류해주거나 이미지가 추가되면 교체하면 됩니다.
          category: CATEGORIES[Math.floor(Math.random() * 5) + 1],
          image: ''
        }));

        // 데이터 매핑 후 상태(State) 업데이트 -> 화면 렌더링
        setFestivals(calcIsLive(mappedData));
      })
      .catch(err => console.error("트렌딩 API 호출 에러:", err));
    }, [])

    // 카테고리 탭 클릭 시 필터링
    const filtered = festivals
    .filter(f => activeCategory === '전체' || f.category === activeCategory)

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

        {/* 카테고리 필터 탭 */}
        <div className="trending_tabs">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`trending_tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

        {/* 축제 카드 그리드 영역 */}
        <div className="trending_grid">
          {filtered.map(festival => (
            <div key={festival.id} className="trending_card">

              <div className="trending_card_image">
                <div className="trending_card_top_left">
                  {festival.isLive && (
                    <span className="trending_live_badge">● LIVE</span>
                  )}
                  {/* 🎯 실제 DB의 조회수가 표시됩니다 */}
                  <span className="trending_views">P {festival.views}</span>
                </div>
                <button className="trending_bookmark">🔖</button>
              </div>

              <div className="trending_card_body">
                <div className="trending_card_meta">
                  <span className="trending_region">{festival.region}</span>
                  {/* 🎯 실제 DB의 평점이 표시됩니다 */}
                  <span className="trending_rating">★ {festival.rating}</span>
                </div>
                <h3 className="trending_name">{festival.name}</h3>
                <div className="trending_card_footer">
                  <span className="trending_date">
                    📅 {festival.start_date.slice(5).replace('-', '/')} ~ {festival.end_date.slice(5).replace('-', '/')}
                  </span>

                  {/* <Link to={`/festival/${festival.id}`}>자세히 →</Link> */}
                  <button className="trending_detail_btn">자세히 →</button>
                </div>
              </div>

            </div>
          ))}
        </div>

    </section>
  )
}

export default Trending