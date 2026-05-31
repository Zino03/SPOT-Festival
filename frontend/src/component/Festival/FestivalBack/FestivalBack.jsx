import { useNavigate } from 'react-router-dom'
import './FestivalBack.css'

function FestivalBack() {
  const navigate = useNavigate()

  return (
    <button
      className="festivalback"
      onClick={() => navigate(-1)}  /* 이전 페이지로 이동 */
    >
      〈 돌아가기
    </button>
  )
}

export default FestivalBack