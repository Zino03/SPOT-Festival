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

  function handleSelectCategory(category) {
    setActiveCategory(category)
    setSelectedPlaceId(null)
  }

  function handleSortChange(sort) {
    setActiveSort(sort)
    setNearbyPlaces({})
    setSelectedPlaceId(null)
  }

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
        <FestivalNearbyHeader
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
        />

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
