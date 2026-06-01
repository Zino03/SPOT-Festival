import './BuilderReceipt.css'

// 단계 정의
const RECEIPT_STEPS = [
  { id: 1, label: '축제',    icon: '🎪' },
  { id: 2, label: '맛집',    icon: '🍴' },
  { id: 3, label: '카페',    icon: '☕' },
  { id: 4, label: '주차장',  icon: '🅿' },
  { id: 5, label: 'AI 리포트', icon: '✦' },
]

function BuilderReceipt({ currentStep, selectedItems, estimatedTime, estimatedDistance }) {
  return (
    <div className="builderreceipt">

      {/* 영수증 헤더 */}
      <div className="builderreceipt_header">
        <span className="builderreceipt_icon">R</span>
        <div>
          <p className="builderreceipt_label">RECEIPT · 선행 영수증</p>
          {/* TODO: API 연동 시 축제명/지역 동적으로 교체 */}
          <p className="builderreceipt_subtitle">spot.kr / builder / 청주음악제</p>
        </div>
      </div>

      {/* 단계별 선택 목록 */}
      <ul className="builderreceipt_list">
        {RECEIPT_STEPS.slice(0, 4).map(step => {
          const isDone   = currentStep > step.id
          const isActive = currentStep === step.id
          // TODO: API 연동 시 selectedItems → 실제 선택 데이터로 교체
          const selected = selectedItems?.[step.id]

          return (
            <li
              key={step.id}
              className={`builderreceipt_item ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}
            >
              {/* 단계 번호 */}
              <span className="builderreceipt_num">
                {isDone ? '✓' : step.id}
              </span>

              {/* 단계 정보 */}
              <div className="builderreceipt_info">
                <strong>{step.label}</strong>
                {selected && (
                  <div className="builderreceipt_selected">
                    <span>{selected.name}</span>
                    {selected.distance && (
                      <span>{selected.distance}</span>
                    )}
                    {selected.walk && (
                      <span>· 도보 {selected.walk}</span>
                    )}
                  </div>
                )}
              </div>

              {/* 완료 표시 */}
              {isDone && <span className="builderreceipt_check">•</span>}
              {isActive && <span className="builderreceipt_active_dot"></span>}
            </li>
          )
        })}
      </ul>

      {/* 예상 정보 */}
      <div className="builderreceipt_footer">
        <div className="builderreceipt_stat">
          <span>⏱ 예상 시간</span>
          {/* TODO: API 연동 시 estimatedTime → 실제 데이터로 교체 */}
          <strong>~ {estimatedTime || '7h'}</strong>
        </div>
        <div className="builderreceipt_stat">
          <span>🚶 예상 이동</span>
          {/* TODO: API 연동 시 estimatedDistance → 실제 데이터로 교체 */}
          <strong>~ {estimatedDistance || '3km'}</strong>
        </div>
        <div className="builderreceipt_progress">
          <span>진척도</span>
          <div className="builderreceipt_progress_bar">
            <div
              className="builderreceipt_progress_fill"
              style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
            />
          </div>
          <span>{currentStep - 1} / 4</span>
        </div>
      </div>


    </div>
  )
}

export default BuilderReceipt