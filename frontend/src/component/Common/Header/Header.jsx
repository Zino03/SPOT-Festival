import { NavLink, useNavigate } from 'react-router-dom'
import './Header.css'

function Header() {
  const navigate = useNavigate()

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
        <span className="header_nav_disabled">AI 코스</span>
        <span className="header_nav_disabled">축제</span>
        <span className="header_nav_disabled">About</span>
      </nav>

      {/* 검색 + AI 버튼 */}
      <div className="header_actions">
        <div className="header_search">
          <span>🔍</span>
          <input type="text" placeholder="축제, 지역, 카페 검색" />
          <kbd>⌘K</kbd>
        </div>
        <button className="header_ai_btn">
          ✦ AI 코스 시작
        </button>
      </div>

    </header>
  )
}

export default Header
