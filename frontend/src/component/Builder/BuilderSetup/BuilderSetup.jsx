import { useState } from 'react'
import './BuilderSetup.css'

const COMPANIONS = ['혼자', '연인', '친구들', '가족', '부모님']
const DURATIONS = ['당일치기', '1박 2일', '2박 3일']
const THEMES = ['조용한', '힐링', '활동적인', '전통적인', '먹거리 탐방', '야경', '자연']

function BuilderSetup({ onComplete }) {
  const [companion, setCompanion] = useState('')
  const [duration, setDuration] = useState('')
  const [themes, setThemes] = useState([])

  function toggleTheme(t) {
    setThemes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  }

  const canProceed = companion && duration && themes.length > 0

  return (
    <div className="buildersetup">
      <div className="buildersetup_card">

        <div className="buildersetup_header">
          <p className="buildersetup_label">✦ AI COURSE BUILDER</p>
          <h1 className="buildersetup_title">어떤 여행을 원하세요?</h1>
          <p className="buildersetup_desc">AI가 취향에 맞는 코스를 설계해 드립니다.</p>
        </div>

        {/* 동행자 */}
        <div className="buildersetup_section">
          <p className="buildersetup_section_label">함께 가는 사람</p>
          <div className="buildersetup_chips">
            {COMPANIONS.map(c => (
              <button
                key={c}
                className={`buildersetup_chip ${companion === c ? 'active' : ''}`}
                onClick={() => setCompanion(c)}
              >{c}</button>
            ))}
          </div>
        </div>

        {/* 여행 기간 */}
        <div className="buildersetup_section">
          <p className="buildersetup_section_label">여행 기간</p>
          <div className="buildersetup_chips">
            {DURATIONS.map(d => (
              <button
                key={d}
                className={`buildersetup_chip ${duration === d ? 'active' : ''}`}
                onClick={() => setDuration(d)}
              >{d}</button>
            ))}
          </div>
        </div>

        {/* 테마 (복수 선택) */}
        <div className="buildersetup_section">
          <p className="buildersetup_section_label">여행 테마 <span>(복수 선택)</span></p>
          <div className="buildersetup_chips">
            {THEMES.map(t => (
              <button
                key={t}
                className={`buildersetup_chip ${themes.includes(t) ? 'active' : ''}`}
                onClick={() => toggleTheme(t)}
              >{t}</button>
            ))}
          </div>
        </div>

        <button
          className="buildersetup_cta"
          disabled={!canProceed}
          onClick={() => onComplete({ companion, duration, themes })}
        >
          코스 만들기 →
        </button>

      </div>
    </div>
  )
}

export default BuilderSetup
