import { useState } from 'react'
import { useParams } from 'react-router-dom'
import './RegionMapViewer.css'

// 지역 ID → 한글명 변환
// TODO: API 연동 시 fetch로 교체
const REGION_NAMES = {
  seoul:     '서울',
  gyeonggi:  '경기',
  incheon:   '인천',
  gangwon:   '강원',
  chungnam:  '충남',
  chungbuk:  '충청북도',
  daejeon:   '대전',
  sejong:    '세종',
  jeonbuk:   '전북',
  jeonnam:   '전남',
  gwangju:   '광주',
  gyeongbuk: '경북',
  gyeongnam: '경남',
  daegu:     '대구',
  ulsan:     '울산',
  busan:     '부산',
  jeju:      '제주',
}

// 더미 시·군 데이터
// TODO: API 연동 시 fetch('/api/regions/:regionId/cities')로 교체
const DUMMY_CITIES = {
  chungbuk: [
    { id: 1, nameKo: '청주시',  nameEn: 'Cheongju',  festivalCount: 8  },
    { id: 2, nameKo: '충주시',  nameEn: 'Chungju',   festivalCount: 3  },
    { id: 3, nameKo: '제천시',  nameEn: 'Jecheon',   festivalCount: 2  },
    { id: 4, nameKo: '단양군',  nameEn: 'Danyang',   festivalCount: 1  },
    { id: 5, nameKo: '음성군',  nameEn: 'Eumseong',  festivalCount: 0  },
    { id: 6, nameKo: '진천군',  nameEn: 'Jincheon',  festivalCount: 0  },
    { id: 7, nameKo: '괴산군',  nameEn: 'Goesan',    festivalCount: 1  },
    { id: 8, nameKo: '보은군',  nameEn: 'Boeun',     festivalCount: 0  },
    { id: 9, nameKo: '옥천군',  nameEn: 'Okcheon',   festivalCount: 0  },
  ],
}

function RegionMapViewer({ onSelectCity }) {
  const { regionId } = useParams()
  const [selectedCity, setSelectedCity] = useState(null)

  const regionName = REGION_NAMES[regionId] || regionId
  const cities = DUMMY_CITIES[regionId] || []

  // 싱글 클릭 - 시·군 선택 (툴팁 표시)
  function handleClick(city) {
    setSelectedCity(city)
    if (onSelectCity) onSelectCity(city)
  }

  return (
    <div className="regionmapviewer">

      {/* 지도 헤더 */}
      <div className="regionmapviewer_header">
        <div>
          <p className="regionmapviewer_label">REGIONAL MAP</p>
          <p className="regionmapviewer_subtitle">{regionName} · 시·군 단위</p>
        </div>
        <div className="regionmapviewer_controls">
          <button>+</button>
          <button>−</button>
          <button>⊡</button>
        </div>
      </div>

      {/* TODO: 지도 API 연동 자리 */}
      {/* 지도 연동 시 아래 placeholder 제거 후 지도 컴포넌트 삽입 */}
      {/* 각 시·군 클릭 시 handleClick(city) 호출 */}
      <div className="regionmapviewer_placeholder">
        <p className="regionmapviewer_placeholder_icon">🗺️</p>
        <p className="regionmapviewer_placeholder_title">{regionName} 지도</p>
        <p className="regionmapviewer_placeholder_desc">지도 API 연동 예정</p>
      </div>

      {/* 선택된 시·군 툴팁 카드 */}
      {selectedCity && (
        <div className="regionmapviewer_tooltip">
          <p className="regionmapviewer_tooltip_label">FOCUSED</p>
          <h3 className="regionmapviewer_tooltip_name">
            {selectedCity.nameKo} · {selectedCity.nameEn}
          </h3>
          <p className="regionmapviewer_tooltip_desc">
            {selectedCity.festivalCount}개 축제 · 가장 축제가 많은 도시
          </p>
        </div>
      )}

    </div>
  )
}

export default RegionMapViewer