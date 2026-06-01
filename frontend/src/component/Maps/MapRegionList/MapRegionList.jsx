// 전국 지도 페이지 우측 지역 목록 컴포넌트
// 17개 광역시,도를 실제 축제 수 기준 내림차순으로 정렬
// 썸네일 이미지는 17개를 1번의 Unsplash 배치 요청으로
// 클릭 시 해당 지역 페이지(/region/:regionId)로 이동

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchPhotos } from '../../../utils/unsplash'
import './MapRegionList.css'

// 17개 광역시·도 메타 정보 (순서는 초기값, 실제 렌더링은 축제 수 기준 정렬)
const REGION_META = [
  { id: 1, nameKo: '서울', nameEn: 'Seoul', regionId: 'seoul' },
  { id: 2, nameKo: '경기', nameEn: 'Gyeonggi', regionId: 'gyeonggi' },
  { id: 3, nameKo: '경북', nameEn: 'Gyeongbuk', regionId: 'gyeongbuk' },
  { id: 4, nameKo: '경남', nameEn: 'Gyeongnam', regionId: 'gyeongnam' },
  { id: 5, nameKo: '충북', nameEn: 'Chungbuk', regionId: 'chungbuk' },
  { id: 6, nameKo: '전남', nameEn: 'Jeonnam', regionId: 'jeonnam' },
  { id: 7, nameKo: '강원', nameEn: 'Gangwon', regionId: 'gangwon' },
  { id: 8, nameKo: '부산', nameEn: 'Busan', regionId: 'busan' },
  { id: 9, nameKo: '전북', nameEn: 'Jeonbuk', regionId: 'jeonbuk' },
  { id: 10, nameKo: '대구', nameEn: 'Daegu', regionId: 'daegu' },
  { id: 11, nameKo: '충남', nameEn: 'Chungnam', regionId: 'chungnam' },
  { id: 12, nameKo: '인천', nameEn: 'Incheon', regionId: 'incheon' },
  { id: 13, nameKo: '대전', nameEn: 'Daejeon', regionId: 'daejeon' },
  { id: 14, nameKo: '제주', nameEn: 'Jeju', regionId: 'jeju' },
  { id: 15, nameKo: '울산', nameEn: 'Ulsan', regionId: 'ulsan' },
  { id: 16, nameKo: '광주', nameEn: 'Gwangju', regionId: 'gwangju' },
  { id: 17, nameKo: '세종', nameEn: 'Sejong', regionId: 'sejong' },
]

function MapRegionList() {
  const navigate = useNavigate()
  const [counts, setCounts] = useState({}) // { regionId: 축제 수 }
  const [images, setImages] = useState({}) // { regionId: 이미지 URL }

  // 지역별 실제 축제 수
  useEffect(() => {
    fetch('http://localhost:8080/api/festivals/region-counts')
      .then(r => r.json())
      .then(data => {
        const map = {}
        data.forEach(item => { map[item.regionId] = item.count })
        setCounts(map)
      })
      .catch(err => console.error('region-counts 에러:', err))
  }, [])

  // 17개 썸네일 이미지를 1번의 배치 요청으로 처리
  useEffect(() => {
    fetchPhotos('Korea landscape nature', REGION_META.length, 'squarish')
      .then(urls => {
        const map = {}
        REGION_META.forEach((r, i) => { if (urls[i]) map[r.regionId] = urls[i] })
        setImages(map)
      })
  }, [])

  // 축제 수 내림차순 정렬 (counts 로드 전에는 원래 순서 유지)
  const sorted = [...REGION_META].sort(
    (a, b) => (counts[b.regionId] ?? 0) - (counts[a.regionId] ?? 0)
  )

  return (
    <div className="mapregionlist">

      <div className="mapregionlist_top">
        <div>
          <p className="mapregionlist_label">REGIONS</p>
          <p className="mapregionlist_title">17개 광역시·도</p>
        </div>
        <span className="mapregionlist_hint">클릭하면 지역 페이지로 이동</span>
      </div>

      <ul className="mapregionlist_list">
        {sorted.map((region, idx) => (
          <li
            key={region.id}
            className="mapregionlist_item"
            onClick={() => navigate(`/region/${region.regionId}`)}
          >
            {/* 순위 번호가 표시되는 썸네일 */}
            <div
              className="mapregionlist_thumb"
              style={{ backgroundImage: `url(${images[region.regionId] || `https://picsum.photos/seed/region-${region.regionId}/80/80`})` }}
            >
              <span className="mapregionlist_rank">{String(idx + 1).padStart(2, '0')}</span>
            </div>
            <div className="mapregionlist_info">
              <strong className="mapregionlist_name_ko">{region.nameKo}</strong>
              <span className="mapregionlist_name_en">{region.nameEn}</span>
            </div>
            <span className="mapregionlist_count">
              {counts[region.regionId] ?? '—'}개
            </span>
            <span className="mapregionlist_arrow">›</span>
          </li>
        ))}
      </ul>

    </div>
  )
}

export default MapRegionList
