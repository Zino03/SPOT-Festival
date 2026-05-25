import { useState } from 'react'
import './DayTrip.css'

// TODO: AI API 연동 시 이 함수를 실제 API 호출로 교체
// AI가 반환해야 할 데이터 구조 (shape)
// {
//   date: '5월 29일',
//   region: '충북 청주시',
//   totalTime: '총 7시간',
//   distance: '3.4km',
//   walk: '12분 도보',
//   updatedAt: '09:42',
//   aiReason: 'AI 추천 이유 텍스트',
//   steps: [
//     {
//       time: '11:00',
//       icon: 'P',
//       title: '장소명',
//       desc: '설명',
//       highlight: false  // true면 주황색 강조
//     }
//   ]
// }

// 더미 데이터 (AI 연동 전 UI 확인용)
const DUMMY_COURSE = {
  date: '5월 29일',
  region: '충북 청주시',
  totalTime: '총 7시간',
  distance: '3.4km',
  walk: '12분 도보',
  updatedAt: '09:42',
  aiReason: '한강 공영주차장은 2시간 무료, 인근 OO국밥(평점 4.7)과 도보 4분 거리. 14시 입장이면 메인 스테이지를 모두 관람 가능하며, 18시 강변북로 정체가 시작되므로 16시 출발을 권장합니다.',
  steps: [
    { time: '11:00', icon: 'P',  title: '한강 공영주차장', desc: '도착 · 무료 주차 2시간',     highlight: false },
    { time: '12:00', icon: '🍴', title: 'OO국밥',          desc: '점심 · 도보 4분 · 평점 4.7', highlight: true  },
    { time: '13:00', icon: '☕', title: '한적 카페',        desc: '휴식 · 디저트 추천',          highlight: false },
    { time: '14:00', icon: '✦',  title: '청주 음악 축제',  desc: '입장 · 메인 스테이지',         highlight: false },
    { time: '16:00', icon: '🚌', title: '복귀 출발 권장',  desc: '18시 강변북로 정체 예상',      highlight: false },
  ]
}

function DayTrip() {
  // TODO: AI 연동 시 null → AI API 응답 데이터로 교체
  // const [course, setCourse] = useState(null)
  // useEffect(() => {
  //   fetch('/api/ai/course')
  //     .then(res => res.json())
  //     .then(data => setCourse(data))
  // }, [])

  const [course] = useState(DUMMY_COURSE) // 더미 데이터 사용 중

  // 데이터 로딩 중
  if (!course) {
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