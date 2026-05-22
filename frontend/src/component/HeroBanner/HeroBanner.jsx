import { useState, useEffect } from 'react'
import './HeroBanner.css'

// TODO: API 연동 시 아래 mockFestivals 제거하고 fetch로 교체
const mockFestivals = [
  { id: 1, name: '청주 공예 축제',   start_date: '2026-05-20', end_date: '2026-05-25' },
  { id: 2, name: '전주 비빔밥 축제', start_date: '2026-05-22', end_date: '2026-05-30' },
  { id: 3, name: '서울 빛 축제',     start_date: '2026-05-24', end_date: '2026-06-01' },
  { id: 4, name: '부산 국제 영화제', start_date: '2026-05-28', end_date: '2026-06-05' },
  { id: 5, name: '강릉 커피 축제',   start_date: '2026-06-01', end_date: '2026-06-07' },
]

function HeroBanner() {
  const [activeFilter, setActiveFilter] = useState(null) // null = 오늘(기본)
  const [liveCount, setLiveCount] = useState(0)

  useEffect(() => {
    // TODO: API 연동 시 아래 주석 해제 후 mockFestivals 제거
    // fetch('/api/festivals')
    //   .then(res => res.json())
    //   .then(festivals => countByFilter(festivals))

    countByFilter(mockFestivals)
  }, [activeFilter])

  function countByFilter(festivals) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let filtered

    if (activeFilter === null) {
      // 오늘 진행 중인 축제 (시작일 <= 오늘 <= 종료일)
      filtered = festivals.filter(f => {
        const start = new Date(f.start_date)
        const end   = new Date(f.end_date)
        return start <= today && today <= end
      })

    } else if (activeFilter === 'week') {
      // 이번 주 (오늘 ~ 이번 주 일요일)
      const endOfWeek = new Date(today)
      endOfWeek.setDate(today.getDate() + (7 - today.getDay()))
      filtered = festivals.filter(f => {
        const start = new Date(f.start_date)
        const end   = new Date(f.end_date)
        return start <= endOfWeek && end >= today
      })

    } else if (activeFilter === 'month') {
      // 이번 달 (오늘 ~ 이번 달 말일)
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      filtered = festivals.filter(f => {
        const start = new Date(f.start_date)
        const end   = new Date(f.end_date)
        return start <= endOfMonth && end >= today
      })

    } else if (activeFilter === 'weekend') {
      // 이번 주 토~일
      const saturday = new Date(today)
      saturday.setDate(today.getDate() + (6 - today.getDay()))
      const sunday = new Date(saturday)
      sunday.setDate(saturday.getDate() + 1)
      filtered = festivals.filter(f => {
        const start = new Date(f.start_date)
        const end   = new Date(f.end_date)
        return start <= sunday && end >= saturday
      })
    }

    setLiveCount(filtered.length)
  }

  const filters = [
    { label: '이번 주', value: 'week'    },
    { label: '이번 달', value: 'month'   },
    { label: '주말',    value: 'weekend' },
  ]

  return (
    <section className="hero">

      {/* 상단 바 */}
      <div className="hero_topbar">
        {/* TODO: API 연동 후 liveCount는 자동으로 실제 데이터 반영됨 */}
        <span className="hero_live">
          <span className="hero_live-dot"></span>
          LIVE · 지금 열리는 축제 {liveCount}곳
        </span>
        <div className="hero_filters">
          {filters.map(f => (
            <button
              key={f.value}
              className={`hero_filter ${activeFilter === f.value ? 'active' : ''}`}
              onClick={() =>
                setActiveFilter(prev => prev === f.value ? null : f.value)
              }
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 왼쪽 콘텐츠 */}
      <div className="hero_content">
        <p className="hero_label">FESTIVAL · KOREA · AUTUMN 2026</p>
        <h1 className="hero_title">
          지도 위에서 만나는<br />
          가을, 그리고 축제.
        </h1>
        <p className="hero_desc">
          전국 247개 축제와 핫플레이스, 주차장까지 —<br />
          한 번의 클릭으로 떠나는 로컬 큐레이션 가이드.
        </p>
        <div className="hero_buttons">
          <button className="hero_btn-primary">지금 떠나기 →</button>
          <button className="hero_btn-secondary">전국 지도 보기</button>
        </div>
      </div>

      {/* 오른쪽 SPOT INDEX 카드 */}
      <div className="hero_index-card">
        <p className="hero_index-label">이번 주 SPOT INDEX</p>
        <div className="hero_index-stats">
          <div className="hero_index-item">
            <strong>247</strong>
            <span>축제</span>
          </div>
          <div className="hero_index-item">
            <strong>1.2K</strong>
            <span>핫플</span>
          </div>
          <div className="hero_index-item">
            <strong>896</strong>
            <span>주차</span>
          </div>
        </div>
      </div>

    </section>
  )
}

export default HeroBanner