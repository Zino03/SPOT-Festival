import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Calendar.css'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']
const MONTH_NAMES = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']

function toDateStr(date) {
  return date.toISOString().split('T')[0] // YYYY-MM-DD
}

function Calendar() {
  const navigate = useNavigate()
  const todayRaw = new Date()
  todayRaw.setHours(0, 0, 0, 0)

  const [viewYear, setViewYear] = useState(todayRaw.getFullYear())
  const [viewMonth, setViewMonth] = useState(todayRaw.getMonth())
  const [selectedDate, setSelectedDate] = useState(todayRaw)
  const [festivals, setFestivals] = useState([])
  const [loading, setLoading] = useState(true)

  function fetchForDate(date) {
    setLoading(true)
    fetch(`http://localhost:8080/api/festivals/calendar?date=${toDateStr(date)}`)
      .then(r => r.json())
      .then(data => setFestivals(data))
      .catch(() => setFestivals([]))
      .finally(() => setLoading(false))
  }

  // 마운트 시 오늘 날짜 축제 로드
  useEffect(() => { fetchForDate(todayRaw) }, [])


  function handleDateClick(date) {
    setSelectedDate(date)
    fetchForDate(date)
  }

  function goToPrev() {
    const newMonth = viewMonth === 0 ? 11 : viewMonth - 1
    const newYear = viewMonth === 0 ? viewYear - 1 : viewYear
    setViewMonth(newMonth)
    setViewYear(newYear)
    const first = new Date(newYear, newMonth, 1)
    setSelectedDate(first)
    fetchForDate(first)
  }

  function goToNext() {
    const newMonth = viewMonth === 11 ? 0 : viewMonth + 1
    const newYear = viewMonth === 11 ? viewYear + 1 : viewYear
    setViewMonth(newMonth)
    setViewYear(newYear)
    const first = new Date(newYear, newMonth, 1)
    setSelectedDate(first)
    fetchForDate(first)
  }

  // 6행 × 7열 캘린더 셀 생성
  function buildCells() {
    const firstDow = new Date(viewYear, viewMonth, 1).getDay()
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    const daysInPrev = new Date(viewYear, viewMonth, 0).getDate()
    const cells = []

    for (let i = firstDow - 1; i >= 0; i--)
      cells.push({ date: new Date(viewYear, viewMonth - 1, daysInPrev - i), current: false })
    for (let d = 1; d <= daysInMonth; d++)
      cells.push({ date: new Date(viewYear, viewMonth, d), current: true })
    while (cells.length < 42)
      cells.push({ date: new Date(viewYear, viewMonth + 1, cells.length - firstDow - daysInMonth + 1), current: false })

    return cells
  }

  function isToday(date) { return date.getTime() === todayRaw.getTime() }
  function isSelected(date) {
    const sel = new Date(selectedDate)
    sel.setHours(0, 0, 0, 0)
    return date.getTime() === sel.getTime()
  }
  function isLive(f) {
    const start = new Date(f.startDate); start.setHours(0, 0, 0, 0)
    const end = new Date(f.endDate); end.setHours(0, 0, 0, 0)
    return start <= todayRaw && todayRaw <= end
  }

  const cells = buildCells()
  const selLabel = `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일`

  return (
    <section className="cal_section">
      <div className="cal_inner">

        {/* 섹션 헤더 */}
        <div className="cal_head">
          <p className="cal_label">
            <span className="cal_label_line" />
            FESTIVAL CALENDAR · 축제 캘린더
          </p>
          <h2 className="cal_title">날짜를 클릭해 <span>축제</span>를 확인하세요.</h2>
        </div>

        <div className="cal_body">

          {/* 캘린더 그리드 */}
          <div className="cal_grid_wrap">

            {/* 월 네비게이션 */}
            <div className="cal_nav">
              <button className="cal_nav_btn" onClick={goToPrev}>‹</button>
              <span className="cal_nav_label">{viewYear}년 {MONTH_NAMES[viewMonth]}</span>
              <button className="cal_nav_btn" onClick={goToNext}>›</button>
            </div>

            {/* 요일 헤더 */}
            <div className="cal_weekdays">
              {WEEKDAYS.map((d, i) => (
                <span key={d} className={`cal_weekday${i === 0 ? ' sun' : i === 6 ? ' sat' : ''}`}>{d}</span>
              ))}
            </div>

            {/* 날짜 셀 */}
            <div className="cal_days">
              {cells.map((cell, i) => {
                const cls = [
                  'cal_day',
                  !cell.current && 'other',
                  isToday(cell.date) && 'today',
                  isSelected(cell.date) && 'selected',
                ].filter(Boolean).join(' ')

                return (
                  <div
                    key={i}
                    className={cls}
                    onClick={() => cell.current && handleDateClick(cell.date)}
                  >
                    <span className="cal_day_num">{cell.date.getDate()}</span>
                  </div>
                )
              })}
            </div>

            {/* 범례 */}
            <div className="cal_legend">
              <span className="cal_legend_today">● 오늘</span>
              <span className="cal_legend_tip">날짜 클릭 시 해당일 축제 표시</span>
            </div>
          </div>

          {/* 사이드 패널 */}
          <div className="cal_sidebar">
            <div className="cal_sidebar_head">
              <p className="cal_sidebar_date">{selLabel}</p>
              <p className="cal_sidebar_count">
                {loading ? '불러오는 중...' : festivals.length > 0
                  ? `${festivals.length}개 축제 진행 중`
                  : '진행 중인 축제 없음'}
              </p>
            </div>

            {loading ? (
              <div className="cal_empty">
                <div className="cal_spinner" />
              </div>
            ) : festivals.length === 0 ? (
              <div className="cal_empty">
                <span className="cal_empty_icon">📅</span>
                <p>이 날짜에는 진행 중인<br />축제가 없어요.</p>
              </div>
            ) : (
              <ul className="cal_list">
                {festivals.map(f => (
                  <li
                    key={f.id}
                    className="cal_item"
                    onClick={() => navigate(`/festival/${f.id}`)}
                  >
                    <div className="cal_item_top">
                      {isLive(f) && <span className="cal_item_live">● LIVE</span>}
                      <span className="cal_item_region">{f.region}</span>
                    </div>
                    <strong className="cal_item_name">{f.name}</strong>
                    <span className="cal_item_date">
                      {f.startDate?.slice(5).replace('-', '/')} ~ {f.endDate?.slice(5).replace('-', '/')}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}

export default Calendar
