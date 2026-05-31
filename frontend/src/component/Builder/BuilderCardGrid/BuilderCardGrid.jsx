import { useState } from 'react'
import './BuilderCardGrid.css'

// 단계별 더미 데이터
// TODO: API 연동 시 fetch('/api/builder/items?step=2&filter=한식')로 교체
const DUMMY_ITEMS = {
  1: [
    { id: 1, name: '청주 음악 축제',     category: '음악', price: null,      rating: 4.8, distance: '1.5km', walk: '12분', wait: null,  image: '', isAI: true,  isSelected: false },
    { id: 2, name: '단양 소백산 철쭉제', category: '꽃·계절', price: null,   rating: 4.4, distance: '2.1km', walk: '8분',  wait: null,  image: '', isAI: false, isSelected: false },
    { id: 3, name: '충주 세계무술축제',  category: '전통', price: null,      rating: 4.5, distance: '0.8km', walk: '10분', wait: null,  image: '', isAI: false, isSelected: false },
    { id: 4, name: '제천 한방바이오축제', category: '푸드', price: null,     rating: 4.3, distance: '3.2km', walk: '15분', wait: null,  image: '', isAI: false, isSelected: false },
  ],
  2: [
    { id: 1, name: 'OO국밥',    category: '한식', price: '₩8,000~',  rating: 4.8, distance: '0.4km', walk: '12분', wait: null,  image: '', isAI: true,  isSelected: true  },
    { id: 2, name: '△△스테이크', category: '양식', price: '₩12,000~', rating: 4.4, distance: '0.7km', walk: '8분',  wait: '5분', image: '', isAI: false, isSelected: false },
    { id: 3, name: 'OO파스타',  category: '양식', price: '₩14,000~', rating: 4.5, distance: '0.9km', walk: '11분', wait: '0분', image: '', isAI: false, isSelected: false },
    { id: 4, name: '▽▽분식',   category: '분식', price: '₩6,000~',  rating: 4.3, distance: '0.5km', walk: '7분',  wait: '8분', image: '', isAI: false, isSelected: false },
    { id: 5, name: '◇◆중식',   category: '한식', price: '₩9,500~',  rating: 4.2, distance: '0.8km', walk: '10분', wait: '15분',image: '', isAI: false, isSelected: false },
  ],
  3: [
    { id: 1, name: '한적 카페',   category: '카페', price: '₩5,000~', rating: 4.7, distance: '0.3km', walk: '4분',  wait: null,  image: '', isAI: true,  isSelected: false },
    { id: 2, name: '감성 베이커리', category: '베이커리', price: '₩4,000~', rating: 4.4, distance: '0.6km', walk: '8분', wait: null, image: '', isAI: false, isSelected: false },
    { id: 3, name: '루프탑 카페', category: '카페', price: '₩6,000~', rating: 4.3, distance: '0.9km', walk: '11분', wait: '3분', image: '', isAI: false, isSelected: false },
  ],
  4: [
    { id: 1, name: '한강 공영주차장', category: '무료', price: 'Free',    rating: 4.5, distance: '0.2km', walk: '2분',  wait: null,  image: '', isAI: true,  isSelected: false },
    { id: 2, name: '충북 중앙 P타워', category: '유료', price: '₩2,000/h', rating: 4.7, distance: '0.3km', walk: '4분', wait: null,  image: '', isAI: false, isSelected: false },
    { id: 3, name: '지하 P동',       category: '유료', price: '₩1,500/h', rating: 4.4, distance: '0.4km', walk: '5분', wait: null,  image: '', isAI: false, isSelected: false },
  ],
}

const SHOW_COUNT = 5  // 처음에 보여줄 카드 수

function BuilderCardGrid({ currentStep, onSelect }) {
  const [selectedId, setSelectedId] = useState(null)
  const [showAll, setShowAll] = useState(false)

  // TODO: API 연동 시 DUMMY_ITEMS → fetch 응답으로 교체
  const items = DUMMY_ITEMS[currentStep] || []
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

            {/* 북마크 버튼 */}
            <button className="buildercardgrid_bookmark">🔖</button>

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
                <span className="buildercardgrid_rating">★ {item.rating}</span>
              </div>
              <h3 className="buildercardgrid_name">{item.name}</h3>
              <div className="buildercardgrid_details">
                <span>🚶 도보 {item.walk}</span>
                <span>{item.distance}</span>
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