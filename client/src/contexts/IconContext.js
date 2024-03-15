import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from './UserContext'; // UserContext의 사용

const IconContext = createContext();

export const useIcon = () => useContext(IconContext);

export const IconProvider = ({ children }) => {
  const [icons, setIcons] = useState([]);
  const [userIcons, setUserIcons] = useState([]); // 사용자가 보유한 아이콘 목록 상태 추가
  const { userData } = useUser(); // UserContext에서 유저 데이터 가져오기

  // 사용자가 보유한 아이콘 목록을 불러오는 함수
  useEffect(() => {
    const fetchUserIcons = async () => {
      if (userData && userData.id) {
        try {
          const response = await axios.get(`http://localhost:3001/api/user-icons/${userData.id}`);
          setUserIcons(response.data);
          console.log(response.data); // 오류를 수정한 부분
        } catch (error) {
          console.error("Error fetching user icons:", error);
        }
      }
    };

    fetchUserIcons();
  }, [userData]); // userData가 변경될 때마다 실행


// 선택한 아이콘의 IsCurrent를 업데이트하는 함수
const setCurrentIcon = async (iconId) => {
  try {
    // 서버에 현재 아이콘 설정 요청을 보냅니다.
    const response = await axios.post(`http://localhost:3001/api/user-icons/set-current/${userData.id}`, { iconId });

    // 요청이 성공하면, userIcons 상태를 업데이트합니다.
    if (response.status === 200) {
      // 모든 아이콘의 isCurrent를 0으로 설정하고, 선택한 아이콘만 isCurrent를 1로 설정합니다.
      const updatedIcons = userIcons.map(icon => ({
        ...icon,
        isCurrent: icon.IconID === iconId ? 1 : 0
      }));
      setUserIcons(updatedIcons);
    }
  } catch (error) {
    console.error("Error setting current icon:", error);
  }
};




  return (
    <IconContext.Provider value={{ icons, setIcons, userIcons, setCurrentIcon }}>
      {children}
    </IconContext.Provider>
  );
};