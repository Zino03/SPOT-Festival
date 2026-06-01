import { useEffect, useRef, useState } from 'react'
import { loadKakaoMap } from '../../../utils/kakao'
import './FestivalNearbyMap.css'

const KAKAO_CATEGORY = { restaurant: 'FD6', cafe: 'CE7', parking: 'PK6' }

function FestivalNearbyMap({ festival, activeCategory, nearbyPlaces, onNearbyLoad, selectedPlaceId, onSelectPlace }) {
  const mapRef     = useRef(null)
  const mapObjRef  = useRef(null)
  const markersRef = useRef([]) // [{ marker, infoWindow, id }]
  const [mapReady, setMapReady] = useState(false)

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

      setMapReady(true)
    }).catch(err => console.error(err.message))
  }, [festival])

  // 카테고리 변경 시 마커 교체
  useEffect(() => {
    const map = mapObjRef.current
    if (!map || !window.kakao?.maps) return

    markersRef.current.forEach(({ marker, infoWindow }) => { infoWindow.close(); marker.setMap(null) })
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
        const iw = new kakao.maps.InfoWindow({
          content: `<div class="kakao_festival_info"><strong>${p.place_name}</strong><span>${p.distance ?? ''}${p.distance ? 'm' : ''}</span></div>`,
          removable: true,
        })
        markersRef.current.push({ marker, infoWindow: iw, id: p.id })
        bounds.extend(pos)

        kakao.maps.event.addListener(marker, 'click', () => onSelectPlace(p.id))
      })
      if (!bounds.isEmpty()) map.setBounds(bounds)
    }

    // 이미 검색한 결과 있으면 재사용
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
  }, [activeCategory, festival, nearbyPlaces, mapReady])

  // 선택된 장소 → 마커 포커싱
  useEffect(() => {
    const map = mapObjRef.current
    if (!map || !window.kakao?.maps) return

    markersRef.current.forEach(({ infoWindow }) => infoWindow.close())

    if (!selectedPlaceId) return
    const found = markersRef.current.find(m => m.id === selectedPlaceId)
    if (!found) return

    found.infoWindow.open(map, found.marker)
    map.panTo(found.marker.getPosition())
  }, [selectedPlaceId])

  return (
    <div className="festivalnearbymap">
      <div ref={mapRef} className="festivalnearbymap_map" />
    </div>
  )
}

export default FestivalNearbyMap
