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

// 단계별 더미 부제목
// TODO: API 연동 시 선택된 축제/지역 기반으로 동적 교체
const STEP_SUBTITLES = {
  1: '현재 위치 기준 · 진행 중인 축제',
  2: '청주 음악제 반경 1.5km · 카카오 로컬 데이터',
  3: '청주 음악제 반경 1.5km · 카카오 로컬 데이터',
  4: '청주 음악제 반경 1.5km · 카카오 로컬 데이터',
}

function BuilderStepHeader({ currentStep, totalCount }) {
  const [activeFilter, setActiveFilter] = useState('전체')
  const filters = STEP_FILTERS[currentStep] || []

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
            {STEP_SUBTITLES[currentStep]}
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