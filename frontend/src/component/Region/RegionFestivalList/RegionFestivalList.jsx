import { useNavigate, useParams } from 'react-router-dom'
import './RegionFestivalList.css'

// 더미 축제 데이터
// TODO: API 연동 시 fetch('/api/regions/:regionId/festivals')로 교체
const DUMMY_FESTIVALS = {
  chungbuk: [
    {
      id: 1,
      name: '청주 음악 축제',
      category: '음악',
      rating: 4.6,
      start_date: '2026-10-17',
      end_date: '2026-10-29',
      address: '청주시 서원구 삼남로 69번길 12',
      image: '',
      isLive: true,
    },
    {
      id: 2,
      name: '단양 소백산 철쭉제',
      category: '꽃·계절',
      rating: 4.8,
      start_date: '2026-10-22',
      end_date: '2026-10-26',
      address: '단양군 단성면 천동지 산96',
      image: '',
      isLive: false,
    },
    {
      id: 3,
      name: '충주 세계무술축제',
      category: '전통',
      rating: 4.5,
      start_date: '2026-09-30',
      end_date: '2026-10-04',
      address: '충주시 호암벌레지 1',
      image: '',
      isLive: false,
    },
    {
      id: 4,
      name: '제천 한방바이오축제',
      category: '푸드',
      rating: 4.4,
      start_date: '2026-10-11',
      end_date: '2026-10-17',
      address: '제천시 현암억스포공원',
      image: '',
      isLive: false,
    },
  ],
}

// 오늘 날짜 기준 isLive 자동 계산
function calcIsLive(festivals) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return festivals.map(f => ({
    ...f,
    isLive: new Date(f.start_date) <= today && today <= new Date(f.end_date),
  }))
}

function RegionFestivalList({ festivalCount }) {
  const navigate = useNavigate()
  const { regionId } = useParams()

  // TODO: API 연동 시 DUMMY_FESTIVALS → fetch 응답으로 교체
  const rawFestivals = DUMMY_FESTIVALS[regionId] || []
  const festivals = calcIsLive(rawFestivals)

  return (
    <div className="regionfestivallist">

      {/* 리스트 헤더 */}
      <div className="regionfestivallist_header">
        <p className="regionfestivallist_title">
          {/* TODO: API 연동 시 지역명 동적으로 변경 */}
          이 지역에서 열리는 <span>{festivals.length}개 축제</span>
        </p>
        <span className="regionfestivallist_sort">최근 등록순</span>
      </div>

      {/* 축제 카드 목록 */}
      <ul className="regionfestivallist_list">
        {festivals.map(festival => (
          <li
            key={festival.id}
            className={`regionfestivallist_item ${festival.isLive ? 'live' : ''}`}
            // TODO: 축제 상세 페이지 생성 후 경로 수정
            // onClick={() => navigate(`/festival/${festival.id}`)}
          >
            {/* 축제 이미지 */}
            <div
              className="regionfestivallist_image"
              // TODO: 이미지 생기면 아래 style 주석 해제
              // style={{ backgroundImage: `url(${festival.image})` }}
            >
              {festival.isLive && (
                <span className="regionfestivallist_live_badge">LIVE</span>
              )}
            </div>

            {/* 축제 정보 */}
            <div className="regionfestivallist_info">
              <div className="regionfestivallist_meta">
                <span className="regionfestivallist_category">{festival.category}</span>
                <span className="regionfestivallist_rating">★ {festival.rating}</span>
              </div>
              <h3 className="regionfestivallist_name">{festival.name}</h3>
              <p className="regionfestivallist_date">
                📅 {festival.start_date.slice(5).replace('-', '/')} ~ {festival.end_date.slice(5).replace('-', '/')}
              </p>
              <p className="regionfestivallist_address">📍 {festival.address}</p>
            </div>

            {/* 화살표 */}
            <button className="regionfestivallist_arrow">›</button>
          </li>
        ))}
      </ul>

      {/* 하단 버튼 */}
      <div className="regionfestivallist_footer">
        <button className="regionfestivallist_btn_list">리스트로 정렬</button>
        <button className="regionfestivallist_btn_map">지도로 비교 →</button>
      </div>

    </div>
  )
}

export default RegionFestivalList