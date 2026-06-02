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
  // ✨ 1. 동적 서브타이틀 (선택된 축제가 있으면 축제명, 없으면 기본 텍스트)
  const festivalName = selectedItems?.[1]?.name || 'AI 맞춤 코스';

  // ✨ 2. 동적 이동 거리 계산 (문자열에서 km, m를 파싱하여 meter 단위로 합산 후 다시 포맷팅)
  const totalDistanceMeters = Object.values(selectedItems || {}).reduce((acc, item) => {
    if (!item || !item.distance) return acc;
    const distStr = item.distance.toString();
    if (distStr.includes('km')) return acc + parseFloat(distStr) * 1000;
    return acc + parseFloat(distStr.replace(/[^0-9.]/g, ''));
  }, 0);

  const displayDistance = totalDistanceMeters > 0
    ? (totalDistanceMeters >= 1000 ? (totalDistanceMeters / 1000).toFixed(1) + 'km' : Math.round(totalDistanceMeters) + 'm')
    : '-';

  // ✨ 3. 동적 예상 시간 계산 (UX를 위해 그럴싸한 가중치 부여: 축제 3.5h, 식사 1.5h, 카페 1h 등)
  let estimatedHours = 0;
  if (selectedItems?.[1]) estimatedHours += 3.5;
  if (selectedItems?.[2]) estimatedHours += 1.5;
  if (selectedItems?.[3]) estimatedHours += 1.0;
  if (selectedItems?.[4]) estimatedHours += 0.5;

  const displayTime = estimatedHours > 0 ? `${estimatedHours}h` : '-';

  // ✨ 4. 진척도 계산 (0 ~ 4 사이로 고정)
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
          <strong>~ {displayTime}</strong>
        </div>
        <div className="builderreceipt_stat">
          <span>🚶 예상 이동</span>
          <strong>~ {displayDistance}</strong>
        </div>
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