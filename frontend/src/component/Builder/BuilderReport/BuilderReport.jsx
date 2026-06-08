import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './BuilderReport.css'

function BuilderReport({ selectedItems, preferences, onReset }) {
  const navigate = useNavigate()
  const location = useLocation()
  
  // DayTrip에서 넘어온 데이터가 있다면 바로 초기값으로 설정
  const preloadedCourse = location.state?.preloadedCourse

  const [result, setResult] = useState(preloadedCourse || null)
  const [loading, setLoading] = useState(!preloadedCourse) // 프리로드가 있으면 로딩 스킵
  const [error, setError] = useState(null)

  useEffect(() => {
      if (preloadedCourse) return;

    if (!selectedItems || !preferences) {
      setError('코스 설계에 필요한 정보가 부족합니다.')
      setLoading(false)
      return;
    }

    const festival = selectedItems[1]

    const body = {
      festivalName: festival?.name || '',
      latitude: festival?.lat || 0,
      longitude: festival?.lng || 0,
      duration: preferences.duration || '당일치기',
      companion: preferences.companion || '친구',
      themes: preferences.themes || [],
      restaurants: selectedItems[2] || [],
      cafe: selectedItems[3] || null,
      parking: selectedItems[4] || null,
    }

    fetch('http://localhost:8080/api/planner/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then(res => {
        if (!res.ok) throw new Error('AI 통신 실패')
        return res.json()
      })
      .then(data => setResult(data))
      .catch(() => setError('AI 플래너 요청에 실패했습니다.'))
      .finally(() => setLoading(false))
  }, [preloadedCourse, selectedItems, preferences])

  if (loading) return (
    <div className="builderreport_loading">
      <div className="builderreport_spinner" />
      <p>AI가 코스를 설계하고 있습니다...</p>
      <span>{preferences?.companion}과 함께하는 {preferences?.duration} 코스</span>
    </div>
  )

  if (error) return (
    <div className="builderreport_error">
      <p>🚨 {error}</p>
      <button onClick={onReset || (() => navigate('/'))}>
        {onReset ? '다시 시도' : '홈으로 돌아가기'}
      </button>
    </div>
  )

  return (
    <div className="builderreport">

      <div className="builderreport_header">
        <div className="builderreport_header_left">
          <p className="builderreport_label">✦ AI COURSE REPORT</p>
          {/* preloadedCourse의 구조와 새로 생성된 result 구조 차이 대응 */}
          <h1 className="builderreport_title">{result.title || result.aiReason}</h1>
          <div className="builderreport_meta">
            <span>📅 {result.duration || result.date}</span>
            {preferences?.companion && <span>👥 {preferences.companion}</span>}
            {preferences?.themes?.map(t => (
              <span key={t} className="builderreport_theme">{t}</span>
            ))}
          </div>
        </div>
        <div className="builderreport_header_right">
          {onReset && (
            <button className="builderreport_btn_reset" onClick={onReset}>← 다시 만들기</button>
          )}
          <button 
            className="builderreport_btn_map" 
              onClick={() => navigate('/map', { state: { courseData: result } })}
          >
            지도에서 보기 →
          </button>
        </div>
      </div>

      {/* 선택 요약 (빌더를 통해 들어왔을 때만 노출) */}
      {selectedItems && (
        <div className="builderreport_summary">
          {[
            { step: 1, label: '축제', icon: '🎪' },
            { step: 2, label: '맛집', icon: '🍴' },
            { step: 3, label: '카페', icon: '☕' },
            { step: 4, label: '주차장', icon: '🅿' },
          ].map(({ step, label, icon }) => {
              const itemData = selectedItems[step];
              if (!itemData) return null;
              return (
                <div key={step} className="builderreport_summary_item">
                  <span className="builderreport_summary_icon">{icon}</span>
                  <div>
                    <p className="builderreport_summary_label">{label}</p>
                    {Array.isArray(itemData) ? (
                      itemData.map((place, idx) => (
                        <p key={place.id || idx} className="builderreport_summary_name">
                          {idx === 0 ? '☀️ ' : '🌙 '} {place.name}
                        </p>
                      ))
                    ) : (
                      <p className="builderreport_summary_name">{itemData.name}</p>
                    )}
                  </div>
                </div>
              )
            })}
        </div>
      )}

      {/* 일정표 (단일 타임라인 배열과 Day별 배열 모두 대응) */}
      <div className="builderreport_timeline_container">
        {(result.itinerary || [{ day: 1, timeline: result.steps }]).map(day => (
          <div key={day.day || 1} className="builderreport_day">
            {result.itinerary && <h2 className="builderreport_day_title">Day {day.day}</h2>}
            <div className="builderreport_timeline">
              {day.timeline?.map((item, i) => (
                <div key={i} className="builderreport_timeline_item">
                  <div className="builderreport_timeline_time">{item.time}</div>
                  <div className="builderreport_timeline_dot" />
                  <div className="builderreport_timeline_content">
                    <strong>{item.place || item.title}</strong>
                    <p>{item.activity || item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default BuilderReport