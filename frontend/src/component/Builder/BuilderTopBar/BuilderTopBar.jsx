import { useNavigate } from 'react-router-dom'
import './BuilderTopBar.css'

function BuilderTopBar({ currentStep }) {
  const navigate = useNavigate()

  // 현재 URL 경로 표시
  const stepLabel = currentStep ? `step-${currentStep}` : 'step-1'

  return (
    <div className="buildertopbar">

      {/* 왼쪽: 현재 경로 */}
      <div className="buildertopbar_path">
        <span className="buildertopbar_dot red"></span>
        <span className="buildertopbar_dot yellow"></span>
        <span className="buildertopbar_dot green"></span>
        <span className="buildertopbar_url">
          spot.kr / builder / {stepLabel}
        </span>
      </div>

      {/* 오른쪽: 새 코스 버튼 — /builder로 이동하면 상태가 초기화됨 */}
      <button
        className="buildertopbar_btn"
        onClick={() => navigate('/builder')}
      >
        + 새 코스
      </button>

    </div>
  )
}

export default BuilderTopBar