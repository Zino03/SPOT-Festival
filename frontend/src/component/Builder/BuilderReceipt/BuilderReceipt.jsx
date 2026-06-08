import './BuilderReceipt.css'

// 단계 정의
const RECEIPT_STEPS = [
  { id: 1, label: '축제', icon: '🎪' },
  { id: 2, label: '맛집', icon: '🍴' },
  { id: 3, label: '카페', icon: '☕' },
  { id: 4, label: '주차장', icon: '🅿' },
  { id: 5, label: 'AI 리포트', icon: '✦' },
]

function BuilderReceipt({ currentStep, selectedItems}) {
  const festivalName = selectedItems?.[1]?.name || 'AI 맞춤 코스';

  // 진척도 계산 (0 ~ 4 사이로 고정)
  const progressCount = Math.min(Math.max(currentStep - 1, 0), 4);

  return (
    <div className="builderreceipt">

      {/* 영수증 헤더 */}
      <div className="builderreceipt_header">
        <span className="builderreceipt_icon">R</span>
        <div>
          <p className="builderreceipt_label">RECEIPT · 선행 영수증</p>
          <p className="builderreceipt_subtitle">spot.kr / builder / {festivalName}</p>
        </div>
      </div>

      {/* 단계별 선택 목록 */}
      <ul className="builderreceipt_list">
        {RECEIPT_STEPS.slice(0, 4).map(step => {
          const isDone = currentStep > step.id
          const isActive = currentStep === step.id
          const rawSelected = selectedItems?.[step.id];
          const selectedArray = Array.isArray(rawSelected) ? rawSelected : (rawSelected ? [rawSelected] : []);

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
                {selectedArray.map((item, index) => (
                  <div key={item.id || index} className="builderreceipt_selected">
                    <span>
                {step.id == 2 ? (index == 0 ? '☀️ 점심: ' : '🌙 저녁: ') : ''}
                {item.name}
              </span>
                    {item.distance && (
                      <span>{item.distance}</span>
                    )}
                    {item.walk && (
                      <span>· 도보 {item.walk}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* 완료 표시 */}
              {isDone && <span className="builderreceipt_check">•</span>}
              {isActive && <span className="builderreceipt_active_dot"></span>}
            </li>
          )
        })}
      </ul>

      <div className="builderreceipt_footer">
        <div className="builderreceipt_progress">
          <span>진척도</span>
          <div className="builderreceipt_progress_bar">
            <div
              className="builderreceipt_progress_fill"
              style={{ width: `${(progressCount / 4) * 100}%` }}
            />
          </div>
          <span>{progressCount} / 4</span>
        </div>
      </div>


    </div>
  )
}

export default BuilderReceipt