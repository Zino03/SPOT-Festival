import { useState } from 'react'
import { useParams } from 'react-router-dom'
import SpotPath from '../component/SpotComparePage/SpotPath/SpotPath'
import SpotHeader from '../component/SpotComparePage/SpotHeader/SpotHeader'
import SpotFilter from '../component/SpotComparePage/SpotFilter/SpotFilter'
import SpotBest from '../component/SpotComparePage/SpotBest/SpotBest'
import SpotGrid from '../component/SpotComparePage/SpotGrid/SpotGrid'
import './SpotComparePage.css'

function SpotComparePage() {
  const [activeCategory, setActiveCategory] = useState('parking')

  return (
    <main className="spotcomparepage">
      <SpotPath />
      <SpotHeader
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />
      <SpotFilter />
      <SpotBest activeCategory={activeCategory} />
      <SpotGrid activeCategory={activeCategory} />
    </main>
  )
}

export default SpotComparePage