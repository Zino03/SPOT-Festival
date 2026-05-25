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

  return (
    <main className="regionpage">
      <RegionPath />
      <RegionHeader festivalCount={4} />
      <RegionStats />
      <div className="regionpage_content">
        <RegionMapViewer onSelectCity={setSelectedCity} />
        <RegionFestivalList />
      </div>
    </main>
  )
}

export default RegionPage