import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './BuilderReport.css'

function BuilderReport({ selectedItems, preferences, onReset }) {
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const festival = selectedItems[1]

  useEffect(() => {
    const body = {
      festivalName: festival?.name || '',
      latitude: festival?.lat || 0,
      longitude: festival?.lng || 0,
      duration: preferences.duration,
      companion: preferences.companion,
      themes: preferences.themes,
    }

    fetch('http://localhost:8080/api/planner/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then(r => r.text())
      .then(text => {
        // Gemini 응답에서 JSON 블록 추출
        const match = text.match(/\{[\s\S]*\}/)
        if (match) {
          setResult(JSON.parse(match[0]))
        } else {
          setError('AI 응답을 파싱할 수 없습니다.')
        }
      })
      .catch(() => setError('AI 플래너 요청에 실패했습니다.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="builderreport_loading">
      <div className="builderreport_spinner" />
      <p>AI가 코스를 설계하고 있습니다...</p>
      <span>{preferences.companion}과 함께하는 {preferences.duration} 코스</span>
    </div>
  )

  if (error) return (
    <div className="builderreport_error">
      <p>{error}</p>
      <button onClick={onReset}>다시 시도</button>
    </div>
  )

  return (
    <div className="builderreport">

      {/* 헤더 */}
      <div className="builderreport_header">
        <div className="builderreport_header_left">
          <p className="builderreport_label">✦ AI COURSE REPORT</p>
          <h1 className="builderreport_title">{result.title}</h1>
          <div className="builderreport_meta">
            <span>📅 {result.duration}</span>
            <span>👥 {preferences.companion}</span>
            {preferences.themes.map(t => (
              <span key={t} className="builderreport_theme">{t}</span>
            ))}
          </div>
        </div>
        <div className="builderreport_header_right">
          <button className="builderreport_btn_reset" onClick={onReset}>← 다시 만들기</button>
          <button className="builderreport_btn_map" onClick={() => navigate('/map')}>지도에서 보기</button>
        </div>
      </div>

      {/* 선택 요약 */}
      <div className="builderreport_summary">
        {[
          { step: 1, label: '축제', icon: '🎪' },
          { step: 2, label: '맛집', icon: '🍴' },
          { step: 3, label: '카페', icon: '☕' },
          { step: 4, label: '주차장', icon: '🅿' },
        ].map(({ step, label, icon }) => (
          selectedItems[step] && (
            <div key={step} className="builderreport_summary_item">
              <span className="builderreport_summary_icon">{icon}</span>
              <div>
                <p className="builderreport_summary_label">{label}</p>
                <p className="builderreport_summary_name">{selectedItems[step].name}</p>
              </div>
            </div>
          )
        ))}
      </div>

      {/* 일정표 */}
      {result.itinerary?.map(day => (
        <div key={day.day} className="builderreport_day">
          <h2 className="builderreport_day_title">Day {day.day}</h2>
          <div className="builderreport_timeline">
            {day.timeline?.map((item, i) => (
              <div key={i} className="builderreport_timeline_item">
                <div className="builderreport_timeline_time">{item.time}</div>
                <div className="builderreport_timeline_dot" />
                <div className="builderreport_timeline_content">
                  <strong>{item.place}</strong>
                  <p>{item.activity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

    </div>
  )
}

export default BuilderReport
