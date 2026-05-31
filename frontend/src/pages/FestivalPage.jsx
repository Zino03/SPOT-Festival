import { useState } from 'react'
import FestivalBack from '../component/Festival/FestivalBack/FestivalBack'
import FestivalHero from '../component/Festival/FestivalHero/FestivalHero'
import FestivalNearbyHeader from '../component/Festival/FestivalNearbyHeader/FestivalNearbyHeader'
import FestivalNearbyMap from '../component/Festival/FestivalNearbyMap/FestivalNearbyMap'
import FestivalNearbyList from '../component/Festival/FestivalNearbyList/FestivalNearbyList'
import './FestivalPage.css'

function FestivalPage() {
  const [activeCategory, setActiveCategory] = useState('restaurant')

  return (
    <main className="festivalpage">
      <FestivalBack />
      <FestivalHero />
      <FestivalNearbyHeader
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />
      <div className="festivalpage_content">
        <FestivalNearbyMap
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
        <FestivalNearbyList activeCategory={activeCategory} />
      </div>
    </main>
  )
}

export default FestivalPage