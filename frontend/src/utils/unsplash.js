// Unsplash 이미지 유틸리티
// Unsplash API 키는 백엔드에서 관리하므로 프론트는 백엔드 프록시(/api/images) 경유
// 동일한 쿼리를 반복 호출할 때 불필요한 네트워크 요청을 막기 위해
// 모듈 레벨 Map 캐시를 사용한다 (페이지 새로고침 전까지 유지).

const BASE = 'http://localhost:8080/api/images'

// 쿼리 문자열을 키로 결과 URL을 캐싱 — 동일 쿼리 중복 요청 방지
const cache = new Map()

// 단일 이미지 URL 반환. 실패 시 null 반환
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

// 여러 이미지 URL 배열 반환. 실패 시 빈 배열 반환
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

// 지역별 Unsplash 검색 키워드
// RegionPage 히어로 배너와 MapRegionList 썸네일에서 공용 사용
export const REGION_QUERY = {
  seoul: 'Seoul Korea city skyline',
  gyeonggi: 'Suwon Gyeonggi Korea',
  incheon: 'Incheon Korea port city',
  gangwon: 'Seoraksan Gangwon mountains Korea',
  chungnam: 'Baekje Chungnam Korea heritage',
  chungbuk: 'Cheongju Chungbuk Korea nature',
  daejeon: 'Daejeon Korea city',
  sejong: 'Sejong Korea smart city',
  jeonbuk: 'Jeonju Hanok village Korea traditional',
  jeonnam: 'Suncheon Jeonnam Korea coastal',
  gwangju: 'Gwangju Korea art city',
  gyeongbuk: 'Gyeongju Andong Korea heritage',
  gyeongnam: 'Tongyeong Gyeongnam Korea coastal',
  daegu: 'Daegu Korea city',
  ulsan: 'Ulsan Korea whale coastal',
  busan: 'Busan Korea beach ocean Haeundae',
  jeju: 'Jeju Island Korea nature volcanic',
}
