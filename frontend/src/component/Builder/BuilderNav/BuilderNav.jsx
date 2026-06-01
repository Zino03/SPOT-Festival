import './BuilderNav.css'

// 단계별 라벨
const STEP_LABELS = {
  1: '축제',
  2: '맛집',
  3: '카페',
  4: '주차장',
  5: 'AI 리포트',
}

function BuilderNav({ currentStep, totalSteps = 5, selectedItem, onPrev, onNext }) {
  const isFirst = currentStep === 1
  const isLast = currentStep === totalSteps - 1 // 4단계가 마지막 선택 단계

  return (
    <div className="buildernav">

      {/* 이전 단계 버튼 */}
      <button
        className="buildernav_btn_prev"
        onClick={onPrev}
        disabled={isFirst}
      >
        ← 이전 · {STEP_LABELS[currentStep - 1] || ''}
      </button>

      {/* 현재 선택 상태 */}
      <div className="buildernav_status">
        <span className="buildernav_step">{currentStep} / {totalSteps - 1}</span>
        {/* TODO: API 연동 시 selectedItem → 실제 선택 데이터로 교체 */}
        {selectedItem && (
          <span className="buildernav_selected">
            선택됨 · {selectedItem.name}
          </span>
        )}
      </div>

      {/* 다음 단계 버튼 */}
      <button
        className="buildernav_btn_next"
        onClick={onNext}
        disabled={!selectedItem} // 선택 안 하면 비활성화
      >
        {isLast ? 'AI 리포트 보기' : `다음 · ${STEP_LABELS[currentStep + 1]}`} →
      </button>

    </div>
  )
}

export default BuilderNav