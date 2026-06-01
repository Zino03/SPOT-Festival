import { useState, useEffect } from 'react'
import { loadKakaoMap } from '../../../utils/kakao'
import './BuilderCardGrid.css'

// 단계별 더미 데이터 (step 1은 API로 교체됨)
const DUMMY_ITEMS = {
  2: [
    { id: 1, name: 'OO국밥', category: '한식', price: '₩8,000~', rating: 4.8, distance: '0.4km', walk: '12분', wait: null, image: '', isAI: true, isSelected: true },
    { id: 2, name: '△△스테이크', category: '양식', price: '₩12,000~', rating: 4.4, distance: '0.7km', walk: '8분', wait: '5분', image: '', isAI: false, isSelected: false },
    { id: 3, name: 'OO파스타', category: '양식', price: '₩14,000~', rating: 4.5, distance: '0.9km', walk: '11분', wait: '0분', image: '', isAI: false, isSelected: false },
    { id: 4, name: '▽▽분식', category: '분식', price: '₩6,000~', rating: 4.3, distance: '0.5km', walk: '7분', wait: '8분', image: '', isAI: false, isSelected: false },
    { id: 5, name: '◇◆중식', category: '한식', price: '₩9,500~', rating: 4.2, distance: '0.8km', walk: '10분', wait: '15분',image: '', isAI: false, isSelected: false },
  ],
  3: [
    { id: 1, name: '한적 카페', category: '카페', price: '₩5,000~', rating: 4.7, distance: '0.3km', walk: '4분', wait: null, image: '', isAI: true, isSelected: false },
    { id: 2, name: '감성 베이커리', category: '베이커리', price: '₩4,000~', rating: 4.4, distance: '0.6km', walk: '8분', wait: null, image: '', isAI: false, isSelected: false },
    { id: 3, name: '루프탑 카페', category: '카페', price: '₩6,000~', rating: 4.3, distance: '0.9km', walk: '11분', wait: '3분', image: '', isAI: false, isSelected: false },
  ],
  4: [
    { id: 1, name: '한강 공영주차장', category: '무료', price: 'Free', rating: 4.5, distance: '0.2km', walk: '2분', wait: null, image: '', isAI: true, isSelected: false },
    { id: 2, name: '충북 중앙 P타워', category: '유료', price: '₩2,000/h', rating: 4.7, distance: '0.3km', walk: '4분', wait: null, image: '', isAI: false, isSelected: false },
    { id: 3, name: '지하 P동', category: '유료', price: '₩1,500/h', rating: 4.4, distance: '0.4km', walk: '5분', wait: null, image: '', isAI: false, isSelected: false },
  ],
}

const KAKAO_CODE = { 2: 'FD6', 3: 'CE7' }
const SHOW_COUNT = 5

