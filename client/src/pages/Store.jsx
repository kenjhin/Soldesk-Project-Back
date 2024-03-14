import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import axios from 'axios';

import '../styles/Store.css';

function Store() {
  const { userData } = useUser(); // 사용자 데이터
  const [icons, setIcons] = useState([]); // 아이콘 목록 상태

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

  const handlePurchase = (iconId) => {
    console.log(`Purchasing icon with ID: ${iconId}`);
    // 구매 로직을 여기에 구현...
  };

  return (
    <div className='store-container'>
      {/* 관리자일 경우 아이콘 스토어 관리 버튼 표시 */}
      {userData && userData.authority === 'admin' && (
        <div className="StoreAdminHandle">
          <Link to="/icon-store-manager">
            <button className='StoreAdminBtn'>아이콘 스토어 관리</button>
          </Link>
        </div>
      )}
    
      <p>아이콘 샵</p>
      <div className='icons-list'>
        {icons.length === 0 ? (
          <p>로딩 중...</p>
        ) : (
          icons.map((icon) => (
            <div key={icon.id} className='icon-item'>
              <img src={icon.iconFile} alt={icon.IconName} style={{ width: '100px', height: '100px' }} />
              <p>{icon.IconName}</p>
              <p>{Math.round(icon.iconPrice)} 포인트</p>
              <button onClick={() => handlePurchase(icon.id)}>구매하기</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Store;