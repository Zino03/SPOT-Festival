import { useNavigate } from 'react-router-dom'
import './MapGuide.css'

const GUIDE_STEPS = [
  {
    num: '01',
    title: '지도에서 광역시·도 선택',
    desc: '한국 지도에서 원하는 지역을 클릭',
  },
  {
    num: '02',
    title: '지역별 축제 리스트 확인',
    desc: '해당 지역에서 열리는 축제를 한눈에 탐색',
  },
  {
    num: '03',
    title: '주변 축제·핫플 탐색',
    desc: '지도와 리스트로 동시에 비교',
  },
]

function MapGuide() {
  const navigate = useNavigate()
  return (
    <div className="mapguide">

      {/* 왼쪽: 제목 */}
      <div className="mapguide_header">
        <p className="mapguide_label">HOW TO NAVIGATE</p>
        <h2 className="mapguide_title">이렇게 사용해보세요</h2>
      </div>

      {/* 가운데: 단계 */}
      <div className="mapguide_steps">
        {GUIDE_STEPS.map(step => (
          <div key={step.num} className="mapguide_step">
            <span className="mapguide_num">{step.num}</span>
            <strong className="mapguide_step_title">{step.title}</strong>
            <p className="mapguide_step_desc">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* 오른쪽: 버튼 */}
      <button className="mapguide_btn" onClick={() => navigate('/about')}>가이드 더보기 →</button>

    </div>
  )
}

export default MapGuide