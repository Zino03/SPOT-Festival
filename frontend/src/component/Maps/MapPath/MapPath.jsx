import { useNavigate } from 'react-router-dom'
import './MapPath.css'
 
function MapPath() {
  const navigate = useNavigate()
 
  return (
    <nav className="mappath">
      {/* 홈 클릭 시 홈페이지로 이동 */}
      <span
        className="mappath_home"
        onClick={() => navigate('/')}
      >
        홈
      </span>
      <span className="mappath_separator">›</span>
      {/* 현재 페이지 (클릭 안 됨) */}
      <span className="mappath_current">전국 지도</span>
    </nav>
  )
}
 
export default MapPath
 