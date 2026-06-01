import { useState, useEffect } from 'react'
import MapViewer from '../component/Maps/MapViewer/MapViewer'
import MapRegionList from '../component/Maps/MapRegionList/MapRegionList'
import MapGuide from '../component/Maps/MapGuide/MapGuide'
import { fetchPhoto } from '../utils/unsplash'
import './MapPage.css'

const FALLBACK_BG = 'https://picsum.photos/seed/korea-map-hero/1600/480'

function MapPage() {
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [stats, setStats] = useState({ totalCount: 0, liveCount: 0, monthCount: 0 })
  const [heroBg, setHeroBg] = useState(FALLBACK_BG)

  useEffect(() => {
    fetch('http://localhost:8080/api/festivals/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('stats API 에러:', err))
  }, [])

  useEffect(() => {
    fetchPhoto('South Korea landscape travel aerial')
      .then(url => { if (url) setHeroBg(url) })
  }, [])

  return (
    <main className="mappage">

      {/* 히어로 */}
      <div
        className="mappage_hero"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="mappage_hero_overlay">
          <div className="mappage_hero_left">
            <p className="mappage_hero_label">SPOT · MAP · KOREA 2026</p>
            <h1 className="mappage_hero_title">
              한국 어디든,<br />한 번의 클릭으로.
            </h1>
            <p className="mappage_hero_desc">
              지도 위 광역시·도를 선택해 지역별 축제를 탐색하세요.
            </p>
          </div>
          <div className="mappage_hero_stats">
            <div className="mappage_hero_stat">
              <strong>{stats.totalCount.toLocaleString()}</strong>
              <span>전국 축제</span>
            </div>
            <div className="mappage_hero_stat_divider" />
            <div className="mappage_hero_stat">
              <strong>{stats.liveCount}</strong>
              <span>지금 라이브</span>
            </div>
            <div className="mappage_hero_stat_divider" />
            <div className="mappage_hero_stat">
              <strong>{stats.monthCount}</strong>
              <span>이번 달</span>
            </div>
          </div>
        </div>
      </div>

      {/* 지도 + 리스트 */}
      <div className="mappage_content">
        <MapViewer
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
        />
        <MapRegionList />
      </div>

      <MapGuide />
    </main>
  )
}

export default MapPage
