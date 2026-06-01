import { useEffect, useRef, useState } from 'react'
import './FestivalNearbyList.css'

const AI_TIPS = {
  parking:    '축제 시작 1시간 전에 도착하면 주차 자리가 여유로워요.',
  restaurant: '점심 12~13시는 대기가 길어요. 11시 30분 이전을 추천해요.',
  cafe:       '축제 후 카페는 오후 3~4시가 가장 한산해요.',
}

const INITIAL_COUNT = 10

function FestivalNearbyList({ activeCategory, places, selectedPlaceId, onSelectPlace }) {
  const itemRefs = useRef({})
  const [showAll, setShowAll] = useState(false)

  useEffect(() => { setShowAll(false) }, [activeCategory])

  useEffect(() => {
    if (!selectedPlaceId) return
    const el = itemRefs.current[selectedPlaceId]
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [selectedPlaceId])

  if (!places?.length) {
    return (
      <div className="festivalnearbylist">
        <div className="festivalnearbylist_empty">주변 정보를 불러오는 중...</div>
      </div>
    )
  }

  const visiblePlaces = showAll ? places : places.slice(0, INITIAL_COUNT)
  const remaining = places.length - INITIAL_COUNT

  return (
    <div className="festivalnearbylist">

      <div className="festivalnearbylist_header">
        <span>가까운 순 · {places.length}곳</span>
        <span className="festivalnearbylist_hint">클릭 포커싱 · 더블클릭 카카오맵</span>
      </div>

      <ul className="festivalnearbylist_list">
        {visiblePlaces.map((place, i) => {
          const name     = place.place_name
          const distance = place.distance ? `${place.distance}m` : '-'
          const address  = place.road_address_name || place.address_name || ''
          const isActive = selectedPlaceId === place.id

          return (
            <li
              key={place.id ?? i}
              ref={el => { itemRefs.current[place.id] = el }}
              className={`festivalnearbylist_item${isActive ? ' festivalnearbylist_item--active' : ''}`}
              onClick={() => onSelectPlace(place.id)}
              onDoubleClick={() => place.place_url && window.open(place.place_url, '_blank')}
            >
              <span className="festivalnearbylist_rank">{i + 1}</span>
              <div className="festivalnearbylist_info">
                <h3 className="festivalnearbylist_name">{name}</h3>
                <div className="festivalnearbylist_meta">
                  <span>{distance}</span>
                  {address && <span>{address}</span>}
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      {!showAll && remaining > 0 && (
        <button
          className="festivalnearbylist_more"
          onClick={() => setShowAll(true)}
        >
          더 보기 {remaining}개 ↓
        </button>
      )}

      <div className="festivalnearbylist_aitip">
        <span className="festivalnearbylist_aitip_icon">✦</span>
        <div>
          <span className="festivalnearbylist_aitip_label">AI TIP</span>
          <p>{AI_TIPS[activeCategory]}</p>
        </div>
      </div>

    </div>
  )
}

export default FestivalNearbyList
