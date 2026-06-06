// 축제 상세 페이지 히어로 컴포넌트
// 축제 배경 이미지 + LIVE 뱃지 + 축제명/날짜/주소/조회수 + "코스에 추가" 버튼 구성

// 배경 이미지는 festival.id를 FESTIVAL_QUERIES 배열 길이로 나눈 나머지로 쿼리를 선택
// 같은 축제는 항상 같은 분위기의 이미지를 사용한다.
// "코스에 추가" 클릭 시 선택된 축제 정보를 state로 빌더 페이지에 전달한다.

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchPhoto } from '../../../utils/unsplash'
import './FestivalHero.css'

// 축제 id 기반으로 순환 선택되는 배경 이미지 검색 쿼리
const FESTIVAL_QUERIES = [
  'Korean outdoor festival night lantern',
  'Korea traditional festival crowd colorful',
  'Korea summer festival fireworks celebration',
  'Korea spring cherry blossom festival street',
  'Korea autumn harvest festival cultural',
]

function FestivalHero({ festival }) {
  const navigate = useNavigate()
  const [heroBg, setHeroBg] = useState('')

  // festival.id % 쿼리 수 로 항상 같은 이미지 분위기를 유지
  useEffect(() => {
    const query = FESTIVAL_QUERIES[festival.id % FESTIVAL_QUERIES.length]
    fetchPhoto(query).then(url => { if (url) setHeroBg(url) })
  }, [festival.id])

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const isLive = new Date(festival.startDate) <= today && today <= new Date(festival.endDate)

  const startDate = festival.startDate?.slice(5).replace('-', '/')
  const endDate = festival.endDate?.slice(5).replace('-', '/')

  // 빌더 페이지로 이동하면서 현재 축제를 Step 1 선택 상태로 전달
  function handleAddToCourse() {
    navigate('/builder', {
      state: {
        preselectedFestival: {
          id: festival.id,
          name: festival.name,
          category: festival.region,
          lat: festival.lat,
          lng: festival.lng,
          date: `${startDate} ~ ${endDate}`,
          isAI: false,
        },
        // 빌더 Step 0에서 읽을 수 있도록 지역 문자열(예: '충북 청주시')을 추가 전달
        preselectedRegion: festival.region
      }
    })
  }

  return (
    <div className="festivalhero">
      <div
        className="festivalhero_bg"
        style={heroBg ? { backgroundImage: `url(${heroBg})` } : {}}
      >
        <div className="festivalhero_info">
          <div className="festivalhero_badges">
            {isLive && <span className="festivalhero_badge_live">● LIVE NOW</span>}
            <span className="festivalhero_badge_category">{festival.region}</span>
          </div>

          <h1 className="festivalhero_title">{festival.name}</h1>

          <div className="festivalhero_meta">
            <div className="festivalhero_meta_left">
              <span>📅 {startDate} ~ {endDate}</span>
              <span>📍 {festival.address}</span>
              <span>👁 {festival.viewCount?.toLocaleString()}</span>
            </div>
            <div className="festivalhero_meta_right">
              <button className="festivalhero_btn_course" onClick={handleAddToCourse}>
                코스에 추가 →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FestivalHero
