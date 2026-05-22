import './CourseBuilder.css'

const DUMMY_STEPS = [
  { icon: '📅', text: '10월 17일 토요일', status: 'done' },
  { icon: '✦', text: '청주 음악 축제', status: 'done' },
  { icon: '🍴', text: '점심 장소 선택 중...', status: 'active' },
  { icon: '🅿', text: '주차장 추천 대기', status: 'waiting' },
]

function CourseBuilder() {
  return (
    <section className="coursebuilder">
      <div className="coursebuilder_left">
        <p className="coursebuilder_label">
          <span className="coursebuilder_label_line"></span>
          COURSE BUILDER · 직접 짜고 싶다면
        </p>
        <h2 className="coursebuilder_title">
          축제·맛집·카페·주차장,<br />
          <span>나만의 코스</span>로 엮어보세요.
        </h2>
        <p className="coursebuilder_desc">
          단계별로 장소를 선택하면 동선·시간·주차까지 자동으로 계산됩니다.
        </p>
        <button className="coursebuilder_btn">코스 빌더 시작하기 →</button>
      </div>
      <div className="coursebuilder_right">
        <p className="coursebuilder_step_label">STEP 2 / 4</p>
        <div className="coursebuilder_steps">
          {DUMMY_STEPS.map((step, index) => (
            <div key={index} className={`coursebuilder_step coursebuilder_step_${step.status}`}>
              <span className="coursebuilder_step_icon">{step.icon}</span>
              <span className="coursebuilder_step_text">{step.text}</span>
              {step.status === 'done' && <span className="coursebuilder_step_check">✓</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CourseBuilder