// 축제 상세 페이지 카카오 지도 컴포넌트
// 축제 위치에 커스텀 핀을 표시하고, 카카오 Places API로 주변 장소를 검색해 마커 표시

// 1. festival 변경 시 : 지도 초기화 + 축제 위치 핀 생성 → mapReady = true
// 2. activeCategory / activeSort / mapReady 변경 시 : 기존 마커 제거 후 Places 재검색
// 3. selectedPlaceId 변경 시 : 해당 마커 인포윈도우 오픈 + 지도 중심 이동

// 페이지네이션
// categorySearch 결과를 pagination.nextPage()로 모두 누적한 뒤 onNearbyLoad에 한 번에 전달
// nearbyPlaces에 캐시가 있으면 재검색 없이 재사용

// 반경: 식당/카페 1000m, 주차장 2000m

import { useEffect, useRef, useState } from 'react'
import { loadKakaoMap } from '../../../utils/kakao'
import './FestivalNearbyMap.css'

const KAKAO_CATEGORY = { restaurant: 'FD6', cafe: 'CE7', parking: 'PK6' }
const KAKAO_RADIUS = { restaurant: 1000, cafe: 1000, parking: 2000 }

function FestivalNearbyMap({ festival, activeCategory, activeSort, nearbyPlaces, onNearbyLoad, selectedPlaceId, onSelectPlace }) {
  const mapRef = useRef(null)
  const mapObjRef = useRef(null)
  const markersRef = useRef([]) // [{ marker, infoWindow, id }] — 마커 제거/검색용
  const [mapReady, setMapReady] = useState(false)

  // 1. 지도 초기화 + 축제 위치 핀
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

  // 2. 카테고리 / 정렬 변경 시 마커 교체
  useEffect(() => {
    const map = mapObjRef.current
    if (!map || !window.kakao?.maps) return
    let destroyed = false

    // 기존 마커 전체 제거
    markersRef.current.forEach(({ marker, infoWindow }) => { infoWindow.close(); marker.setMap(null) })
    markersRef.current = []

    const { kakao } = window
    // 축제 위치를 bounds 시작점으로 포함
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

    // 캐시 있으면 재사용
    const cached = nearbyPlaces[activeCategory]
    if (cached?.length) { addMarkers(cached); return () => { destroyed = true } }

    const code = KAKAO_CATEGORY[activeCategory]
    if (!code || !festival?.lat) return () => { destroyed = true }

    // 전체 페이지 누적 후 onNearbyLoad에 전달
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

  // 3. 선택된 장소 → 인포윈도우 오픈 + 지도 중심 이동
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
