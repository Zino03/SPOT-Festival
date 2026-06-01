export const REGION_CENTERS = {
  seoul:     { lat: 37.5665,  lng: 126.9780 },
  gyeonggi:  { lat: 37.4138,  lng: 127.5183 },
  incheon:   { lat: 37.4563,  lng: 126.7052 },
  gangwon:   { lat: 37.8228,  lng: 128.1555 },
  chungnam:  { lat: 36.5184,  lng: 126.8000 },
  chungbuk:  { lat: 36.6358,  lng: 127.4913 },
  daejeon:   { lat: 36.3504,  lng: 127.3845 },
  sejong:    { lat: 36.4800,  lng: 127.2890 },
  jeonbuk:   { lat: 35.7175,  lng: 127.1530 },
  jeonnam:   { lat: 34.8679,  lng: 126.9910 },
  gwangju:   { lat: 35.1595,  lng: 126.8526 },
  gyeongbuk: { lat: 36.4919,  lng: 128.8889 },
  gyeongnam: { lat: 35.4606,  lng: 128.2132 },
  daegu:     { lat: 35.8714,  lng: 128.6014 },
  ulsan:     { lat: 35.5384,  lng: 129.3114 },
  busan:     { lat: 35.1796,  lng: 129.0756 },
  jeju:      { lat: 33.4996,  lng: 126.5312 },
}

// 중복 로드 방지
let loadPromise = null

async function fetchKey() {
  const res = await fetch('http://localhost:8080/api/config/kakao-key')
  const data = await res.json()
  return data.key
}

export function loadKakaoMap() {
  if (window.kakao?.maps) return Promise.resolve()
  if (loadPromise) return loadPromise

  loadPromise = fetchKey().then(key => new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&libraries=services&autoload=false`
    script.onload  = () => window.kakao.maps.load(resolve)
    script.onerror = () => reject(new Error('카카오맵 스크립트 로드 실패'))
    document.head.appendChild(script)
  }))

  return loadPromise
}
