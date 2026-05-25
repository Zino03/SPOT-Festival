import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './MapRegionList.css'

// TODO: API 연동 시 fetch('/api/regions')로 교체
const DUMMY_REGIONS = [
  { id: 1,  rank: '01', nameKo: '서울',  nameEn: 'SEOUL',     count: 38 },
  { id: 2,  rank: '02', nameKo: '경기',  nameEn: 'GYEONGGI',  count: 31 },
  { id: 3,  rank: '03', nameKo: '인천',  nameEn: 'INCHEON',   count: 12 },
  { id: 4,  rank: '04', nameKo: '강원',  nameEn: 'GANGWON',   count: 18 },
  { id: 5,  rank: '05', nameKo: '충남',  nameEn: 'CHUNGNAM',  count: 14 },
  { id: 6,  rank: '06', nameKo: '충북',  nameEn: 'CHUNGBUK',  count: 21 },
  { id: 7,  rank: '07', nameKo: '대전',  nameEn: 'DAEJEON',   count: 9  },
  { id: 8,  rank: '08', nameKo: '세종',  nameEn: 'SEJONG',    count: 4  },
  { id: 9,  rank: '09', nameKo: '전북',  nameEn: 'JEONBUK',   count: 16 },
  { id: 10, rank: '10', nameKo: '전남',  nameEn: 'JEONNAM',   count: 19 },
  { id: 11, rank: '11', nameKo: '광주',  nameEn: 'GWANGJU',   count: 7  },
  { id: 12, rank: '12', nameKo: '경북',  nameEn: 'GYEONGBUK', count: 24 },
  { id: 13, rank: '13', nameKo: '경남',  nameEn: 'GYEONGNAM', count: 22 },
  { id: 14, rank: '14', nameKo: '대구',  nameEn: 'DAEGU',     count: 15 },
  { id: 15, rank: '15', nameKo: '울산',  nameEn: 'ULSAN',     count: 6  },
  { id: 16, rank: '16', nameKo: '부산',  nameEn: 'BUSAN',     count: 17 },
  { id: 17, rank: '17', nameKo: '제주',  nameEn: 'JEJU',      count: 8  },
]

function MapRegionList({ selectedRegion, onSelectRegion }) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  // 검색어로 필터링
  const filtered = DUMMY_REGIONS.filter(region =>
    region.nameKo.includes(searchQuery) ||
    region.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // 싱글 클릭 - 지역 선택 (지도 툴팁 연동)
  function handleClick(region) {
    onSelectRegion(region)
  }

  // 더블 클릭 - 도별 지도 페이지로 이동
  function handleDoubleClick(region) {
    // TODO: 도별 지도 페이지 생성 후 아래 경로 수정
    navigate(`/region/${region.nameEn.toLowerCase()}`)
    console.log(`${region.nameKo} 도별 지도로 이동 예정`)
  }

  return (
    <div className="mapregionlist">

      {/* 검색창 */}
      <div className="mapregionlist_search">
        <span>🔍</span>
        <input
          type="text"
          placeholder="시·도 또는 시·군·구 검색"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* 리스트 헤더 */}
      <div className="mapregionlist_header">
        <span>17개 광역시·도</span>
        <span>축제 많은순</span>
      </div>

      {/* 지역 목록 */}
      {/* TODO: API 연동 시 DUMMY_REGIONS → fetch 응답으로 교체 */}
      <ul className="mapregionlist_list">
        {filtered.map(region => (
          <li
            key={region.id}
            className={`mapregionlist_item ${selectedRegion?.id === region.id ? 'active' : ''}`}
            onClick={() => handleClick(region)}
            onDoubleClick={() => handleDoubleClick(region)}
          >
            <span className="mapregionlist_rank">{region.rank}</span>
            <div className="mapregionlist_name">
              <strong>{region.nameKo}</strong>
              <span>{region.nameEn}</span>
            </div>
            <span className="mapregionlist_count">{region.count} festivals</span>
            <span className="mapregionlist_arrow">›</span>
          </li>
        ))}
      </ul>

    </div>
  )
}

export default MapRegionList