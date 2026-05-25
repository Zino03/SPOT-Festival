import { useNavigate } from 'react-router-dom'
import './MapViewer.css'

function MapViewer({ selectedRegion, onSelectRegion }) {
  const navigate = useNavigate()

  // 싱글 클릭 - 지역 선택 (툴팁 표시)
  function handleClick(region) {
    onSelectRegion(region)
  }

  // 더블 클릭 - 도별 지도 페이지로 이동
  function handleDoubleClick(region) {
    // TODO: 도별 지도 페이지 생성 후 아래 경로 수정
    // navigate(`/map/${region.nameEn.toLowerCase()}`)
    console.log(`${region.nameKo} 도별 지도로 이동 예정`)
  }

  return (
    <div className="mapviewer">

      {/* 지도 헤더 */}
      <div className="mapviewer_header">
        <div className="mapviewer_header_left">
          <p className="mapviewer_label">INTERACTIVE MAP</p>
          <p className="mapviewer_subtitle">대한민국 · 광역시·도 단위</p>
        </div>
        <div className="mapviewer_controls">
          <button title="확대">+</button>
          <button title="축소">−</button>
          <button title="전체보기">⊡</button>
        </div>
      </div>

      {/* 카카오맵 연동 전 플레이스홀더 */}
      <div className="mapviewer_placeholder">
        <p className="mapviewer_placeholder_icon">🗺️</p>
        <p className="mapviewer_placeholder_title">카카오맵 연동 준비 중</p>
        <p className="mapviewer_placeholder_desc">지도 API 연동 예정</p>
      </div>

      {/* 선택된 지역 툴팁 카드 (싱글 클릭 시 표시) */}
      {selectedRegion && (
        <div
          className="mapviewer_tooltip"
          onDoubleClick={() => handleDoubleClick(selectedRegion)}
        >
          <p className="mapviewer_tooltip_label">CURRENT · 현재 보고 있는 지역</p>
          <h3 className="mapviewer_tooltip_name">{selectedRegion.nameKo}</h3>
          <p className="mapviewer_tooltip_count">{selectedRegion.count}개 축제 진행중</p>
          <p className="mapviewer_tooltip_hint">더블 클릭으로 도별 지도 보기</p>
        </div>
      )}

      {/* 범례 */}
      <div className="mapviewer_legend">
        <span><i className="mapviewer_legend_dot default"></i>일반 지역</span>
        <span><i className="mapviewer_legend_dot selected"></i>선택 지역</span>
        <span><i className="mapviewer_legend_dot live"></i>라이브 축제</span>
      </div>

    </div>
  )
}

export default MapViewer