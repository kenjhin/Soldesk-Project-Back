import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import axios from 'axios';
import { useIcon } from "../contexts/IconContext";
import '../styles/Store.css';
import StoreSlied from '../components/StoreSlide';
import pointIcon from '../assets/img/icon-rp-gradient-32.png';

function Store() {
  const { userData,refreshUserData } = useUser(); // 사용자 데이터
  const [icons, setIcons] = useState([]);
  const { fetchUserIcons } = useIcon();

  // 아이콘 목록을 불러오는 함수
  const fetchIcons = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/icons');
      console.log(response.data); // 여기서 응답 데이터 구조 확인
      setIcons(response.data);
    } catch (error) {
      console.error("아이콘 목록을 불러오는데 실패했습니다.", error);
    }
  };
  
  // 컴포넌트가 마운트될 때 아이콘 목록 불러오기
  useEffect(() => {
    fetchIcons();
  }, []);

  const handlePurchase = async (iconId) => {
    try {
      // 유저 ID와 아이콘 ID를 사용하여 구매 API 호출
      const response = await axios.post('http://localhost:3001/api/purchase', {
        userId: userData.id, // 여기서 userData.id가 올바른지 확인
        iconId: iconId, // 여기서 iconId가 올바른지, 그리고 올바르게 전송되는지 확인
      });
      if (response.data.success) {
        alert('아이콘을 구매하였습니다.');
        await refreshUserData();
        fetchUserIcons();
        // 구매 후 포인트 갱신 등의 추가 작업이 필요한 경우 여기에 구현
      } else {
        alert('보유하신 RP가 부족합니다.');
      }
    } catch (error) {
      console.error("아이콘 구매에 실패했습니다.", error);
      alert('보유하신 RP가 부족합니다.');
    }
  };

  return (
    <div className='store-container'>
      {/* 관리자일 경우 아이콘 스토어 관리 버튼 표시 */}
      <div className="store-top-right"> {/* 새로운 컨테이너 추가 */}
        {userData && userData.authority === 'admin' && (
          <div className="StoreAdminHandle">
            <Link to="/icon-store-manager">
              <button className='StoreAdminBtn'>아이콘 스토어 관리</button>
            </Link>
          </div>
        )}
        <div className='My-Point'>
        <h1>RP</h1>

        {userData ? (
          <>
            <img src={pointIcon} alt="RP" style={{ verticalAlign: 'middle', marginRight: '5px' }}/>
            <span>{userData.point}</span>
          </>
          ) : '포인트를 불러오는 중...'}
          {/* RP 충전 버튼 추가 */}
          <button className='Point-Charge' 
          onClick={() => alert('RP 충전 페이지로 이동합니다.')}>RP 충전</button>  
        </div>
        
      </div>
      
      <div className='Store-Slide'>
        <StoreSlied/>
      </div>
    <div className="icon-shop-title">아이콘 상점</div> {/* 이름표 추가 */}
    <div className='icons-list'>
  {icons.length === 0 ? (
    <p>로딩 중...</p>
  ) : (
    icons
      .filter((icon) => icon.IconID < 1 || icon.IconID > 17) // ID가 1에서 17 사이가 아닌 아이콘만 표시
      .map((icon) => (
        <div key={icon.id} className='icon-item'>
          <div className='icon-cover' onMouseEnter={() => {}} onMouseLeave={() => {}}>
            <img src={icon.iconFile} alt={icon.IconName} />
            <div className="icon-name-overlay">
              <div>{icon.IconName}</div>
              <div>{Math.round(icon.iconPrice)} 포인트</div>
              <button className="button-buy" onClick={() => handlePurchase(icon.IconID)}>구매하기</button>
            </div>
          </div>
        </div>
      ))
  )}
</div>
    </div>
  );
}

export default Store;