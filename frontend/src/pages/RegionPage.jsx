import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import RegionPath from '../component/Region/RegionPath/RegionPath'
import RegionHeader from '../component/Region/RegionHeader/RegionHeader'
import RegionMapViewer from '../component/Region/RegionMapViewer/RegionMapViewer'
import RegionFestivalList from '../component/Region/RegionFestivalList/RegionFestivalList'
import { fetchPhoto, REGION_QUERY } from '../utils/unsplash'
import './RegionPage.css'

function RegionPage() {
  const { regionId } = useParams()
  const [festivalCount, setFestivalCount] = useState(0)
  // 초기값으로 picsum 폴백 이미지를 사용하고, Unsplash 로드 완료 시 교체한다.
  const [heroBg, setHeroBg] = useState(`https://picsum.photos/seed/${regionId}-hero/1400/480`)

  useEffect(() => {
    const query = REGION_QUERY[regionId] ?? `${regionId} Korea`
    fetchPhoto(query).then(url => { if (url) setHeroBg(url) })
  }, [regionId])

  return (
    <main className="regionpage">

      <div
        className="regionpage_hero"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="regionpage_hero_overlay">
          <div className="regionpage_hero_inner">
            <RegionPath />
            <RegionHeader festivalCount={festivalCount} />
          </div>
        </div>
      </div>

      <div className="regionpage_body">
        <div className="regionpage_content">
          <RegionMapViewer />
          <RegionFestivalList onFestivalCountChange={setFestivalCount} />
        </div>
      </div>

    </main>
  )
}

export default RegionPage
