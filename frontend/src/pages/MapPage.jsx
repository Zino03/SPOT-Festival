import { useState } from 'react'
import MapPath from '../component/Maps/MapPath/MapPath'
import MapHeader from '../component/Maps/MapHeader/MapHeader'
import MapViewer from '../component/Maps/MapViewer/MapViewer'
import MapRegionList from '../component/Maps/MapRegionList/MapRegionList'
import MapGuide from '../component/Maps/MapGuide/MapGuide'
import './MapPage.css'

function MapPage() {
  const [selectedRegion, setSelectedRegion] = useState(null)

  return (
    <main className="mappage">
      <MapPath />
      <MapHeader />
      <div className="mappage_content">
        <MapViewer
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
        />
        <MapRegionList
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
        />
      </div>
      <MapGuide />
    </main>
  )
}

export default MapPage