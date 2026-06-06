// 공통 헤더 컴포넌트 — 모든 페이지 상단에 고정(sticky)으로 렌더링
// 로고 / 네비게이션 / 축제 검색창 / AI 코스 시작 버튼으로 구성

// 검색창:
// - 입력 후 API 검색 요청을 보내 자동완성 드롭다운 표시
// - 검색창 바깥 클릭 시 드롭다운 닫기
// - Enter 키 입력 시 첫 번째 결과 페이지로 이동

import { useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './Header.css'

function Header() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  // 검색창 전체 래퍼 — 외부 클릭 감지용
  const wrapRef = useRef(null)

  // 입력값 변경 시 250ms 디바운스 후 축제 검색 API 호출
  useEffect(() => {
    if (!query.trim()) { setResults([]); setOpen(false); return }
    const timer = setTimeout(() => {
      fetch(`http://localhost:8080/api/festivals/search?q=${encodeURIComponent(query)}`)
        .then(r => r.json())
        .then(data => { setResults(data); setOpen(data.length > 0) })
        .catch(() => setOpen(false))
    }, 250)
    return () => clearTimeout(timer)
  }, [query])

  // 검색창 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // 드롭다운 항목 선택 시 해당 축제 상세 페이지로 이동
  function handleSelect(festival) {
    navigate(`/festival/${festival.id}`)
    setQuery('')
    setOpen(false)
  }

  return (
    <header className="header">

      {/* 로고 */}
      <div className="header_logo" onClick={() => navigate('/')}>
        <div className="header_logo-icon">📍</div>
        <div className="header_logo-text">
          <span className="header_logo-title">SPOT</span>
          <span className="header_logo-sub">FESTIVAL · KOREA</span>
        </div>
      </div>

      {/* 네비게이션 */}
      <nav className="header_nav">
        <NavLink to="/" end>홈</NavLink>
        <NavLink to="/map">지도</NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>

      {/* 검색창 + AI 코스 버튼 */}
      <div className="header_actions">

        {/* 검색창 + 자동완성 드롭다운 */}
        <div className="header_search_wrap" ref={wrapRef}>
          <div className="header_search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="축제, 지역 검색"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => results.length > 0 && setOpen(true)}
              onKeyDown={e => {
                if (e.key === 'Enter' && results.length > 0) handleSelect(results[0])
              }}
            />
            {query && (
              <button className="header_search_clear" onClick={() => { setQuery(''); setOpen(false) }}>✕</button>
            )}
          </div>

          {open && (
            <div className="header_search_dropdown">
              {results.map(f => {
                const today = new Date()
                const isLive = new Date(f.startDate) <= today && today <= new Date(f.endDate)
                return (
                  <div
                    key={f.id}
                    className="header_search_item"
                    onClick={() => handleSelect(f)}
                  >
                    <div className="header_search_item_left">
                      {isLive && <span className="header_search_live">LIVE</span>}
                      <span className="header_search_name">{f.name}</span>
                    </div>
                    <span className="header_search_region">{f.region}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <button className="header_ai_btn" onClick={() => navigate('/builder')}>
          ✦ AI 코스 시작
        </button>
      </div>

    </header>
  )
}

export default Header
