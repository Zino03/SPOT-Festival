import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchPhoto } from '../../../utils/unsplash'
import './HeroBanner.css'

const FALLBACK_BG = 'https://picsum.photos/seed/korea-festival/1600/560'

function HeroBanner() {
  const navigate = useNavigate()
  const [liveCount, setLiveCount] = useState(0)
  const [monthCount, setMonthCount] = useState(0)
  const [heroBg, setHeroBg] = useState(FALLBACK_BG)

  useEffect(() => {
    fetch('http://localhost:8080/api/festivals/stats')
      .then(res => res.json())
      .then(data => {
        setLiveCount(data.liveCount)
        setMonthCount(data.monthCount)
      })
      .catch(err => console.error('stats API 에러:', err))
  }, [])

  useEffect(() => {
    fetchPhoto('Korean festival night celebration outdoor')
      .then(url => { if (url) setHeroBg(url) })
  }, [])

  return (
    <section className="hero" style={{ backgroundImage: `url(${heroBg})` }}>

      {/* 상단 바 */}
      <div className="hero_topbar">
        <span className="hero_live">
          <span className="hero_live_dot"></span>
          LIVE · 지금 열리는 축제 {liveCount}곳
        </span>
      </div>

      {/* 왼쪽 콘텐츠 */}
      <div className="hero_content">
        <p className="hero_label">FESTIVAL · KOREA · 2026</p>
        <h1 className="hero_title">
          지도 위에서 만나는<br />
          가을, 그리고 축제.
        </h1>
        <p className="hero_desc">
          전국 축제와 핫플레이스, 주차장까지 —<br />
          한 번의 클릭으로 떠나는 로컬 큐레이션 가이드.
        </p>
        <div className="hero_buttons">
          <button className="hero_btn_primary" onClick={() => navigate('/map')}>지금 떠나기 →</button>
        </div>
      </div>

      {/* 오른쪽 이번 달 카드 */}
      <div className="hero_index_card">
        <p className="hero_index_label">이번 달 SPOT INDEX</p>
        <div className="hero_index_stats">
          <div className="hero_index_item">
            <strong>{monthCount.toLocaleString()}</strong>
            <span>이번 달 축제</span>
          </div>
          <div className="hero_index_item">
            <strong>{liveCount}</strong>
            <span>지금 라이브</span>
          </div>
        </div>
      </div>

    </section>
  )
}

export default HeroBanner
