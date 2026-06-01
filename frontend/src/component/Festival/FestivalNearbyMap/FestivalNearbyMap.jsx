import { useEffect, useRef, useState } from 'react'
import { loadKakaoMap } from '../../../utils/kakao'
import './FestivalNearbyMap.css'

const KAKAO_CATEGORY = { restaurant: 'FD6', cafe: 'CE7', parking: 'PK6' }
const KAKAO_RADIUS   = { restaurant: 1000,  cafe: 1000,  parking: 2000  }

function FestivalNearbyMap({ festival, activeCategory, activeSort, nearbyPlaces, onNearbyLoad, selectedPlaceId, onSelectPlace }) {
  const mapRef     = useRef(null)
  const mapObjRef  = useRef(null)
  const markersRef = useRef([]) // [{ marker, infoWindow, id }]
  const [mapReady, setMapReady] = useState(false)

  // 지도 + 축제 위치 핀 초기화
  useEffect(() => {
    if (!festival?.lat || !festival?.lng) return
    let destroyed = false

    loadKakaoMap().then(() => {
      if (destroyed || !mapRef.current) return

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

    return () => { destroyed = true }
  }, [festival])

  // 카테고리 변경 시 마커 교체
  useEffect(() => {
    const map = mapObjRef.current
    if (!map || !window.kakao?.maps) return
    let destroyed = false

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
    if (cached?.length) { addMarkers(cached); return () => { destroyed = true } }

    // 카카오 Places 검색 — 전체 페이지 누적
    const code = KAKAO_CATEGORY[activeCategory]
    if (!code || !festival?.lat) return () => { destroyed = true }

    const allPlaces = []
    const ps = new kakao.maps.services.Places()
    const sortBy = activeSort === 'accuracy'
      ? kakao.maps.services.SortBy.ACCURACY
      : kakao.maps.services.SortBy.DISTANCE

    ps.categorySearch(code, (result, status, pagination) => {
      if (destroyed) return
      if (status !== kakao.maps.services.Status.OK) return

      allPlaces.push(...result)

      if (pagination.hasNextPage) {
        pagination.nextPage()
      } else {
        onNearbyLoad(activeCategory, allPlaces)
        addMarkers(allPlaces)
      }
    }, {
      location: new kakao.maps.LatLng(festival.lat, festival.lng),
      radius: KAKAO_RADIUS[activeCategory],
      sort: sortBy,
      size: 15,
    })

    return () => { destroyed = true }
  }, [activeCategory, activeSort, festival, nearbyPlaces, mapReady])

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
