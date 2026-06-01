import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadKakaoMap, REGION_CENTERS } from '../../../utils/kakao'
import './MapViewer.css'

const REGION_NAMES = {
  seoul: '서울', gyeonggi: '경기', incheon: '인천', gangwon: '강원',
  chungnam: '충남', chungbuk: '충북', daejeon: '대전', sejong: '세종',
  jeonbuk: '전북', jeonnam: '전남', gwangju: '광주', gyeongbuk: '경북',
  gyeongnam: '경남', daegu: '대구', ulsan: '울산', busan: '부산', jeju: '제주',
}

function MapViewer({ onSelectRegion }) {
  const navigate  = useNavigate()
  const mapRef    = useRef(null)
  const overlaysRef = useRef([])

  useEffect(() => {
    loadKakaoMap().then(() => {
      const { kakao } = window

      const map = new kakao.maps.Map(mapRef.current, {
        center: new kakao.maps.LatLng(36.5, 127.9),
        level: 13,
      })

      // 제주~독도까지 전국이 보이도록 bounds 맞춤
      const bounds = new kakao.maps.LatLngBounds(
        new kakao.maps.LatLng(33.0, 124.5),
        new kakao.maps.LatLng(38.7, 131.9)
      )
      map.setBounds(bounds)

      overlaysRef.current.forEach(o => o.setMap(null))
      overlaysRef.current = []

      Object.entries(REGION_CENTERS).forEach(([regionId, { lat, lng }]) => {
        const name = REGION_NAMES[regionId] || regionId

        // 커스텀 오버레이 (마커 + 라벨 일체형)
        const content = `
          <div class="kakao_region_pin" data-id="${regionId}">
            <span>${name}</span>
          </div>`

        const overlay = new kakao.maps.CustomOverlay({
          position: new kakao.maps.LatLng(lat, lng),
          content,
          yAnchor: 1,
        })
        overlay.setMap(map)
        overlaysRef.current.push(overlay)

      })

      // 이벤트 위임 — 핀 클릭 시 지역 페이지 이동
      mapRef.current.addEventListener('click', e => {
        const pin = e.target.closest('.kakao_region_pin')
        if (pin) {
          const regionId = pin.dataset.id
          onSelectRegion?.({ regionId, nameKo: REGION_NAMES[regionId] })
          navigate(`/region/${regionId}`)
        }
      })
    }).catch(err => console.error(err.message))

    return () => { overlaysRef.current.forEach(o => o.setMap(null)) }
  }, [])

  return (
    <div className="mapviewer">
      <div className="mapviewer_header">
        <div className="mapviewer_header_left">
          <p className="mapviewer_label">INTERACTIVE MAP</p>
          <p className="mapviewer_subtitle">대한민국 · 광역시·도 단위</p>
        </div>
      </div>
      <div ref={mapRef} className="mapviewer_map" />
    </div>
  )
}

export default MapViewer
