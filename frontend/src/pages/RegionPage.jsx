import { useState } from 'react'
import { useParams } from 'react-router-dom'
import RegionPath from '../component/Region/RegionPath/RegionPath'
import RegionHeader from '../component/Region/RegionHeader/RegionHeader'
import RegionStats from '../component/Region/RegionStats/RegionStats'
import RegionMapViewer from '../component/Region/RegionMapViewer/RegionMapViewer'
import RegionFestivalList from '../component/Region/RegionFestivalList/RegionFestivalList'
import './RegionPage.css'

function RegionPage() {
  const [selectedCity, setSelectedCity] = useState(null)
  const [festivalCount, setFestivalCount] = useState(0)

  return (
    <main className="regionpage">
      <RegionPath />
      <RegionHeader festivalCount={festivalCount} />
      <RegionStats />
      <div className="regionpage_content">
        <RegionMapViewer onSelectCity={setSelectedCity} />
        <RegionFestivalList onFestivalCountChange={setFestivalCount} />
      </div>
    </main>
  )
}

export default RegionPage