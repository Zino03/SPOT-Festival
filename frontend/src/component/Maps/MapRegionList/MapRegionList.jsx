import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchPhotos } from '../../../utils/unsplash'
import './MapRegionList.css'

const DUMMY_REGIONS = [
  { id: 1,  nameKo: '서울',  nameEn: 'Seoul',     regionId: 'seoul',     count: 38 },
  { id: 2,  nameKo: '경기',  nameEn: 'Gyeonggi',  regionId: 'gyeonggi',  count: 31 },
  { id: 3,  nameKo: '경북',  nameEn: 'Gyeongbuk', regionId: 'gyeongbuk', count: 24 },
  { id: 4,  nameKo: '경남',  nameEn: 'Gyeongnam', regionId: 'gyeongnam', count: 22 },
  { id: 5,  nameKo: '충북',  nameEn: 'Chungbuk',  regionId: 'chungbuk',  count: 21 },
  { id: 6,  nameKo: '전남',  nameEn: 'Jeonnam',   regionId: 'jeonnam',   count: 19 },
  { id: 7,  nameKo: '강원',  nameEn: 'Gangwon',   regionId: 'gangwon',   count: 18 },
  { id: 8,  nameKo: '부산',  nameEn: 'Busan',     regionId: 'busan',     count: 17 },
  { id: 9,  nameKo: '전북',  nameEn: 'Jeonbuk',   regionId: 'jeonbuk',   count: 16 },
  { id: 10, nameKo: '대구',  nameEn: 'Daegu',     regionId: 'daegu',     count: 15 },
  { id: 11, nameKo: '충남',  nameEn: 'Chungnam',  regionId: 'chungnam',  count: 14 },
  { id: 12, nameKo: '인천',  nameEn: 'Incheon',   regionId: 'incheon',   count: 12 },
  { id: 13, nameKo: '대전',  nameEn: 'Daejeon',   regionId: 'daejeon',   count: 9  },
  { id: 14, nameKo: '제주',  nameEn: 'Jeju',      regionId: 'jeju',      count: 8  },
  { id: 15, nameKo: '울산',  nameEn: 'Ulsan',     regionId: 'ulsan',     count: 6  },
  { id: 16, nameKo: '광주',  nameEn: 'Gwangju',   regionId: 'gwangju',   count: 7  },
  { id: 17, nameKo: '세종',  nameEn: 'Sejong',    regionId: 'sejong',    count: 4  },
]

function MapRegionList({ selectedRegion, onSelectRegion }) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [images, setImages] = useState({})

  useEffect(() => {
    // 17개를 1번 배치 요청으로 처리
    fetchPhotos('Korea landscape nature', DUMMY_REGIONS.length, 'squarish')
      .then(urls => {
        const map = {}
        DUMMY_REGIONS.forEach((r, i) => {
          if (urls[i]) map[r.regionId] = urls[i]
        })
        setImages(map)
      })
  }, [])

  const filtered = DUMMY_REGIONS.filter(r =>
    r.nameKo.includes(searchQuery) ||
    r.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="mapregionlist">

      {/* 헤더 */}
      <div className="mapregionlist_top">
        <div>
          <p className="mapregionlist_label">REGIONS</p>
          <p className="mapregionlist_title">17개 광역시·도</p>
        </div>
        <span className="mapregionlist_hint">클릭 → 선택 · 더블클릭 → 이동</span>
      </div>

      {/* 검색창 */}
      <div className="mapregionlist_search">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          placeholder="시·도 검색"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* 지역 목록 */}
      <ul className="mapregionlist_list">
        {filtered.map((region, idx) => (
          <li
            key={region.id}
            className={`mapregionlist_item ${selectedRegion?.id === region.id ? 'active' : ''}`}
            onClick={() => onSelectRegion(region)}
            onDoubleClick={() => navigate(`/region/${region.regionId}`)}
          >
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
            <div className="mapregionlist_right">
              <span className="mapregionlist_count">{region.count}</span>
              <span className="mapregionlist_count_label">개 축제</span>
            </div>
            <span className="mapregionlist_arrow">›</span>
          </li>
        ))}
      </ul>

    </div>
  )
}

export default MapRegionList
