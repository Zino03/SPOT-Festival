// 지역 페이지 (/region/:regionId)
// 히어로 배너 + 브레드크럼(RegionPath) + 지역 헤더(RegionHeader)
// + 카카오 지도(RegionMapViewer) + 축제 목록(RegionFestivalList) 구성

// RegionFestivalList에서 축제 수를 받아 RegionHeader에 전달
// 히어로 배경은 REGION_QUERY 키워드로 Unsplash에서 받아오며, 실패 시 picsum 폴백을 사용

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

  // regionId가 바뀔 때마다 해당 지역 키워드로 히어로 이미지를 새로 받아온다.
  useEffect(() => {
    const query = REGION_QUERY[regionId] ?? `${regionId} Korea`
    fetchPhoto(query).then(url => { if (url) setHeroBg(url) })
  }, [regionId])

  return (
    <main className="regionpage">

      {/* 히어로 배너 — 브레드크럼 + 지역 타이틀 */}
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

      {/* 본문 — 지도(왼쪽) + 축제 목록(오른쪽) 2단 레이아웃 */}
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
