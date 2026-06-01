import './FestivalNearbyList.css'

const AI_TIPS = {
  parking:    '축제 시작 1시간 전에 도착하면 주차 자리가 여유로워요.',
  restaurant: '점심 12~13시는 대기가 길어요. 11시 30분 이전을 추천해요.',
  cafe:       '축제 후 카페는 오후 3~4시가 가장 한산해요.',
}

function FestivalNearbyList({ activeCategory, places }) {
  if (!places?.length) {
    return (
      <div className="festivalnearbylist">
        <div className="festivalnearbylist_empty">주변 정보를 불러오는 중...</div>
      </div>
    )
  }

  return (
    <div className="festivalnearbylist">

      <div className="festivalnearbylist_header">
        <span>가까운 순 · {places.length}곳</span>
        <span className="festivalnearbylist_sort">전체 ∨</span>
      </div>

      <ul className="festivalnearbylist_list">
        {places.map((place, i) => {
          const name     = place.place_name
          const distance = place.distance ? `${place.distance}m` : '-'
          const address  = place.road_address_name || place.address_name || ''
          const rank     = String.fromCharCode(65 + i)

          return (
            <li key={place.id ?? i} className="festivalnearbylist_item">
              <span className="festivalnearbylist_rank">{rank}</span>
              <div className="festivalnearbylist_image" />
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
