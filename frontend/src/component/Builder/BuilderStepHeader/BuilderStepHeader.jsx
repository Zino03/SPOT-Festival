import { useState } from 'react'
import './BuilderStepHeader.css'

// 단계별 타이틀
const STEP_TITLES = {
  1: '축제를 골라요.',
  2: '맛집을 골라요.',
  3: '카페를 골라요.',
  4: '주차장을 골라요.',
}

// 단계별 더미 필터
// TODO: API 연동 시 fetch('/api/builder/filters?step=2')로 교체
const STEP_FILTERS = {
  1: [],
  2: ['한식', '분식', '양식', '디저트', '+필터'],
  3: ['카페', '베이커리', '디저트', '음료', '+필터'],
  4: ['무료', '유료', '실내', '실외', '+필터'],
}

function BuilderStepHeader({ currentStep, totalCount, preferences, festival }) {
  const [activeFilter, setActiveFilter] = useState('전체')
  const filters = STEP_FILTERS[currentStep] || []
  //현재 단계와 넘어온 데이터에 따라 부제목을 동적으로 생성하는 함수
  const getDynamicSubtitle = () => {
    if (currentStep === 1) {
      // 1단계: 유저가 셋업에서 입력한 데이터 조합 (예: "서울/경기 · 7/3 · 친구들과 함께")
      if (!preferences || !preferences.region) return 'AI 맞춤 축제 분석 중...';

      // 날짜 포맷팅 (2026-07-03 -> 7/3)
      const dateObj = preferences.date ? new Date(preferences.date) : null;
      const dateStr = dateObj ? `${dateObj.getMonth() + 1}/${dateObj.getDate()}` : '';

      return `${preferences.region} · ${dateStr} · ${preferences.companion} 함께`;
    } else {
      // 2~4단계: 1단계에서 선택한 축제 이름을 기반으로 표시
      const festivalName = festival?.name || '선택된 축제';
      return `${festivalName} 반경 1.5km · 카카오 로컬 데이터`;
    }
  }
  return (
    <div className="builderstepheader">

      {/* 타이틀 + 부제목 */}
      <div className="builderstepheader_top">
        <div className="builderstepheader_left">
          <h2 className="builderstepheader_title">
            {STEP_TITLES[currentStep]}
          </h2>
          <p className="builderstepheader_subtitle">
            {/* TODO: API 연동 시 STEP_SUBTITLES → 동적 데이터로 교체 */}
            {getDynamicSubtitle()}
            {totalCount && (
              <span className="builderstepheader_count"> · {totalCount}개 후보</span>
            )}
          </p>
        </div>

        {/* 필터 탭 */}
        {filters.length > 0 && (
        <div className="builderstepheader_filters">
          {filters.map(filter => (
            <button
              key={filter}
              className={`builderstepheader_filter ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        )}
      </div>

    </div>
  )
}

export default BuilderStepHeader