import { useNavigate, useParams } from 'react-router-dom'
import './RegionPath.css'

// 지역 ID → 한글명 변환 테이블
// TODO: API 연동 시 fetch로 지역명 받아오는 방식으로 교체 가능
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

function RegionPath() {
  const navigate = useNavigate()
  const { regionId } = useParams()

  const regionName = REGION_NAMES[regionId] || regionId

  return (
    <nav className="regionpath">
      {/* 홈으로 이동 */}
      <span
        className="regionpath_link"
        onClick={() => navigate('/')}
      >
        홈
      </span>
      <span className="regionpath_separator">›</span>
      {/* 전국 지도로 이동 */}
      <span
        className="regionpath_link"
        onClick={() => navigate('/map')}
      >
        전국 지도
      </span>
      <span className="regionpath_separator">›</span>
      {/* 현재 페이지 (클릭 안 됨) */}
      <span className="regionpath_current">{regionName}</span>
    </nav>
  )
}

export default RegionPath