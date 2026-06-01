import { useState, useEffect } from 'react'
import { fetchPhoto } from '../../../utils/unsplash'
import './FestivalHero.css'

const FESTIVAL_QUERIES = [
  'Korean outdoor festival night lantern',
  'Korea traditional festival crowd colorful',
  'Korea summer festival fireworks celebration',
  'Korea spring cherry blossom festival street',
  'Korea autumn harvest festival cultural',
]

function FestivalHero({ festival }) {
  const [heroBg, setHeroBg] = useState('')

  useEffect(() => {
    const query = FESTIVAL_QUERIES[festival.id % FESTIVAL_QUERIES.length]
    fetchPhoto(query).then(url => { if (url) setHeroBg(url) })
  }, [festival.id])

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const isLive = new Date(festival.startDate) <= today && today <= new Date(festival.endDate)

  const startDate = festival.startDate?.slice(5).replace('-', '/')
  const endDate   = festival.endDate?.slice(5).replace('-', '/')

  return (
    <div className="festivalhero">
      <div
        className="festivalhero_bg"
        style={heroBg ? { backgroundImage: `url(${heroBg})` } : {}}
      >
        <div className="festivalhero_thumbnails">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="festivalhero_thumbnail"
              style={heroBg ? { backgroundImage: `url(${heroBg})`, filter: `brightness(${0.9 - i * 0.15})` } : {}}
            />
          ))}
        </div>

        <div className="festivalhero_info">
          <div className="festivalhero_badges">
            {isLive && <span className="festivalhero_badge_live">● LIVE NOW</span>}
            <span className="festivalhero_badge_category">{festival.region}</span>
            <span className="festivalhero_badge_score">★ {festival.rating}</span>
          </div>

          <h1 className="festivalhero_title">{festival.name}</h1>

          <div className="festivalhero_meta">
            <div className="festivalhero_meta_left">
              <span>📅 {startDate} ~ {endDate}</span>
              <span>📍 {festival.address}</span>
              <span>👁 조회 {festival.viewCount?.toLocaleString()}</span>
            </div>
            <div className="festivalhero_meta_right">
              <button className="festivalhero_btn_icon">🔖</button>
              <button className="festivalhero_btn_icon">↗</button>
              <button className="festivalhero_btn_course">코스에 추가 →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FestivalHero
