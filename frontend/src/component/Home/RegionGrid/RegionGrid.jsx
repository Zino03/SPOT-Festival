// 홈 지역 그리드 섹션
// 8개 대표 지역을 카드 형태로 보여주며, 클릭 시 해당 지역 페이지 이동
// 각 카드 이미지는 8개를 1번의 Unsplash 배치 요청으로 받아오고, 실패 시 picsum 폴백을 사용

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchPhotos } from '../../../utils/unsplash'
import './RegionGrid.css'

// 홈에서 노출할 8개 대표 지역 (전체 17개 중 선별)
const REGIONS = [
  { id: 1, nameKo: '서울', nameEn: 'SEOUL', regionId: 'seoul'},
  { id: 2, nameKo: '경기', nameEn: 'GYEONGGI', regionId: 'gyeonggi'},
  { id: 3, nameKo: '강원', nameEn: 'GANGWON', regionId: 'gangwon'},
  { id: 4, nameKo: '충북', nameEn: 'CHUNGBUK', regionId: 'chungbuk'},
  { id: 5, nameKo: '전남', nameEn: 'JEONNAM', regionId: 'jeonnam'},
  { id: 6, nameKo: '경북', nameEn: 'GYEONGBUK', regionId: 'gyeongbuk'},
  { id: 7, nameKo: '부산', nameEn: 'BUSAN', regionId: 'busan'},
  { id: 8, nameKo: '제주', nameEn: 'JEJU', regionId: 'jeju'},
]

// Unsplash 실패 시 사용할 picsum 시드값
const FALLBACK_SEED = {
  seoul: 'seoul-city', gyeonggi: 'gyeonggi-nature', gangwon: 'gangwon-mountain',
  chungbuk: 'chungbuk-festival', jeonnam: 'jeonnam-village', gyeongbuk: 'gyeongbuk-heritage',
  busan: 'busan-ocean', jeju: 'jeju-island',
}

// 개별 지역 카드 — RegionGrid 안에서만 사용하는 서브컴포넌트
function RegionCard({ region, count, imageUrl, onClick }) {
  const bg = imageUrl || `https://picsum.photos/seed/${FALLBACK_SEED[region.regionId]}/400/533`

  return (
    <div
      className="regiongrid_card"
      style={{ backgroundImage: `url(${bg})` }}
      onClick={onClick}
    >
      {/* 우측 상단 축제 수 뱃지 */}
      <span className="regiongrid_badge">
        {count !== undefined ? `${count}개` : '—'}
      </span>

      <div className="regiongrid_card_bottom">
        <div>
          <p className="regiongrid_name_en">{region.nameEn}</p>
          <p className="regiongrid_name_ko">{region.nameKo}</p>
        </div>
        {/* 카드 전체도 클릭 가능하므로 이벤트 버블링을 막고 같은 동작 수행 */}
        <button
          className="regiongrid_arrow"
          onClick={e => { e.stopPropagation(); onClick() }}
        >
          →
        </button>
      </div>
    </div>
  )
}

function RegionGrid() {
  const navigate = useNavigate()
  const [counts, setCounts] = useState({}) // { regionId: 축제 수 }
  const [images, setImages] = useState({}) // { regionId: 이미지 URL }

  // 지역별 실제 축제 수
  useEffect(() => {
    fetch('http://localhost:8080/api/festivals/region-counts')
      .then(res => res.json())
      .then(data => {
        const map = {}
        data.forEach(item => { map[item.regionId] = item.count })
        setCounts(map)
      })
      .catch(err => console.error('region-counts API 에러:', err))
  }, [])

  // 8개 카드 이미지를 1번의 배치 요청으로 처리
  useEffect(() => {
    fetchPhotos('Korea festival nature landscape', REGIONS.length, 'portrait')
      .then(urls => {
        const map = {}
        REGIONS.forEach((r, i) => {
          if (urls[i]) map[r.regionId] = urls[i]
        })
        setImages(map)
      })
  }, [])

  return (
    <section className="regiongrid">

      <div className="regiongrid_header">
        <p className="regiongrid_label">
          <span className="regiongrid_label_line"></span>
          EXPLORE BY REGION
          <span className="regiongrid_label_line"></span>
        </p>
        <h2 className="regiongrid_title">지역으로 들어가기.</h2>
        <p className="regiongrid_desc">
          17개 광역시도, 어디든 선택하면 그 지역의 축제·핫스팟·주차 정보가 한눈에 펼쳐집니다.
        </p>
      </div>

      <div className="regiongrid_grid">
        {REGIONS.map(region => (
          <RegionCard
            key={region.id}
            region={region}
            count={counts[region.regionId]}
            imageUrl={images[region.regionId]}
            onClick={() => navigate(`/region/${region.regionId}`)}
          />
        ))}
      </div>

      {/* 하단 전국 지도 바로가기 */}
      <div className="regiongrid_footer">
        <p>📍 전국 17개 광역시도를 모두 — 인터랙티브 전국 지도로 들어가 보세요.</p>
        <button className="regiongrid_map_btn" onClick={() => navigate('/map')}>
          전국 지도 열기 →
        </button>
      </div>

    </section>
  )
}

export default RegionGrid
