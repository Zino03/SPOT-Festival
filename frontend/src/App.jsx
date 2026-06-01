import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MapPage from './pages/MapPage'
import RegionPage from './pages/RegionPage'
import Header from './component/Common/Header/Header'
import FestivalPage from './pages/FestivalPage'
import BuilderPage from './pages/BuilderPage'
import AboutPage from './pages/AboutPage'

// Header는 모든 페이지에 고정, Routes로 페이지별 컴포넌트 렌더링
function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/region/:regionId" element={<RegionPage />} />
        <Route path="/festival/:festivalId" element={<FestivalPage />} />
        <Route path="/builder" element={<BuilderPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
