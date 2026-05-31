import './BuilderStepper.css'

// 단계 정의
const STEPS = [
  { id: 1, label: '축제'      },
  { id: 2, label: '맛집'      },
  { id: 3, label: '카페'      },
  { id: 4, label: '주차'      },
  { id: 5, label: 'AI 리포트' },
]

function BuilderStepper({ currentStep, selectedItems }) {
  return (
    <div className="builderstepper">
      {STEPS.map((step, index) => {
        const isDone    = currentStep > step.id   // 완료된 단계
        const isActive  = currentStep === step.id  // 현재 단계
        const isPending = currentStep < step.id    // 아직 안 된 단계

        return (
          <div key={step.id} className="builderstepper_item">

            {/* 스텝 버튼 */}
            <div className={`builderstepper_step ${isDone ? 'done' : ''} ${isActive ? 'active' : ''} ${isPending ? 'pending' : ''}`}>
              {/* 완료된 단계는 체크 표시 */}
              {isDone ? (
                <span className="builderstepper_check">✓</span>
              ) : (
                <span className="builderstepper_num">{step.id}</span>
              )}
              <span className="builderstepper_label">{step.label}</span>

              {/* 선택된 항목 표시 (완료된 단계) */}
              {/* TODO: API 연동 시 selectedItems[step.id] → 실제 선택 데이터로 교체 */}
              {isDone && selectedItems?.[step.id] && (
                <span className="builderstepper_selected">
                  {selectedItems[step.id]}
                </span>
              )}
            </div>

            {/* 화살표 (마지막 제외) */}
            {index < STEPS.length - 1 && (
              <span className="builderstepper_arrow">→</span>
            )}

          </div>
        )
      })}
    </div>
  )
}

export default BuilderStepper