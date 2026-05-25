import './MapHeader.css'
 
// TODO: API 연동 시 fetch('/api/stats')로 교체
const DUMMY_STATS = {
  total: 247,
  live: 27,
  thisWeek: 64,
}
 
function MapHeader() {
  return (
    <div className="mapheader">
 
      {/* 왼쪽 타이틀 */}
      <div className="mapheader_left">
        <h1 className="mapheader_title">
          한국 어디든, <span>한 번의 클릭으로.</span>
        </h1>
        <p className="mapheader_desc">
          지도 위 광역시·도를 선택하면 시·군·구 단위로 들어갈 수 있어요.
        </p>
      </div>
 
      {/* 오른쪽 통계 */}
      {/* TODO: API 연동 시 DUMMY_STATS → fetch 응답으로 교체 */}
      <div className="mapheader_stats">
        <div className="mapheader_stat mapheader_stat_active">
          <span className="mapheader_stat_label">전국</span>
          <strong>{DUMMY_STATS.total}</strong>
        </div>
        <div className="mapheader_stat">
          <span className="mapheader_stat_label">라이브</span>
          <strong>{DUMMY_STATS.live}</strong>
        </div>
        <div className="mapheader_stat">
          <span className="mapheader_stat_label">이번 주</span>
          <strong>{DUMMY_STATS.thisWeek}</strong>
        </div>
      </div>
 
    </div>
  )
}
 
export default MapHeader