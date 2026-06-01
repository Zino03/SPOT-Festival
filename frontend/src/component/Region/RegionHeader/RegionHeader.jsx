// 지역 페이지 히어로 배너 내부 헤더 컴포넌트
// 지역명(한글/영문) + 축제 수 + 지역 소개 문구를 표시한다.
// festivalCount는 RegionFestivalList에서 데이터 로드 완료 후 RegionPage를 통해 전달된다.

import { useParams } from 'react-router-dom'
import { REGION_INFO } from '../../../utils/regions'
import './RegionHeader.css'

function RegionHeader({ festivalCount }) {
  const { regionId } = useParams()

  // 정의되지 않은 regionId 방어 처리
  const region = REGION_INFO[regionId] || {
    nameKo: regionId,
    nameEn: regionId.toUpperCase(),
    desc: '이 지역의 축제들을 모아봤어요.',
  }

  return (
    <div className="regionheader">
      <p className="regionheader_label">
        <span className="regionheader_label_line"></span>
        {region.nameEn} · KOREA
      </p>
      <h1 className="regionheader_title">
        {region.nameKo}, <span>{festivalCount}개 축제</span>가 열려요.
      </h1>
      <p className="regionheader_desc">{region.desc}</p>
    </div>
  )
}

export default RegionHeader
