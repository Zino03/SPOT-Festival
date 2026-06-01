// 축제 상세 페이지 주변 장소 목록 컴포넌트
// 카카오 Places 검색 결과를 리스트로 표시하며, 거리순 / 인기순 정렬 토글을 제공
//
// 처음엔 INITIAL_COUNT(10)개만 표시하고 "더 보기" 버튼으로 전체 노출
// 카테고리 또는 정렬이 바뀌면 showAll을 초기화해 다시 10개부터 보여준다
// 목록 항목 클릭 → 지도 마커 포커싱 / 더블클릭 → 카카오맵 페이지 새 탭 오픈
// selectedPlaceId 변경 시 해당 항목으로 자동 스크롤

import { useEffect, useRef, useState } from 'react'
import './FestivalNearbyList.css'

// 카테고리별 AI 팁 문구
const AI_TIPS = {
  parking: '축제 시작 1시간 전에 도착하면 주차 자리가 여유로워요.',
  restaurant: '점심 12~13시는 대기가 길어요. 11시 30분 이전을 추천해요.',
  cafe: '축제 후 카페는 오후 3~4시가 가장 한산해요.',
}

const INITIAL_COUNT = 10 // 처음에 보여줄 항목 수

function FestivalNearbyList({ activeCategory, activeSort, onSortChange, places, selectedPlaceId, onSelectPlace }) {
  const itemRefs = useRef({}) // place.id → DOM 요소 — 자동 스크롤용
  const [showAll, setShowAll] = useState(false)

  // 카테고리 또는 정렬 변경 시 더 보기 초기화
  useEffect(() => { setShowAll(false) }, [activeCategory, activeSort])

  // 선택된 장소가 바뀌면 해당 항목으로 스크롤
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

      {/* 정렬 기준 표시 + 거리순/인기순 토글 */}
      <div className="festivalnearbylist_header">
        <span>{activeSort === 'accuracy' ? '인기 순' : '가까운 순'} · {places.length}곳</span>
        <div className="festivalnearbylist_sort">
          <button
            className={`festivalnearbylist_sort_btn ${activeSort === 'distance' ? 'active' : ''}`}
            onClick={() => onSortChange('distance')}
          >거리순</button>
          <button
            className={`festivalnearbylist_sort_btn ${activeSort === 'accuracy' ? 'active' : ''}`}
            onClick={() => onSortChange('accuracy')}
          >인기순</button>
        </div>
      </div>
      <span className="festivalnearbylist_hint">클릭 포커싱 · 더블클릭 카카오맵</span>

      <ul className="festivalnearbylist_list">
        {visiblePlaces.map((place, i) => {
          const name = place.place_name
          const distance = place.distance ? `${place.distance}m` : '-'
          const address = place.road_address_name || place.address_name || ''
          const isActive = selectedPlaceId === place.id

          return (
            <li
              key={place.id ?? i}
              ref={el => { itemRefs.current[place.id] = el }}
              className={`festivalnearbylist_item${isActive ? ' festivalnearbylist_item--active' : ''}`}
              onClick={() => onSelectPlace(place.id)}
              // 더블클릭 시 카카오맵 장소 페이지를 새 탭으로 오픈
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

      {/* 처음 10개 이후 더 보기 버튼 */}
      {!showAll && remaining > 0 && (
        <button
          className="festivalnearbylist_more"
          onClick={() => setShowAll(true)}
        >
          더 보기 {remaining}개 ↓
        </button>
      )}

      {/* 카테고리별 AI 팁 */}
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
