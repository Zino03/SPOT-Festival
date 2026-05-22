import { useState } from 'react'
import './Trending.css'

// 더미 데이터 (나중에 API로 교체)
// TODO: API 연동 시 fetch('/api/festivals?sort=views&limit=8')로 교체
// API 응답 데이터 구조:
// {
//   id, region, name, rating,
//   start_date: 'YYYY-MM-DD',
//   end_date: 'YYYY-MM-DD',
//   views, image, category
// }
const DUMMY_FESTIVALS = [
  { id: 1, region: '충북 청주시', name: '청주 음악 축제',        rating: 4.6, start_date: '2026-05-20', end_date: '2026-05-29', views: 99, image: '', category: '음악'   },
  { id: 2, region: '경남 진주시', name: '진주 남강 유등축제',    rating: 4.8, start_date: '2026-05-22', end_date: '2026-06-15', views: 96, image: '', category: '전통'   },
  { id: 3, region: '경북 안동시', name: '안동 국제탈춤페스티벌', rating: 4.7, start_date: '2026-04-27', end_date: '2026-05-06', views: 94, image: '', category: '전통'   },
  { id: 4, region: '부산 광안리', name: '부산 불꽃축제',         rating: 4.9, start_date: '2026-11-02', end_date: '2026-11-02', views: 91, image: '', category: '야경'   },
  { id: 5, region: '서울 여의도', name: '서울 세계불꽃축제',     rating: 4.8, start_date: '2026-10-05', end_date: '2026-10-05', views: 88, image: '', category: '야경'   },
  { id: 6, region: '전북 전주시', name: '전주 패션문화축제',     rating: 4.3, start_date: '2026-10-10', end_date: '2026-10-13', views: 86, image: '', category: '푸드'   },
  { id: 7, region: '경기 성남시', name: '성남 IT 문화축제',      rating: 4.2, start_date: '2026-10-20', end_date: '2026-10-22', views: 84, image: '', category: '음악'   },
  { id: 8, region: '강원 강릉시', name: '강릉 커피축제',         rating: 4.5, start_date: '2026-10-03', end_date: '2026-10-06', views: 89, image: '', category: '푸드'   },
]

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

  // TODO: API 연동 시 DUMMY_FESTIVALS → fetch 응답 데이터로 교체
  // isLive는 API 데이터에 상관없이 프론트에서 날짜로 자동 계산
  const festivals = calcIsLive(DUMMY_FESTIVALS)

  // 카테고리 필터링 후 조회수 기준 내림차순 정렬, 8개만 표시
  const filtered = festivals
    .filter(f => activeCategory === '전체' || f.category === activeCategory)
    .sort((a, b) => b.views - a.views)
    .slice(0, 8)

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

      {/* 카드 그리드 */}
      <div className="trending_grid">
        {filtered.map(festival => (
          <div key={festival.id} className="trending_card">

            {/* 이미지 영역 */}
            <div
              className="trending_card_image"
              // TODO: 이미지 생기면 아래 style 주석 해제
              // style={{ backgroundImage: `url(${festival.image})` }}
            >
              {/* 좌상단: LIVE 뱃지 + 조회수 */}
              <div className="trending_card_top_left">
                {/* isLive는 start_date ~ end_date 기준으로 자동 계산됨 */}
                {festival.isLive && (
                  <span className="trending_live_badge">● LIVE</span>
                )}
                <span className="trending_views">P {festival.views}</span>
              </div>

              {/* 우상단: 북마크 버튼 */}
              <button className="trending_bookmark">🔖</button>
            </div>

            {/* 카드 하단 정보 */}
            <div className="trending_card_body">
              <div className="trending_card_meta">
                <span className="trending_region">{festival.region}</span>
                <span className="trending_rating">★ {festival.rating}</span>
              </div>
              <h3 className="trending_name">{festival.name}</h3>
              <div className="trending_card_footer">
                <span className="trending_date">
                  📅 {festival.start_date.slice(5).replace('-', '/')} ~ {festival.end_date.slice(5).replace('-', '/')}
                </span>
                {/* TODO: 축제 상세 페이지 라우팅 연결 필요 */}
                {/* React Router 연동 시 아래 주석 해제 후 button 제거
                <Link to={`/festival/${festival.id}`}>자세히 →</Link> */}
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