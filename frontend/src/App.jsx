import Header from './component/Header/Header'
import HeroBanner from './component/HeroBanner/HeroBanner'
import DayTrip from './component/DayTrip/DayTrip'
import CourseBuilder from './component/CourseBuilder/CourseBuilder'
import RegionGrid from './component/RegionGrid/RegionGrid'
import Trending from './component/Trending/Trending'

function App() {
  return (
    <>
      <Header />
      <main>
        <HeroBanner />
        <DayTrip />
        <CourseBuilder />
        <RegionGrid />
        <Trending />
      </main>
    </>
  )
}

export default App