import './BuilderHeader.css'

function BuilderHeader() {
  return (
    <div className="builderheader">
      <p className="builderheader_label">
        <span className="builderheader_label_line"></span>
        STEP BY STEP · 단계별 코스 설계
      </p>
      <h1 className="builderheader_title">
        AI가 추천하고, <span>당신이 고르는</span> 하루.
      </h1>
      <p className="builderheader_desc">
        지역과 축제부터 식사에 식사·휴식·주차까지 — AI 추천을 한 단계씩 골라가며 나만의 코스를 완성하세요.
      </p>
    </div>
  )
}

export default BuilderHeader