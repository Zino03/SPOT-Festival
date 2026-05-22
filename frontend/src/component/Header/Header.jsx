import './Header.css'

function Header() {
  return (
    <header className="header">

      {/* 로고 */}
      <div className="header_logo">
        <div className="header_logo-icon">📍</div>
        <div className="header_logo-text">
          <span className="header_logo-title">SPOT</span>
          <span className="header_logo-sub">FESTIVAL · KOREA</span>
        </div>
      </div>

      {/* 네비게이션 */}
      <nav className="header_nav">
        <a href="#" className="active">홈</a>
        <a href="#">지도</a>
        <a href="#">AI 코스</a>
        <a href="#">축제</a>
        <a href="#">About</a>
      </nav>

      {/* 검색 + AI 버튼 */}
      <div className="header_actions">
        <div className="header_search">
          <span>🔍</span>
          <input type="text" placeholder="축제, 지역, 카페 검색" />
          <kbd>⌘K</kbd>
        </div>
        <button className="header__ai-btn">
          ✦ AI 코스 시작
        </button>
      </div>

    </header>
  )
}

export default Header