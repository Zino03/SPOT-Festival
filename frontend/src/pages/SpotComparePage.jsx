import { useState } from 'react'
import { useParams } from 'react-router-dom'
import SpotPath from '../component/SpotCompare/SpotPath/SpotPath'
import SpotHeader from '../component/SpotCompare/SpotHeader/SpotHeader'
import SpotFilter from '../component/SpotCompare/SpotFilter/SpotFilter'
import SpotBest from '../component/SpotCompare/SpotBest/SpotBest'
import SpotGrid from '../component/SpotCompare/SpotGrid/SpotGrid'
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