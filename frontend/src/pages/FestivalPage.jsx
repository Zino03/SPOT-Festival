// 축제 상세 페이지 (/festival/:festivalId)
// 축제 히어로(FestivalHero) + 주변 장소 섹션 구성

// 주변 장소 섹션 구조:
// - FestivalNearbyHeader : 카테고리 탭 (식당 / 카페 / 주차장)
// - FestivalNearbyMap : 카카오맵 + 장소 마커
// - FestivalNearbyList : 장소 목록 (거리순 / 인기순 정렬)
//
// nearbyPlaces는 { restaurant: [...], cafe: [...], parking: [...] } 형태로 카테고리별 캐싱
// 정렬이 변경되면 캐시를 초기화하고 새 정렬 기준으로 재검색

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import FestivalHero from '../component/Festival/FestivalHero/FestivalHero'
import FestivalNearbyHeader from '../component/Festival/FestivalNearbyHeader/FestivalNearbyHeader'
import FestivalNearbyMap from '../component/Festival/FestivalNearbyMap/FestivalNearbyMap'
import FestivalNearbyList from '../component/Festival/FestivalNearbyList/FestivalNearbyList'
import './FestivalPage.css'

function FestivalPage() {
  const { festivalId } = useParams()
  const [festival, setFestival] = useState(null)
  const [nearbyPlaces, setNearbyPlaces] = useState({}) // 카테고리별 장소 캐시
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('restaurant')
  const [activeSort, setActiveSort] = useState('distance')
  const [selectedPlaceId, setSelectedPlaceId] = useState(null)

  // 카테고리 전환 시 선택된 장소 초기화
  function handleSelectCategory(category) {
    setActiveCategory(category)
    setSelectedPlaceId(null)
  }

  // 정렬 변경 시 캐시 초기화 후 재검색
  function handleSortChange(sort) {
    setActiveSort(sort)
    setNearbyPlaces({})
    setSelectedPlaceId(null)
  }

  // 축제 데이터 로드
  useEffect(() => {
    setLoading(true)
    fetch(`http://localhost:8080/api/festivals/${festivalId}`)
      .then(res => res.json())
      .then(data => setFestival(data))
      .catch(err => console.error('축제 API 에러:', err))
      .finally(() => setLoading(false))
  }, [festivalId])

  // FestivalNearbyMap에서 카카오 Places 검색 완료 시 카테고리별로 캐싱
  function handleNearbyLoad(category, places) {
    setNearbyPlaces(prev => ({ ...prev, [category]: places }))
  }

  if (loading) return <div className="festivalpage_loading">불러오는 중...</div>
  if (!festival) return <div className="festivalpage_loading">축제 정보를 찾을 수 없습니다.</div>

  return (
    <main className="festivalpage">
      <FestivalHero festival={festival} />

      <div className="festivalpage_body">
        {/* 카테고리 탭 */}
        <FestivalNearbyHeader
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* 지도(좌) + 목록(우) 2단 레이아웃 */}
        <div className="festivalpage_content">
          <FestivalNearbyMap
            festival={festival}
            activeCategory={activeCategory}
            activeSort={activeSort}
            nearbyPlaces={nearbyPlaces}
            onNearbyLoad={handleNearbyLoad}
            selectedPlaceId={selectedPlaceId}
            onSelectPlace={setSelectedPlaceId}
          />
          <FestivalNearbyList
            activeCategory={activeCategory}
            activeSort={activeSort}
            onSortChange={handleSortChange}
            places={nearbyPlaces[activeCategory] || []}
            selectedPlaceId={selectedPlaceId}
            onSelectPlace={setSelectedPlaceId}
          />
        </div>
      </div>
    </main>
  )
}

export default FestivalPage
