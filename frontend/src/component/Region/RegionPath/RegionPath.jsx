// 지역 페이지 브레드크럼 컴포넌트
// 홈 › 전국 지도 › 현재 지역 순으로 표시하며, 홈/지도는 클릭 시 이동

import { useNavigate, useParams } from 'react-router-dom'
import { REGION_NAMES } from '../../../utils/regions'
import './RegionPath.css'

function RegionPath() {
  const navigate = useNavigate()
  const { regionId } = useParams()

  const regionName = REGION_NAMES[regionId] || regionId

  return (
    <nav className="regionpath">
      <span className="regionpath_link" onClick={() => navigate('/')}>홈</span>
      <span className="regionpath_separator">›</span>
      <span className="regionpath_link" onClick={() => navigate('/map')}>전국 지도</span>
      <span className="regionpath_separator">›</span>
      {/* 현재 페이지 — 클릭 불가 */}
      <span className="regionpath_current">{regionName}</span>
    </nav>
  )
}

export default RegionPath