function BuilderCardGrid({ currentStep, festival, onSelect }) {
  const [selectedId, setSelectedId] = useState(null)
  const [showAll, setShowAll] = useState(false)
  const [festivalItems, setFestivalItems] = useState([])
  const [kakaoItems, setKakaoItems] = useState([])

  // Step 1: 실제 Trending 축제 API 연동
  useEffect(() => {
    if (currentStep !== 1) return
    fetch('http://localhost:8080/api/festivals/trending')
      .then(res => res.json())
      .then(data => {
        const mapped = data.map((f, i) => ({
          id: f.id,
          name: f.name,
          category: f.region,
          price: null,
          views: f.viewCount,
          distance: null,
          walk: null,
          wait: null,
          date: `${f.startDate?.slice(5).replace('-','/')} ~ ${f.endDate?.slice(5).replace('-','/')}`,
          lat: f.lat,
          lng: f.lng,
          image: '',
          isAI: i === 0, // 조회수 1위 = AI 추천
        }))
        setFestivalItems(mapped)
      })
      .catch(err => console.error('축제 API 에러:', err))
  }, [currentStep])

  // Step 2(맛집), Step 3(카페): Kakao Places
  useEffect(() => {
    if (![2, 3].includes(currentStep) || !festival?.lat) return
    setKakaoItems([])

    loadKakaoMap().then(() => {
      const { kakao } = window
      const ps = new kakao.maps.services.Places()
      ps.categorySearch(KAKAO_CODE[currentStep], (result, status) => {
        if (status !== kakao.maps.services.Status.OK) return
        setKakaoItems(result.map((p, i) => ({
          id: p.id,
          name: p.place_name,
          category: p.category_name?.split('>').pop().trim() || '',
          price: null,
          rating: null,
          distance: p.distance ? `${p.distance}m` : null,
          walk: p.distance ? `${Math.ceil(p.distance / 80)}분` : null,
          wait: null,
          isAI: i === 0,
          address: p.road_address_name || p.address_name,
          phone: p.phone,
        })))
      }, {
        location: new kakao.maps.LatLng(festival.lat, festival.lng),
        radius: 1500,
        sort: kakao.maps.services.SortBy.DISTANCE,
      })
    })
  }, [currentStep, festival])

  // Step 4: 주차장 API
  useEffect(() => {
    if (currentStep !== 4 || !festival?.lat) return
    setKakaoItems([])

    fetch(`http://localhost:8080/api/parking/nearby?lat=${festival.lat}&lng=${festival.lng}`)
      .then(r => r.json())
      .then(data => setKakaoItems(data.map((p, i) => ({
        id: p.id || i,
        name: p.place_name,
        category: '주차장',
        price: null,
        rating: null,
        distance: `${p.distance}m`,
        walk: `${Math.ceil(p.distance / 80)}분`,
        wait: null,
        isAI: i === 0,
        address: p.road_address_name || p.address_name,
      }))))
      .catch(err => console.error('주차장 API 에러:', err))
  }, [currentStep, festival])

  const items = currentStep === 1
    ? festivalItems
    : [2, 3, 4].includes(currentStep) && festival
      ? kakaoItems
      : (DUMMY_ITEMS[currentStep] || [])
  const visibleItems = showAll ? items : items.slice(0, SHOW_COUNT)
  const remainCount = items.length - SHOW_COUNT

  function handleSelect(item) {
    setSelectedId(item.id)
    // 선택된 아이템을 부모(BuilderPage)로 전달
    if (onSelect) onSelect(item)
  }

  return (
    <div className="buildercardgrid">

      {/* 카드 그리드 */}
      <div className="buildercardgrid_grid">
        {visibleItems.map(item => (
          <div
            key={item.id}
            className={`buildercardgrid_card ${selectedId === item.id ? 'selected' : ''}`}
            onClick={() => handleSelect(item)}
          >
            {/* AI 추천 + 선택됨 뱃지 */}
            <div className="buildercardgrid_badges">
              {item.isAI && (
                <span className="buildercardgrid_badge_ai">✦ AI 1순위</span>
              )}
              {selectedId === item.id && (
                <span className="buildercardgrid_badge_selected">선택됨</span>
              )}
            </div>

            {/* 이미지 */}
            <div
              className="buildercardgrid_image"
              // TODO: 이미지 생기면 아래 style 주석 해제
              // style={{ backgroundImage: `url(${item.image})` }}
            />

            {/* 카드 정보 */}
            <div className="buildercardgrid_info">
              <div className="buildercardgrid_meta">
                {item.price && <span className="buildercardgrid_price">{item.price}</span>}
                {item.views != null && <span className="buildercardgrid_rating">👁 {item.views?.toLocaleString()}</span>}
              </div>
              <h3 className="buildercardgrid_name">{item.name}</h3>
              <div className="buildercardgrid_details">
                {item.date && <span>📅 {item.date}</span>}
                {item.walk && <span>🚶 도보 {item.walk}</span>}
                {item.distance && !item.date && <span>{item.distance}</span>}
                {item.wait && (
                  <span className={`buildercardgrid_wait ${item.wait === '0분' ? 'none' : ''}`}>
                    🕐 대기 {item.wait}
                  </span>
                )}
              </div>
            </div>

          </div>
        ))}

        {/* 더보기 카드 */}
        {!showAll && remainCount > 0 && (
          <div
            className="buildercardgrid_more"
            onClick={() => setShowAll(true)}
          >
            <span className="buildercardgrid_more_icon">+</span>
            <p>{remainCount} MORE</p>
            <p className="buildercardgrid_more_desc">나머지 후보 보기</p>
          </div>
        )}
      </div>

    </div>
  )
}

export default BuilderCardGrid