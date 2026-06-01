// 전국 카카오 지도 컴포넌트
// REGION_CENTERS의 17개 좌표에 커스텀 오버레이 핀 렌더링
// 핀 클릭 시 해당 지역 페이지(/region/:regionId)로 이동

// 이벤트는 핀마다 리스너를 붙이지 않고 맵 컨테이너에 위임해 처리한다.
// loadKakaoMap()이 비동기이므로 컴포넌트 언마운트 시 destroyed 플래그로 콜백 실행 제한

import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadKakaoMap, REGION_CENTERS } from '../../../utils/kakao'
import { REGION_NAMES } from '../../../utils/regions'
import './MapViewer.css'

function MapViewer({ onSelectRegion }) {
  const navigate = useNavigate()
  const mapRef = useRef(null)
  const overlaysRef = useRef([]) // 언마운트 시 오버레이 제거용

  useEffect(() => {
    let destroyed = false

    loadKakaoMap().then(() => {
      // 언마운트 후 콜백이 실행되면 mapRef.current가 null이므로 중단
      if (destroyed || !mapRef.current) return

      const { kakao } = window

      const map = new kakao.maps.Map(mapRef.current, {
        center: new kakao.maps.LatLng(36.5, 127.9),
        level: 13,
      })

      // 제주 ~ 독도가 모두 보이는 bounds로 초기 뷰 설정
      const bounds = new kakao.maps.LatLngBounds(
        new kakao.maps.LatLng(33.0, 124.5),
        new kakao.maps.LatLng(38.7, 131.9)
      )
      map.setBounds(bounds)

      overlaysRef.current.forEach(o => o.setMap(null))
      overlaysRef.current = []

      // 17개 지역 핀 생성
      Object.entries(REGION_CENTERS).forEach(([regionId, { lat, lng }]) => {
        const name = REGION_NAMES[regionId] || regionId
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

      // 이벤트 위임 — 핀 클릭 시 지역 페이지로 이동
      mapRef.current.addEventListener('click', e => {
        const pin = e.target.closest('.kakao_region_pin')
        if (pin) {
          const regionId = pin.dataset.id
          onSelectRegion?.({ regionId, nameKo: REGION_NAMES[regionId] })
          navigate(`/region/${regionId}`)
        }
      })
    }).catch(err => console.error(err.message))

    return () => {
      destroyed = true
      overlaysRef.current.forEach(o => o.setMap(null))
    }
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
