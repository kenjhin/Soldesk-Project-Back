import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import axios from 'axios';
import { useIcon } from "../contexts/IconContext";
import '../styles/Store.css';


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
        alert('아이콘 구매 완료. 77ㅓ억');
        fetchUserIcons();
        refreshUserData();
        // 구매 후 포인트 갱신 등의 추가 작업이 필요한 경우 여기에 구현
      } else {
        alert('포인트가 부족합니다.');
      }
    } catch (error) {
      console.error("아이콘 구매에 실패했습니다.", error);
      alert('포인트가 부족합니다.');
    }
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
            <div key={icon.id} className='icon-item'> {/* key 추가 */}
              <img src={icon.iconFile} alt={icon.IconName} style={{ width: '100px', height: '100px' }} />
              <p>{icon.IconName}</p>
              <p>{Math.round(icon.iconPrice)} 포인트</p>
              <button onClick={() => handlePurchase(icon.IconID)}>구매하기</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Store;