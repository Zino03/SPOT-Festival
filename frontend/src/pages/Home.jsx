import HeroBanner from '../component/Home/HeroBanner/HeroBanner'
import DayTrip from '../component/Home/DayTrip/DayTrip'
import CourseBuilder from '../component/Home/CourseBuilder/CourseBuilder'
import RegionGrid from '../component/Home/RegionGrid/RegionGrid'
import Trending from '../component/Home/Trending/Trending'

function Home() {        
  return (
    <main>
      <HeroBanner />
      <DayTrip />
      <CourseBuilder />
      <RegionGrid />
      <Trending />
    </main>
  )
}

export default App       