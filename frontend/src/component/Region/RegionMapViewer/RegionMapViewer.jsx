// 지역 페이지 카카오 지도 컴포넌트
// 해당 지역의 축제 위치를 마커로 표시하며, 마커 클릭 시 인포윈도우로 축제명과 기간 표시
// 마커가 1개 이상이면 모든 마커가 보이도록 지도 범위를 자동 조정

// loadKakaoMap()이 비동기이므로 언마운트 시 destroyed 플래그로 콜백 실행 제한
// regionId 변경(지역 전환) 시 기존 마커를 제거하고 새 지역 마커를 다시 로드

import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { loadKakaoMap, REGION_CENTERS } from '../../../utils/kakao'
import { REGION_NAMES } from '../../../utils/regions'
import './RegionMapViewer.css'

function RegionMapViewer() {
  const { regionId } = useParams()
  const mapRef = useRef(null)
  const markersRef = useRef([]) // 언마운트 시 마커 제거용
  const infoWinRef = useRef(null) // 현재 열린 인포윈도우 — 중복 방지용

  useEffect(() => {
    const center = REGION_CENTERS[regionId] ?? REGION_CENTERS['seoul']
    let destroyed = false

    loadKakaoMap().then(() => {
      if (destroyed || !mapRef.current) return

      const { kakao } = window

      const map = new kakao.maps.Map(mapRef.current, {
        center: new kakao.maps.LatLng(center.lat, center.lng),
        level: 9,
      })

      // 기존 마커/인포윈도우 초기화
      markersRef.current.forEach(m => m.setMap(null))
      markersRef.current = []
      infoWinRef.current?.close()

      // 해당 지역 축제 목록을 받아 마커 생성
      fetch(`http://localhost:8080/api/festivals/region/${regionId}`)
        .then(r => r.json())
        .then(festivals => {
          if (destroyed) return

          festivals.forEach(f => {
            // 좌표 없는 축제는 스킵
            if (!f.lat || !f.lng || (f.lat === 0 && f.lng === 0)) return

            const marker = new kakao.maps.Marker({
              position: new kakao.maps.LatLng(f.lat, f.lng),
              map,
            })
            markersRef.current.push(marker)

            const infoWindow = new kakao.maps.InfoWindow({
              content: `
                <div class="kakao_festival_info">
                  <strong>${f.name}</strong>
                  <span>${f.startDate?.slice(5).replace('-', '/')} ~ ${f.endDate?.slice(5).replace('-', '/')}</span>
                </div>`,
              removable: true,
            })

            // 마커 클릭 시 이전 인포윈도우를 닫고 새 인포윈도우 오픈
            kakao.maps.event.addListener(marker, 'click', () => {
              infoWinRef.current?.close()
              infoWindow.open(map, marker)
              infoWinRef.current = infoWindow
            })
          })

          // 마커가 있으면 모두 보이도록 지도 범위 자동 조정
          if (markersRef.current.length > 0) {
            const bounds = new kakao.maps.LatLngBounds()
            markersRef.current.forEach(m => bounds.extend(m.getPosition()))
            map.setBounds(bounds)
          }
        })
        .catch(err => console.error('축제 마커 로드 실패:', err))
    }).catch(err => console.error(err.message))

    return () => {
      destroyed = true
      markersRef.current.forEach(m => m.setMap(null))
      infoWinRef.current?.close()
    }
  }, [regionId])

  return (
    <div className="regionmapviewer">
      <div className="regionmapviewer_header">
        <div>
          <p className="regionmapviewer_label">REGIONAL MAP</p>
          <p className="regionmapviewer_subtitle">
            {REGION_NAMES[regionId] || regionId} · 축제 위치
          </p>
        </div>
      </div>
      <div ref={mapRef} className="regionmapviewer_map" />
    </div>
  )
}

export default RegionMapViewer
