import './RegionGrid.css'
import { useNavigate } from 'react-router-dom'

// 더미 데이터 (나중에 API로 교체 필요시)
// TODO: API 연동 시 fetch('/api/regions')로 교체
// 이후 이미지 추가 필요
const REGIONS = [
  { id: 1, nameKo: '서울', nameEn: 'SEOUL',    count: 28, image: '' },
  { id: 2, nameKo: '경기', nameEn: 'GYEONGGI', count: 21, image: '' },
  { id: 3, nameKo: '강원', nameEn: 'GANGWON',  count: 13, image: '' },
  { id: 4, nameKo: '충북', nameEn: 'CHUNGBUK', count: 21, image: '' },
  { id: 5, nameKo: '전남', nameEn: 'JEONNAM',  count: 19, image: '' },
  { id: 6, nameKo: '경북', nameEn: 'GYEONGBUK',count: 24, image: '' },
  { id: 7, nameKo: '부산', nameEn: 'BUSAN',    count: 17, image: '' },
  { id: 8, nameKo: '제주', nameEn: 'JEJU',     count: 8,  image: '' },
]

function RegionGrid() {
  const navigate = useNavigate()

  return (
    <section className="regiongrid">

      {/* 상단 헤더 */}
      <div className="regiongrid_header">
        <p className="regiongrid_label">
          <span className="regiongrid_label_line"></span>
          EXPLORE BY REGION
          <span className="regiongrid_label_line"></span>
        </p>
        <h2 className="regiongrid_title">지역으로 들어가기.</h2>
        <p className="regiongrid_desc">
          17개 광역시도, 어디든 선택하면 그 지역의 축제·핫스팟·주차 정보가 한눈에 펼쳐집니다.
        </p>
      </div>

      {/* 카드 그리드 */}
      <div className="regiongrid_grid">
        {REGIONS.map(region => (
          <div
            key={region.id}
            className="regiongrid_card"
            // TODO: 배경 이미지 생기면 아래 style 주석 해제
            // style={{ backgroundImage: `url(${region.image})` }}
          >
            {/* 축제 개수 뱃지 */}
            <span className="regiongrid_badge">{region.count}개</span>

            {/* 카드 하단 정보 */}
            <div className="regiongrid_card_bottom">
              <div>
                <p className="regiongrid_name_en">{region.nameEn}</p>
                <p className="regiongrid_name_ko">{region.nameKo}</p>
              </div>
              {/* 카드 화살표 버튼 - 각 지역 페이지로 이동 */}
              <button className="regiongrid_arrow" onClick={() => navigate(`/region/${region.nameEn.toLowerCase()}`)}>
                →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 하단 바 */}
      <div className="regiongrid_footer">
        <p>📍 전국 17개 광역시도를 모두 — 인터랙티브 전국 지도로 들어가 보세요.</p>
        {/* 전국 지도 열기 버튼 - 지도 페이지로 이동 */}
        <button className="regiongrid_map_btn" onClick={() => navigate('/map')}>
          전국 지도 열기 →
        </button>
      </div>

    </section>
  )
}

export default RegionGrid