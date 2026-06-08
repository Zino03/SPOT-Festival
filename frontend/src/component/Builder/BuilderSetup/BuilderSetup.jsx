import { useState } from 'react'
import { useLocation } from 'react-router-dom';
import './BuilderSetup.css'

const REGIONS = ['전국', '서울/경기', '강원', '충청', '전라', '경상', '제주']
const COMPANIONS = ['혼자', '연인', '친구들', '가족', '부모님']
const THEMES = ['조용한', '힐링', '활동적인', '전통적인', '먹거리 탐방', '야경', '자연']

const mapRegionToCategory = (address) => {
  if (!address) return '';
  if (address.match(/서울|경기|인천/)) return '서울/경기';
  if (address.match(/강원/)) return '강원';
  if (address.match(/충북|충남|충청|대전|세종/)) return '충청';
  if (address.match(/전북|전남|전라|광주/)) return '전라';
  if (address.match(/경북|경남|경상|부산|대구|울산/)) return '경상';
  if (address.match(/제주/)) return '제주';

  return '전국';
};

function BuilderSetup({ onComplete }) {
  const location = useLocation();
  const initialRegion = location.state?.preselectedRegion
    ? mapRegionToCategory(location.state.preselectedRegion) 
    : '';

  const [region, setRegion] = useState(initialRegion);
  const [date, setDate] = useState('')
  const [companion, setCompanion] = useState('')
  const [themes, setThemes] = useState([])

  const today = new Date().toISOString().split('T')[0]

  function toggleTheme(t) {
    setThemes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  }

  const canProceed = region && date && companion && themes.length > 0

  return (
    <div className="buildersetup">
      <div className="buildersetup_card">

        <div className="buildersetup_header">
          <p className="buildersetup_label">✦ AI COURSE BUILDER</p>
          <h1 className="buildersetup_title">어떤 여행을 원하세요?</h1>
          <p className="buildersetup_desc">AI가 취향에 맞는 코스를 설계해 드립니다.</p>
        </div>

        {/* 1. 희망 지역 */}
        <div className="buildersetup_section">
          <p className="buildersetup_section_label">희망 지역</p>
          <div className="buildersetup_chips">
            {REGIONS.map(r => (
              <button
                key={r}
                className={`buildersetup_chip ${region === r ? 'active' : ''}`}
                onClick={() => setRegion(r)}
              >{r}</button>
            ))}
          </div>
        </div>

        {/* 2. 방문 날짜 */}
        <div className="buildersetup_section">
          <p className="buildersetup_section_label">방문 날짜</p>
          <input
            type="date"
            className="buildersetup_date_input"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              width: '100%', padding: '12px', borderRadius: '8px',
              border: '1px solid #ddd', fontSize: '15px', color: '#333',
              fontFamily: 'inherit', cursor: 'pointer'
            }}
          />
        </div>

        {/* 3. 동행자 */}
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

        {/* 4. 테마 (복수 선택) */}
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
          onClick={() => onComplete({ region, date, companion, themes })}
        >
          코스 만들기 →
        </button>

      </div>
    </div>
  )
}

export default BuilderSetup
