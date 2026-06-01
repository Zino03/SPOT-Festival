import { useState, useEffect } from 'react'
import './DayTrip.css'

function DayTrip() {
  const [course, setCourse] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  // API 호출 로직을 재사용 가능한 함수로 분리 (isRefresh 파라미터 추가)
  const fetchCourse = (isRefresh = false) => {
    setIsLoading(true)
    setErrorMessage(null) // 다시 요청할 때 기존 에러 메시지 초기화
    // 백엔드 주소 뒤에 ?refresh=true/false 쿼리 파라미터를 동적으로 붙여줍니다.
  fetch(`http://localhost:8080/api/planner/generate?refresh=${isRefresh}`, {
    method: 'POST',
    headers:{
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      duration: "당일치기",
      companion: "친구",
      themes: ["음악", "휴식", "트렌디한"],
      festivalName: "청주 음악 축제",
      latitude: 36.6424,
      longitude: 127.4890
    })
  })
    .then(async (res) => {
    // 백엔드가 200(성공)이 아닌 에러 상태를 보냈을 때 처리
        if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.message); // 백엔드가 보낸 에러 메시지를 던짐
            }
            return res.json();
        })
    .then(data => {
      // 중요: 백엔드에서 주는 데이터(data)를 프론트엔드 UI 구조에 맞게 변환(Mapping)
      const today = new Date();
      const mappedData = {
        date: `${today.getMonth() + 1}월 ${today.getDate()}일`,
        region: '충북 청주시',
        totalTime: '총 7시간', // (참고: 거리/시간은 추후 카카오 모빌리티 API 등으로 고도화 가능)
        distance: '3.4km',
        walk: '12분 도보',
        updatedAt: today.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        aiReason: data.title || 'AI가 분석한 최적의 동선입니다.',
        // 백엔드의 itinerary -> timeline 배열을 프론트의 steps 배열로 변환
        steps: data.itinerary[0].timeline.map((item, index) => ({
          time: item.time,
          icon: index === 0 ? 'P' : (index === 1 ? '🍴' : '✦'), // 순서에 맞춰 임시 아이콘 부여
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
    fetchCourse(false)
  }, [])
  // 에러가 발생했을 때 보여줄 화면
  if (errorMessage) {
    return (
      <section className="daytrip">
        <div className="daytrip_loading" style={{ color: '#ff6b6b'}}>
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
  // 데이터 로딩 중
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
            {/* ✨ 4. 강제 새로고침(새 코스 발급) 버튼 추가 */}
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
          <button className="daytrip_btn_save">🔖 저장</button>
          <button className="daytrip_btn_start">이 코스 시작하기 →</button>
        </div>
      </div>

      {/* 코스 카드 */}
      <div className="daytrip_card">

        {/* 코스 요약 정보 바 */}
        <div className="daytrip_info_bar">
          <div className="daytrip_info_left">
            <span className="daytrip_ai_badge">✦ AI</span>
            <span>⏱ {course.totalTime}</span>
            <span>🚗 {course.distance}</span>
            <span>🚶 {course.walk}</span>
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