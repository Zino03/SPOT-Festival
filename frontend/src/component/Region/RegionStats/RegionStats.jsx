import './RegionStats.css'

// TODO: API 연동 시 fetch('/api/regions/:regionId/stats')로 교체
function RegionStats({ stats }) {
  const data = {
    festivalCount: stats?.festivalCount ?? '-',
    festivalLabel: '등록된 축제',
    cityCount: 12,
    cityLabel: '전 지역',
    avgRating: stats?.avgRating ?? '-',
    ratingMax: 5.0,
    liveCount: stats?.liveCount ?? '-',
    liveLabel: '지금 열린 행사',
  }

  return (
    <div className="regionstats">

      {/* 축제 수 */}
      <div className="regionstats_item">
        <span className="regionstats_icon">✦</span>
        <div className="regionstats_text">
          <div className="regionstats_info">
            <strong>{data.festivalCount}</strong>
            <span>{data.festivalLabel}</span>
          </div>
          <p className="regionstats_label">축제</p>
        </div>
      </div>

      <div className="regionstats_divider"></div>

      {/* 시·군 수 */}
      <div className="regionstats_item">
        <span className="regionstats_icon">📍</span>
        <div className="regionstats_text">
          <div className="regionstats_info">
            <strong>{data.cityCount}</strong>
            <span>{data.cityLabel}</span>
          </div>
          <p className="regionstats_label">시·군 수</p>
        </div>
      </div>

      <div className="regionstats_divider"></div>

      {/* 평균 평점 */}
      <div className="regionstats_item">
        <span className="regionstats_icon">⭐</span>
        <div className="regionstats_text">
          <div className="regionstats_info">
            <strong>{data.avgRating}</strong>
            <span>/ {data.ratingMax}</span>
          </div>
          <p className="regionstats_label">평균 평점</p>
        </div>
      </div>

      <div className="regionstats_divider"></div>

      {/* 라이브 진행 */}
      <div className="regionstats_item">
        <span className="regionstats_icon">🕐</span>
        <div className="regionstats_text">
          <div className="regionstats_info">
            <strong>{data.liveCount}</strong>
            <span>{data.liveLabel}</span>
          </div>
          <p className="regionstats_label">라이브 진행</p>
        </div>
      </div>

    </div>
  )
}

export default RegionStats