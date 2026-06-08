import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './DayTrip.css'

// 트렌딩 API 실패 시 사용할 기본 축제
const FALLBACK_FESTIVAL = {
  name: '청주 음악 축제',
  lat: 36.6424,
  lng: 127.4890,
  region: '충북 청주시',
}

function DayTrip() {
  const [course, setCourse] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  // 새 코스 짜기 버튼에서 재사용할 현재 선택된 축제
  const [currentFestival, setCurrentFestival] = useState(null)
  const navigate = useNavigate()

  // state 비동기 때문에 festival을 인자로 직접 받음
  const fetchCourse = (isRefresh = false, festival = null) => {
    const target = festival || currentFestival
    if (!target) return

    setIsLoading(true)
    setErrorMessage(null)

    fetch(`http://localhost:8080/api/planner/generate?refresh=${isRefresh}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        duration: "당일치기",
        companion: "친구",
        themes: ["음악", "휴식", "트렌디한"],
        festivalName: target.name,
        latitude: target.lat || 37.5665,
        longitude: target.lng || 126.9780,
      })
    })
      .then(async res => {
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.message)
        }
        return res.json()
      })
      .then(data => {
        const today = new Date()
        const mappedData = {
          date: `${today.getMonth() + 1}월 ${today.getDate()}일`,
          region: target.region || '전국',
          updatedAt: today.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
          aiReason: data.title || 'AI가 분석한 최적의 동선입니다.',
          // 백엔드의 itinerary → timeline 배열을 프론트의 steps 배열로 변환
          steps: data.itinerary[0].timeline.map((item, index) => ({
            time: item.time,
            icon: index === 0 ? 'P' : (index === 1 ? '🍴' : '✦'),
            title: item.place,
            desc: item.activity,
            highlight: index === 1 // 두 번째 항목 오렌지색 강조
          })) || []
        }
        setCourse(mappedData)
        setIsLoading(false)
      })
      .catch(err => {
        console.error('AI 코스 로딩 에러:', err)
        setErrorMessage(err.message)
        setIsLoading(false)
      })
  }

  useEffect(() => {
    setCurrentFestival(FALLBACK_FESTIVAL)
    fetchCourse(false, FALLBACK_FESTIVAL)
  }, [])

  if (errorMessage) {
    return (
      <section className="daytrip">
        <div className="daytrip_loading" style={{ color: '#ff6b6b' }}>
          <span>⚠️ {errorMessage}</span>
          <button
            onClick={() => fetchCourse(true)}
            style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #ff6b6b', backgroundColor: 'transparent', color: '#ff6b6b', cursor: 'pointer', marginTop: '10px' }}
          >
            🔄 다시 시도하기
          </button>
        </div>
      </section>
    )
  }

  if (isLoading || !course) {
    return (
      <section className="daytrip">
        <div className="daytrip_loading">
          <span>✦</span> AI가 코스를 생성 중입니다...
        </div>
      </section>
    )
  }

  return (
    <section className="daytrip">

      {/* 상단 헤더 */}
      <div className="daytrip_header">
        <div className="daytrip_header_left">
          <p className="daytrip_label">
            <span className="daytrip_label_line"></span>
            AI CURATED COURSE · 오늘의 추천 코스
            <button
              onClick={() => fetchCourse(true)}
              title="AI에게 새로운 코스를 요청합니다"
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#666', display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#f0f0f0' }}
            >
              🔄 새 코스 짜기
            </button>
          </p>
          <h2 className="daytrip_title">
            {course.date}, <span>{course.region}</span>로 떠나는 하루.
          </h2>
          <p className="daytrip_desc">
            교통, 식사, 휴식, 입장 시간까지 — AI가 짠 하루 코스. 출발 전 한눈에 확인하세요.
          </p>
        </div>
        <div className="daytrip_header_right">
          <button 
            className="daytrip_btn_start"
            onClick={() => navigate('/builder', {
              state: { 
                jumpToReport: true,
                preloadedCourse: course
              } })}
          >이 코스 시작하기 →
          </button>
        </div>
      </div>

      {/* 코스 카드 */}
      <div className="daytrip_card">

        {/* 코스 요약 정보 바 */}
        <div className="daytrip_info_bar">
          <div className="daytrip_info_left">
            <span className="daytrip_ai_badge">✦ AI</span>
          </div>
          <span className="daytrip_updated">마지막 업데이트 · {course.updatedAt}</span>
        </div>

        {/* 타임라인 */}
        <div className="daytrip_timeline">
          {course.steps.map((step, index) => (
            <div
              key={index}
              className={`daytrip_step ${step.highlight ? 'active' : ''}`}
            >
              {/* 아이콘 + 연결 점선 */}
              <div className="daytrip_step_icon_wrap">
                <div className="daytrip_step_icon">{step.icon}</div>
                {index < course.steps.length - 1 && (
                  <div className="daytrip_step_line"></div>
                )}
              </div>
              {/* 시간 + 장소 정보 */}
              <div className="daytrip_step_info">
                <span className="daytrip_step_time">{step.time}</span>
                <strong className="daytrip_step_title">{step.title}</strong>
                <span className="daytrip_step_desc">{step.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* AI 추천 이유 */}
        <div className="daytrip_ai_reason">
          <span className="daytrip_ai_reason_icon">ℹ</span>
          <p>
            <strong>AI 추천 이유.</strong> {course.aiReason}
          </p>
        </div>

      </div>
    </section>
  )
}

export default DayTrip