import { useNavigate, useParams } from 'react-router-dom'
import './SpotPath.css'

// 지역 ID → 한글명 변환
// TODO: API 연동 시 fetch로 교체
const REGION_NAMES = {
  seoul:     '서울',
  gyeonggi:  '경기',
  incheon:   '인천',
  gangwon:   '강원',
  chungnam:  '충남',
  chungbuk:  '충북 청주시',
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

// 더미 축제명
// TODO: API 연동 시 fetch('/api/festivals/:festivalId')로 교체
const DUMMY_FESTIVAL_NAMES = {
  1: '청주시 음악 축제',
  2: '진주 남강 유등축제',
}

function SpotPath() {
  const navigate = useNavigate()
  const { festivalId, regionId } = useParams()

  // TODO: API 연동 시 동적으로 교체
  const regionName = REGION_NAMES[regionId] || '충북 청주시'
  const festivalName = DUMMY_FESTIVAL_NAMES[festivalId] || '축제'

  return (
    <nav className="spotpath">
      {/* 홈 */}
      <span className="spotpath_link" onClick={() => navigate('/')}>홈</span>
      <span className="spotpath_separator">›</span>
      {/* 지역 */}
      <span className="spotpath_link" onClick={() => navigate(`/region/${regionId}`)}>
        {regionName}
      </span>
      <span className="spotpath_separator">›</span>
      {/* 축제 */}
      <span className="spotpath_link" onClick={() => navigate(`/festival/${festivalId}`)}>
        {festivalName}
      </span>
      <span className="spotpath_separator">›</span>
      {/* 현재 페이지 */}
      <span className="spotpath_current">주변 비교</span>
    </nav>
  )
}

export default SpotPath