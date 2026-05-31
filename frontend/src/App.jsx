import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MapPage from './pages/MapPage'
import RegionPage from './pages/RegionPage'
import Header from './component/Common/Header/Header'
import FestivalPage from './pages/FestivalPage'
import SpotComparePage from './pages/SpotComparePage'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/region/:regionId" element={<RegionPage />} />
        <Route path="/festival/:festivalId" element={<FestivalPage />} />
        <Route path="/festival/:festivalId/compare" element={<SpotComparePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App