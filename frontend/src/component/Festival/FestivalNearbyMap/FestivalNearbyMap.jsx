import { useEffect, useRef } from 'react'
import { loadKakaoMap } from '../../../utils/kakao'
import './FestivalNearbyMap.css'

const CATEGORY_FILTERS = [
  { label: '식당', icon: '🍴', value: 'restaurant' },
  { label: '카페', icon: '☕', value: 'cafe'       },
  { label: '주차장', icon: '🅿', value: 'parking'  },
]

// 카카오 카테고리 코드
const KAKAO_CATEGORY = { restaurant: 'FD6', cafe: 'CE7' }

function FestivalNearbyMap({ festival, activeCategory, parkings, nearbyPlaces, onNearbyLoad }) {
  const mapRef     = useRef(null)
  const mapObjRef  = useRef(null)
  const markersRef = useRef([])

  // 지도 + 축제 위치 핀 초기화
  useEffect(() => {
    if (!festival?.lat || !festival?.lng) return

    loadKakaoMap().then(() => {
      const { kakao } = window
      const pos = new kakao.maps.LatLng(festival.lat, festival.lng)
      const map = new kakao.maps.Map(mapRef.current, { center: pos, level: 5 })
      mapObjRef.current = map

      new kakao.maps.CustomOverlay({
        position: pos,
        content: `<div class="kakao_festival_pin">${festival.name}</div>`,
        yAnchor: 1,
        map,
      })
    }).catch(err => console.error(err.message))
  }, [festival])

  // 카테고리 변경 시 마커 교체
  useEffect(() => {
    const map = mapObjRef.current
    if (!map) return

    markersRef.current.forEach(m => m.setMap(null))
    markersRef.current = []

    const { kakao } = window
    const bounds = new kakao.maps.LatLngBounds()
    if (festival?.lat && festival?.lng) {
      bounds.extend(new kakao.maps.LatLng(festival.lat, festival.lng))
    }

    function addMarkers(places) {
      places.forEach(p => {
        const lat = parseFloat(p.y ?? p.lat)
        const lng = parseFloat(p.x ?? p.lng)
        if (!lat || !lng) return

        const pos = new kakao.maps.LatLng(lat, lng)
        const marker = new kakao.maps.Marker({ position: pos, map })
        markersRef.current.push(marker)
        bounds.extend(pos)

        const iw = new kakao.maps.InfoWindow({
          content: `<div class="kakao_festival_info"><strong>${p.place_name}</strong><span>${p.distance ?? ''}${p.distance ? 'm' : ''}</span></div>`,
          removable: true,
        })
        kakao.maps.event.addListener(marker, 'click', () => iw.open(map, marker))
      })
      if (!bounds.isEmpty()) map.setBounds(bounds)
    }

    if (activeCategory === 'parking') {
      addMarkers(parkings)
      return
    }

    // 식당 / 카페: 이미 검색한 결과 있으면 재사용
    const cached = nearbyPlaces[activeCategory]
    if (cached?.length) { addMarkers(cached); return }

    // 카카오 Places 검색
    const code = KAKAO_CATEGORY[activeCategory]
    if (!code || !festival?.lat) return

    const ps = new kakao.maps.services.Places()
    ps.categorySearch(code, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        onNearbyLoad(activeCategory, result)
        addMarkers(result)
      }
    }, {
      location: new kakao.maps.LatLng(festival.lat, festival.lng),
      radius: 1500,
      sort: kakao.maps.services.SortBy.DISTANCE,
    })
  }, [activeCategory, festival, parkings, nearbyPlaces])

  return (
    <div className="festivalnearbymap">
      <div className="festivalnearbymap_filters">
        {CATEGORY_FILTERS.map(cat => (
          <button
            key={cat.value}
            className={`festivalnearbymap_filter ${activeCategory === cat.value ? 'active' : ''}`}
            onClick={() => {}}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>
      <div ref={mapRef} className="festivalnearbymap_map" />
    </div>
  )
}

export default FestivalNearbyMap
