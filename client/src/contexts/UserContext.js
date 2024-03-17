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
      // 서버 응답에서 user 객체를 정확히 참조하도록 수정
      if (response.data && response.data.user) { // 변경된 부분: userData -> user
        setUserData(response.data.user); // 사용자 데이터를 state에 저장
      } else {
        console.log('유저 데이터를 불러오는 데 실패했습니다.');
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