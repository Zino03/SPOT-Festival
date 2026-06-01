import { useNavigate, useParams } from 'react-router-dom'
import { REGION_NAMES } from '../../../utils/regions'
import './RegionPath.css'

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