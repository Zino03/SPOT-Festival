import { useState, useEffect } from 'react'
import { loadKakaoMap } from '../../../utils/kakao'
import './BuilderCardGrid.css'

const KAKAO_CODE = { 2: 'FD6', 3: 'CE7' }
const SHOW_COUNT = 10

function BuilderCardGrid({ currentStep, festival, preferences, onSelect }) {
  const [selectedIds, setSelectedIds] = useState([])
  const [showAll, setShowAll] = useState(false)
  const [festivalItems, setFestivalItems] = useState([])
  const [kakaoItems, setKakaoItems] = useState([])
  const [images, setImages] = useState([])

  const [fallbackMsg, setFallbackMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Step 1: 축제 추천
  useEffect(() => {
    if (currentStep !== 1 || !preferences || !preferences.region) return;
    const fetchFestivals = (currentPrefs, isRetry = false) => {
      setIsLoading(true);
      fetch('http://localhost:8080/api/festivals/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentPrefs)
      })
      .then(res => {
        if (!res.ok) throw new Error('AI 축제 추천 API 응답 에러');
        return res.json();
      })
      .then(data => {
          if (data.length === 0) {
          // 지역 검색 결과 없으면 전국으로 재검색
          if (!isRetry && currentPrefs.region !== '전국') {
            setFallbackMsg(`'${currentPrefs.region}' 지역에 진행 중인 축제가 없어 전국 기준으로 추천해 드립니다.`);
            fetchFestivals({ ...currentPrefs, region: '전국' }, true);
            return;
          }
          // 전국으로도 없으면
          setFallbackMsg('선택하신 날짜에 진행 중인 축제가 없습니다.');
        }
        const mapped = data.map((f, i) => ({
          id: f.id,
          name: f.name,
          category: f.region,
          price: null,
          views: f.viewCount,
          distance: null,
          walk: null,
          wait: null,
          date: `${f.startDate?.slice(5).replace('-','/')} ~ ${f.endDate?.slice(5).replace('-','/')}`,
          lat: f.lat,
          lng: f.lng,
          image: '',
          isAI: i === 0,
        }));
        setFestivalItems(mapped)
      })
      .catch(err => console.error('AI 축제 추천 API 에러:', err))
      .finally(() => {
        if (!isRetry) setIsLoading(false); // 재요청이 아닐 때만 로딩 끄기
      });
    };

    setFallbackMsg('');
    fetchFestivals(preferences, false);
  }, [currentStep, preferences]);

  // Step 2(맛집), Step 3(카페): Kakao Places + Gemini AI 하이브리드
  useEffect(() => {
    if (![2, 3].includes(currentStep) || !festival?.lat) return;

    setIsLoading(true);
    setKakaoItems([]);

    loadKakaoMap().then(() => {
      const { kakao } = window;
      const ps = new kakao.maps.services.Places();
      ps.categorySearch(KAKAO_CODE[currentStep], (result, status) => {
        if (status !== kakao.maps.services.Status.OK) return;
        const rawPlaces = result.map(p => ({
          id: p.id,
          name: p.place_name,
          category: p.category_name?.split('>').pop().trim() || '',
          price: null,
          distance: p.distance ? `${p.distance}m` : null,
          walk: p.distance ? `${Math.ceil(p.distance / 80)}분` : null,
          wait: null,
          address: p.road_address_name || p.address_name,
          phone: p.phone,
          isAI: false,
        }));
        fetch('http://localhost:8080/api/restaurants/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            preferences: preferences,
            places: rawPlaces
          })
        })
        .then(res => {
          if (!res.ok) throw new Error('AI 맛집/카페 정렬 API 통신 에러');
          return res.json();
        })
        .then(sortedData => {
          setKakaoItems(sortedData);
        })
        .catch(err => {
          console.error('AI 정렬 통신 실패, 기본 거리순으로 렌더링합니다:', err);
          // 에러 시 첫 번째에 AI 뱃지 달아 거리순 폴백
          if (rawPlaces.length > 0) rawPlaces[0].isAI = true;
          setKakaoItems(rawPlaces);
        })
        .finally(() => setIsLoading(false));
      }, {
        location: new kakao.maps.LatLng(festival.lat, festival.lng),
        radius: 1500,
        sort: kakao.maps.services.SortBy.DISTANCE,
      })
    })
  }, [currentStep, festival, preferences]);

  // Step 4: 주차장 API
  useEffect(() => {
    if (currentStep !== 4 || !festival?.lat) return

    setIsLoading(true);
    setKakaoItems([])

    fetch(`http://localhost:8080/api/parking/nearby?lat=${festival.lat}&lng=${festival.lng}`)
      .then(r => r.json())
      .then(data => setKakaoItems(data.map((p, i) => ({
        id: p.id || i,
        name: p.place_name,
        category: '주차장',
        price: null,
        rating: null,
        distance: `${p.distance}m`,
        walk: `${Math.ceil(p.distance / 80)}분`,
        wait: null,
        isAI: i === 0,
        address: p.road_address_name || p.address_name,
      }))))
      .catch(err => console.error('주차장 API 에러:', err))
      .finally(() => setIsLoading(false));
  }, [currentStep, festival])

  const items = currentStep === 1 ? festivalItems : kakaoItems
  const visibleItems = showAll ? items : items.slice(0, SHOW_COUNT)
  const remainCount = items.length - SHOW_COUNT

  function handleSelect(item) {
    if (currentStep === 2) {
      // 맛집: 최대 2개, 초과 시 오래된 것부터 제거 (Queue)
      let newIds = [...selectedIds];
      if (newIds.includes(item.id)) {
        newIds = newIds.filter(id => id !== item.id);
      } else {
        if (newIds.length >= 2) newIds.shift();
        newIds.push(item.id);
      }
      setSelectedIds(newIds);
      const selectedItems = items.filter(i => newIds.includes(i.id));
      if (onSelect) onSelect(selectedItems);
    } else {
      setSelectedIds([item.id]);
      if (onSelect) onSelect(item);
    }
  }

  return (
    <div className="buildercardgrid">
        {fallbackMsg && currentStep === 1 && (
        <div style={{
          backgroundColor: '#fff3cd',
          color: '#856404',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '16px',
          fontSize: '14px',
          fontWeight: '600',
          border: '1px solid #ffeeba',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
            <span>🚨</span> {fallbackMsg}
          </div>
      )}


      {isLoading ? (
        <div className="buildercardgrid_grid">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={`skeleton-${n}`} className="buildercardgrid_skeleton_card">
              <div className="buildercardgrid_skeleton_line short"></div>
              <div className="buildercardgrid_skeleton_line title"></div>
              <div className="buildercardgrid_skeleton_line long"></div>
              <div className="buildercardgrid_skeleton_box"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="buildercardgrid_grid">
          {visibleItems.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            const selectionIndex = selectedIds.indexOf(item.id);
            return (
              <div key={item.id} className={`buildercardgrid_card ${isSelected ? 'selected' : ''}`} onClick={() => handleSelect(item)}>
                <div className="buildercardgrid_card_header">
                  <span className="buildercardgrid_category">{item.category}</span>
                  <div className="buildercardgrid_badges">
                    {item.isAI && <span className="buildercardgrid_badge_ai">✦ AI 추천</span>}
                    {isSelected && (
                      <span className="buildercardgrid_badge_selected">
                        {currentStep === 2 ? (selectionIndex === 0 ? '점심' : '저녁') : '선택됨'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="buildercardgrid_info">
                  <h3 className="buildercardgrid_name">{item.name}</h3>
                  {item.address && <p className="buildercardgrid_address">{item.address}</p>}
                  <div className="buildercardgrid_details">
                    {item.date && <span>📅 {item.date}</span>}
                    {item.views != null && <span>👁 {item.views.toLocaleString()}</span>}
                    {item.walk && <span>🚶 도보 {item.walk}</span>}
                    {item.distance && !item.date && <span>📍 {item.distance}</span>}
                  </div>
                </div>
              </div>
            );
          })}
          
          {!showAll && remainCount > 0 && (
            <div className="buildercardgrid_more" onClick={() => setShowAll(true)}>
              <span className="buildercardgrid_more_icon">+</span>
              <p>{remainCount} MORE</p>
              <p className="buildercardgrid_more_desc">나머지 후보 보기</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default BuilderCardGrid