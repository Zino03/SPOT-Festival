import { useNavigate } from 'react-router-dom'
import './BuilderPath.css'

// 단계별 라벨
const STEP_LABELS = {
  1: 'step 1·축제',
  2: 'step 2·맛집',
  3: 'step 3·카페',
  4: 'step 4·주차장',
  5: 'step 5·AI 리포트',
}

function BuilderPath({ currentStep }) {
  const navigate = useNavigate()

  return (
    <nav className="builderpath">
      {/* 홈 */}
      <span className="builderpath_link" onClick={() => navigate('/')}>홈</span>
      <span className="builderpath_separator">›</span>
      {/* AI 코스 빌더 */}
      <span className="builderpath_link" onClick={() => navigate('/builder')}>
        AI 코스 빌더
      </span>
      <span className="builderpath_separator">›</span>
      {/* 현재 단계 */}
      <span className="builderpath_current">
        {STEP_LABELS[currentStep] || 'step 1·축제'}
      </span>
    </nav>
  )
}

export default BuilderPath