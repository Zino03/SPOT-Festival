const BASE = 'http://localhost:8080/api/images'

// 모듈 레벨 캐시 — 동일 쿼리 재호출 방지
const cache = new Map()

// 단일 이미지 URL 반환
export async function fetchPhoto(query, orientation = 'landscape') {
  const key = `photo:${query}:${orientation}`
  if (cache.has(key)) return cache.get(key)
  try {
    const res = await fetch(`${BASE}/photo?query=${encodeURIComponent(query)}&orientation=${orientation}`)
    if (!res.ok) return null
    const data = await res.json()
    const url = data?.url ?? null
    if (url) cache.set(key, url)
    return url
  } catch {
    return null
  }
}

// 여러 이미지 URL 배열 반환
export async function fetchPhotos(query, count = 1, orientation = 'landscape') {
  const key = `photos:${query}:${count}:${orientation}`
  if (cache.has(key)) return cache.get(key)
  try {
    const res = await fetch(`${BASE}/photos?query=${encodeURIComponent(query)}&count=${count}&orientation=${orientation}`)
    if (!res.ok) return []
    const urls = await res.json()
    if (Array.isArray(urls)) cache.set(key, urls)
    return Array.isArray(urls) ? urls : []
  } catch {
    return []
  }
}

// 지역별 검색 쿼리 (RegionPage 히어로 + MapRegionList 썸네일 공용)
export const REGION_QUERY = {
  seoul:     'Seoul Korea city skyline',
  gyeonggi:  'Suwon Gyeonggi Korea',
  incheon:   'Incheon Korea port city',
  gangwon:   'Seoraksan Gangwon mountains Korea',
  chungnam:  'Baekje Chungnam Korea heritage',
  chungbuk:  'Cheongju Chungbuk Korea nature',
  daejeon:   'Daejeon Korea city',
  sejong:    'Sejong Korea smart city',
  jeonbuk:   'Jeonju Hanok village Korea traditional',
  jeonnam:   'Suncheon Jeonnam Korea coastal',
  gwangju:   'Gwangju Korea art city',
  gyeongbuk: 'Gyeongju Andong Korea heritage',
  gyeongnam: 'Tongyeong Gyeongnam Korea coastal',
  daegu:     'Daegu Korea city',
  ulsan:     'Ulsan Korea whale coastal',
  busan:     'Busan Korea beach ocean Haeundae',
  jeju:      'Jeju Island Korea nature volcanic',
}
