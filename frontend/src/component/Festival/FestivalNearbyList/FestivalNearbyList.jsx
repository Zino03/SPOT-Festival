import './FestivalNearbyList.css'

// 더미 데이터 (API 연동 전)
// TODO: API 연동 시 fetch('/api/festivals/:festivalId/nearby?category=restaurant')로 교체
const DUMMY_NEARBY = {
  restaurant: [
    { id: 'A', name: 'OO국밥',    distance: '200m', isPaid: false, score: 99, rating: 4.9, image: '' },
    { id: 'B', name: '한적 카페',  distance: '320m', isPaid: false, score: 95, rating: 4.7, image: '' },
    { id: 'C', name: '한강 공영주차장', distance: '180m', isPaid: false, score: 92, rating: 4.5, image: '' },
    { id: 'D', name: '△△한정식', distance: '460m', isPaid: true,  score: 88, rating: 4.6, image: '' },
    { id: 'E', name: '감성 베이커리', distance: '280m', isPaid: false, score: 86, rating: 4.4, image: '' },
    { id: 'F', name: '지하 P타워', distance: '330m', isPaid: true,  score: 84, rating: 4.3, image: '' },
  ],
  cafe: [
    { id: 'A', name: '한적 카페',   distance: '320m', isPaid: false, score: 95, rating: 4.7, image: '' },
    { id: 'B', name: '감성 베이커리', distance: '280m', isPaid: false, score: 86, rating: 4.4, image: '' },
  ],
  parking: [
    { id: 'A', name: '한강 공영주차장', distance: '180m', isPaid: false, score: 92, rating: 4.5, image: '' },
    { id: 'B', name: '지하 P타워',     distance: '330m', isPaid: true,  score: 84, rating: 4.3, image: '' },
  ],
}

// TODO: API 연동 시 아래 더미 AI TIP도 교체
const DUMMY_AI_TIP = 'OO국밥은 12~13시 줄이 가장 짧아요. 식사 후 한적 카페까지 도보 4분.'

function FestivalNearbyList({ activeCategory }) {
  // TODO: API 연동 시 DUMMY_NEARBY → fetch 응답으로 교체
  const places = DUMMY_NEARBY[activeCategory] || DUMMY_NEARBY.restaurant

  return (
    <div className="festivalnearbylist">

      {/* 리스트 헤더 */}
      <div className="festivalnearbylist_header">
        <span>가까운 순 · {places.length}곳</span>
        <span className="festivalnearbylist_sort">전체 ∨</span>
      </div>

      {/* 장소 목록 */}
      <ul className="festivalnearbylist_list">
        {places.map(place => (
          <li key={place.id} className="festivalnearbylist_item">

            {/* 순서 알파벳 */}
            <span className="festivalnearbylist_rank">{place.id}</span>

            {/* 이미지 */}
            <div
              className="festivalnearbylist_image"
              // TODO: 이미지 생기면 아래 style 주석 해제
              // style={{ backgroundImage: `url(${place.image})` }}
            />

            {/* 장소 정보 */}
            <div className="festivalnearbylist_info">
              <h3 className="festivalnearbylist_name">{place.name}</h3>
              <div className="festivalnearbylist_meta">
                <span>{place.distance}</span>
                <span className={`festivalnearbylist_paid ${place.isPaid ? 'paid' : 'free'}`}>
                  {place.isPaid ? '유료' : 'Free'}
                </span>
                <span>Score {place.score}</span>
              </div>
            </div>

            {/* 평점 */}
            <span className="festivalnearbylist_rating">★ {place.rating}</span>

          </li>
        ))}
      </ul>

      {/* AI TIP */}
      {/* TODO: API 연동 시 DUMMY_AI_TIP → fetch 응답으로 교체 */}
      <div className="festivalnearbylist_aitip">
        <span className="festivalnearbylist_aitip_icon">✦</span>
        <div>
          <span className="festivalnearbylist_aitip_label">AI TIP</span>
          <p>{DUMMY_AI_TIP}</p>
        </div>
      </div>

    </div>
  )
}

export default FestivalNearbyList