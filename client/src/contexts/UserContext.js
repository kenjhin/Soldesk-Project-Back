import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios'; // 서버 요청을 위해 axios를 임포트합니다.

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  // 사용자 정보를 새로고침하는 함수입니다.
  const refreshUserData = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3001/userData', { withCredentials: true });
      if (response.data && response.data.userData) {
        setUserData(response.data.userData);
      } else {
        console.log('아이콘 구매 성공후 유저데이터 새로고침.');
      }
    } catch (error) {
      console.error('사용자 정보 새로고침 중 오류가 발생했습니다:', error);
    }
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData, refreshUserData }}>
      {children}
    </UserContext.Provider>
  );
};