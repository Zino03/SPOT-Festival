import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { loadKakaoMap, REGION_CENTERS } from '../../../utils/kakao'
import { REGION_NAMES } from '../../../utils/regions'
import './RegionMapViewer.css'

function RegionMapViewer() {
  const { regionId } = useParams()
  const mapRef      = useRef(null)
  const markersRef  = useRef([])
  const infoWinRef  = useRef(null)

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

      markersRef.current.forEach(m => m.setMap(null))
      markersRef.current = []
      infoWinRef.current?.close()

      fetch(`http://localhost:8080/api/festivals/region/${regionId}`)
        .then(r => r.json())
        .then(festivals => {
          if (destroyed) return

          festivals.forEach(f => {
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

            kakao.maps.event.addListener(marker, 'click', () => {
              infoWinRef.current?.close()
              infoWindow.open(map, marker)
              infoWinRef.current = infoWindow
            })
          })

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
