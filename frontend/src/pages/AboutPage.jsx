import { useNavigate } from 'react-router-dom'
import './AboutPage.css'

const GUIDE_STEPS = [
  { num: '01', icon: '🗺️', title: '지도에서 지역 선택', desc: '전국 지도에서 원하는 광역시·도 핀을 클릭하면 해당 지역 페이지로 이동합니다.' },
  { num: '02', icon: '🎪', title: '지역별 축제 탐색',   desc: '지역 페이지에서 진행 중이거나 예정된 축제 목록을 지도와 리스트로 확인합니다.' },
  { num: '03', icon: '📍', title: '축제 상세 확인',     desc: '축제를 클릭하면 위치, 날짜, 주변 식당·카페·주차장 정보를 한눈에 볼 수 있습니다.' },
  { num: '04', icon: '✦',  title: 'AI 코스 빌더',      desc: '축제·맛집·카페·주차장을 단계별로 고르면 Gemini AI가 최적 하루 코스를 생성합니다.' },
]

const TECH_STACK = [
  { category: 'Frontend',  items: ['React', 'React Router', 'Vite'] },
  { category: 'Backend',   items: ['Spring Boot 3', 'JPA / MySQL'] },
  { category: 'Maps & AI', items: ['Kakao Maps SDK', 'Kakao Places API', 'Google Gemini API'] },
  { category: 'Images',    items: ['Unsplash API'] },
  { category: 'Data',      items: ['공공데이터포털 문화축제 API'] },
]

function AboutPage() {
  const navigate = useNavigate()

  return (
    <main className="aboutpage">

      {/* 히어로 */}
      <div className="aboutpage_hero">
        <div className="aboutpage_hero_inner">
          <p className="aboutpage_hero_label">SPOT · FESTIVAL · KOREA 2026</p>
          <h1 className="aboutpage_hero_title">
            전국 축제를<br />한눈에, 스마트하게.
          </h1>
          <p className="aboutpage_hero_desc">
            지도 위에서 축제를 탐색하고, AI가 당신만의 하루 코스를 설계합니다.
          </p>
          <button className="aboutpage_hero_btn" onClick={() => navigate('/')}>
            지금 시작하기 →
          </button>
        </div>
      </div>

      <div className="aboutpage_body">

        {/* 사용 가이드 */}
        <section className="aboutpage_section">
          <p className="aboutpage_section_label">HOW TO USE</p>
          <h2 className="aboutpage_section_title">이렇게 사용하세요</h2>
          <div className="aboutpage_guide_grid">
            {GUIDE_STEPS.map(step => (
              <div key={step.num} className="aboutpage_guide_card">
                <div className="aboutpage_guide_num">{step.num}</div>
                <div className="aboutpage_guide_icon">{step.icon}</div>
                <h3 className="aboutpage_guide_title">{step.title}</h3>
                <p className="aboutpage_guide_desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 기술 스택 */}
        <section className="aboutpage_section">
          <p className="aboutpage_section_label">TECH STACK</p>
          <h2 className="aboutpage_section_title">사용 기술</h2>
          <div className="aboutpage_tech_grid">
            {TECH_STACK.map(({ category, items }) => (
              <div key={category} className="aboutpage_tech_card">
                <p className="aboutpage_tech_category">{category}</p>
                <div className="aboutpage_tech_items">
                  {items.map(item => (
                    <span key={item} className="aboutpage_tech_item">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 데이터 출처 */}
        <section className="aboutpage_section aboutpage_section_dark">
          <p className="aboutpage_section_label">DATA SOURCE</p>
          <h2 className="aboutpage_section_title">데이터 출처</h2>
          <p className="aboutpage_data_desc">
            축제 정보는 <strong>공공데이터포털</strong>의 문화관광축제 공공데이터를 기반으로 합니다.
            지도 및 주변 장소 데이터는 <strong>카카오맵 API</strong>를 활용합니다.
            일부 데이터는 실시간으로 업데이트되지 않을 수 있습니다.
          </p>
        </section>

      </div>
    </main>
  )
}

export default AboutPage
