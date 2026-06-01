import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import FestivalBack from '../component/Festival/FestivalBack/FestivalBack'
import FestivalHero from '../component/Festival/FestivalHero/FestivalHero'
import FestivalNearbyHeader from '../component/Festival/FestivalNearbyHeader/FestivalNearbyHeader'
import FestivalNearbyMap from '../component/Festival/FestivalNearbyMap/FestivalNearbyMap'
import FestivalNearbyList from '../component/Festival/FestivalNearbyList/FestivalNearbyList'
import './FestivalPage.css'

function FestivalPage() {
  const { festivalId } = useParams()
  const [festival, setFestival]     = useState(null)
  const [parkings, setParkings]     = useState([])
  const [nearbyPlaces, setNearbyPlaces] = useState({}) // { restaurant: [], cafe: [] }
  const [loading, setLoading]       = useState(true)
  const [activeCategory, setActiveCategory] = useState('parking')

  useEffect(() => {
    setLoading(true)
    fetch(`http://localhost:8080/api/festivals/${festivalId}`)
      .then(res => res.json())
      .then(data => {
        setFestival(data)
        return fetch(`http://localhost:8080/api/parking/nearby?lat=${data.lat}&lng=${data.lng}`)
      })
      .then(res => res.json())
      .then(data => setParkings(data || []))
      .catch(err => console.error('축제 API 에러:', err))
      .finally(() => setLoading(false))
  }, [festivalId])

  function handleNearbyLoad(category, places) {
    setNearbyPlaces(prev => ({ ...prev, [category]: places }))
  }

  if (loading) return <div className="festivalpage_loading">불러오는 중...</div>
  if (!festival) return <div className="festivalpage_loading">축제 정보를 찾을 수 없습니다.</div>

  const currentPlaces = activeCategory === 'parking'
    ? parkings
    : (nearbyPlaces[activeCategory] || [])

  return (
    <main className="festivalpage">
      <FestivalBack />
      <FestivalHero festival={festival} />
      <div className="festivalpage_body">
      <FestivalNearbyHeader
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />
      <div className="festivalpage_content">
        <FestivalNearbyMap
          festival={festival}
          activeCategory={activeCategory}
          parkings={parkings}
          nearbyPlaces={nearbyPlaces}
          onNearbyLoad={handleNearbyLoad}
        />
        <FestivalNearbyList
          activeCategory={activeCategory}
          places={currentPlaces}
        />
      </div>
      </div>
    </main>
  )
}

export default FestivalPage
