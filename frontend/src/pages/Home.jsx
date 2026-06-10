import HeroBanner from '../component/Home/HeroBanner/HeroBanner'
import Calendar from '../component/Home/Calendar/Calendar'
import DayTrip from '../component/Home/DayTrip/DayTrip'
import RegionGrid from '../component/Home/RegionGrid/RegionGrid'

function Home() {
  return (
    <main>
      <HeroBanner />
      <Calendar />
      <DayTrip />
      <RegionGrid />
    </main>
  )
}

export default Home
