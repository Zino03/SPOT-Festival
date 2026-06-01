// 카카오맵 SDK 로드 유틸리티

// 카카오맵 앱키는 보안상 백엔드에서 관리
// SDK 스크립트를 직접 HTML에 삽입하지 않고 런타임에 동적으로

// [로드 흐름]
// 1. 백엔드 /api/config/kakao-key 에서 앱키를 받음
// 2. <script> 태그를 동적으로 생성해 <head>에 삽입
// 3. autoload=false 옵션으로 자동 초기화를 막고, onload 콜백에서 kakao.maps.load()를 호출해 수동으로 초기화
// 4. loadPromise에 Promise를 저장해 여러 컴포넌트가 동시에 호출해도 SDK를 한 번만 로드

// 17개 광역시, 도의 지도 중심 좌표
// MapViewer 핀 위치 및 RegionMapViewer 초기 중심점
export const REGION_CENTERS = {
  seoul: { lat: 37.5665, lng: 126.9780 },
  gyeonggi: { lat: 37.4138, lng: 127.5183 },
  incheon: { lat: 37.4563, lng: 126.7052 },
  gangwon: { lat: 37.8228, lng: 128.1555 },
  chungnam: { lat: 36.5184, lng: 126.8000 },
  chungbuk: { lat: 36.6358, lng: 127.4913 },
  daejeon: { lat: 36.3504, lng: 127.3845 },
  sejong: { lat: 36.4800, lng: 127.2890 },
  jeonbuk: { lat: 35.7175, lng: 127.1530 },
  jeonnam: { lat: 34.8679, lng: 126.9910 },
  gwangju: { lat: 35.1595, lng: 126.8526 },
  gyeongbuk: { lat: 36.4919, lng: 128.8889 },
  gyeongnam: { lat: 35.4606, lng: 128.2132 },
  daegu: { lat: 35.8714, lng: 128.6014 },
  ulsan: { lat: 35.5384, lng: 129.3114 },
  busan: { lat: 35.1796, lng: 129.0756 },
  jeju: { lat: 33.4996, lng: 126.5312 },
}

// 진행 중인 로드 Promise — 중복 로드 방지용
let loadPromise = null

// 백엔드에서 카카오맵 앱키를 받음
async function fetchKey() {
  const res = await fetch('http://localhost:8080/api/config/kakao-key')
  const data = await res.json()
  return data.key
}

// 카카오맵 SDK를 동적으로 로드 및 초기화
// 이미 로드된 경우 즉시 resolve, 로드 중인 경우 기존 Promise를 반환
export function loadKakaoMap() {
  // 이미 초기화된 경우 즉시 반환
  if (window.kakao?.maps) return Promise.resolve()
  // 로드 중인 경우 동일한 Promise 반환 (중복 스크립트 삽입 방지)
  if (loadPromise) return loadPromise

  loadPromise = fetchKey().then(key => new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&libraries=services&autoload=false`
    script.onload = () => window.kakao.maps.load(resolve)
    script.onerror = () => reject(new Error('카카오맵 스크립트 로드 실패'))
    document.head.appendChild(script)
  }))

  return loadPromise
}
