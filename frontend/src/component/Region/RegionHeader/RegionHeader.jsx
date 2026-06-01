import { useParams } from 'react-router-dom'
import './RegionHeader.css'

// 지역 ID → 지역 정보 변환 테이블
// TODO: API 연동 시 fetch('/api/regions/:regionId')로 교체
const REGION_INFO = {
  seoul:     { nameKo: '서울',     nameEn: 'SEOUL',     desc: '서울 등 25개 자치구 안에서 사계절 내내 만날 수 있는 축제들을 모아봤어요.' },
  gyeonggi:  { nameKo: '경기',     nameEn: 'GYEONGGI',  desc: '경기 각 시·군 안에서 가을 시즌에만 만날 수 있는 축제들을 모아봤어요.' },
  incheon:   { nameKo: '인천',     nameEn: 'INCHEON',   desc: '인천 각 구·군 안에서 만날 수 있는 축제들을 모아봤어요.' },
  gangwon:   { nameKo: '강원',     nameEn: 'GANGWON',   desc: '강원 각 시·군 안에서 만날 수 있는 축제들을 모아봤어요.' },
  chungnam:  { nameKo: '충청남도', nameEn: 'CHUNGNAM',  desc: '충남 각 시·군 안에서 만날 수 있는 축제들을 모아봤어요.' },
  chungbuk:  { nameKo: '충청북도', nameEn: 'CHUNGBUK',  desc: '청주·충주·제천 등 12개 시·군 안에서 가을 시즌에만 만날 수 있는 축제들을 모아봤어요.' },
  daejeon:   { nameKo: '대전',     nameEn: 'DAEJEON',   desc: '대전 각 구 안에서 만날 수 있는 축제들을 모아봤어요.' },
  sejong:    { nameKo: '세종',     nameEn: 'SEJONG',    desc: '세종 안에서 만날 수 있는 축제들을 모아봤어요.' },
  jeonbuk:   { nameKo: '전북',     nameEn: 'JEONBUK',   desc: '전북 각 시·군 안에서 만날 수 있는 축제들을 모아봤어요.' },
  jeonnam:   { nameKo: '전남',     nameEn: 'JEONNAM',   desc: '전남 각 시·군 안에서 만날 수 있는 축제들을 모아봤어요.' },
  gwangju:   { nameKo: '광주',     nameEn: 'GWANGJU',   desc: '광주 각 구 안에서 만날 수 있는 축제들을 모아봤어요.' },
  gyeongbuk: { nameKo: '경북',     nameEn: 'GYEONGBUK', desc: '경북 각 시·군 안에서 만날 수 있는 축제들을 모아봤어요.' },
  gyeongnam: { nameKo: '경남',     nameEn: 'GYEONGNAM', desc: '경남 각 시·군 안에서 만날 수 있는 축제들을 모아봤어요.' },
  daegu:     { nameKo: '대구',     nameEn: 'DAEGU',     desc: '대구 각 구·군 안에서 만날 수 있는 축제들을 모아봤어요.' },
  ulsan:     { nameKo: '울산',     nameEn: 'ULSAN',     desc: '울산 각 구·군 안에서 만날 수 있는 축제들을 모아봤어요.' },
  busan:     { nameKo: '부산',     nameEn: 'BUSAN',     desc: '부산 각 구·군 안에서 만날 수 있는 축제들을 모아봤어요.' },
  jeju:      { nameKo: '제주',     nameEn: 'JEJU',      desc: '제주 안에서 만날 수 있는 축제들을 모아봤어요.' },
}

function RegionHeader({ festivalCount }) {
  const { regionId } = useParams()

  // TODO: API 연동 시 REGION_INFO → fetch 응답으로 교체
  const region = REGION_INFO[regionId] || {
    nameKo: regionId,
    nameEn: regionId.toUpperCase(),
    desc: '이 지역의 축제들을 모아봤어요.',
  }

  return (
    <div className="regionheader">

      {/* 왼쪽: 타이틀 영역 */}
      <div className="regionheader_left">
        <p className="regionheader_label">
          <span className="regionheader_label_line"></span>
          {region.nameEn} · KOREA
        </p>
        <h1 className="regionheader_title">
          {region.nameKo}, <span>{festivalCount}개 축제</span>가 열려요.
        </h1>
        <p className="regionheader_desc">{region.desc}</p>
      </div>


    </div>
  )
}

export default RegionHeader