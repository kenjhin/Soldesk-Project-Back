import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from './UserContext'; // UserContext의 사용
import defaultIconUrl from '../assets/img/icons/Default.jpg';
const IconContext = createContext();

export const useIcon = () => useContext(IconContext);

export const IconProvider = ({ children }) => {
  // 상태: 모든 아이콘 목록
  const [icons, setIcons] = useState([]);
  // 상태: 사용자가 보유한 아이콘 목록
  const [userIcons, setUserIcons] = useState([]);
  // UserContext에서 현재 로그인한 사용자의 데이터 가져오기
  const { userData } = useUser();

  // 사용자가 보유한 아이콘 목록을 서버에서 불러오는 함수
  const fetchUserIcons = async () => {
    // 사용자 데이터가 있고, 사용자 ID가 설정되어 있을 경우에만 실행
    if (userData && userData.id) {
      try {
        // 사용자 ID를 사용하여 서버에 사용자의 아이콘 목록 요청
        const response = await axios.get(`http://localhost:3001/api/user-icons/${userData.id}`);
        // 응답 데이터에 아이콘 목록이 존재하면 상태 업데이트
        if (response.data.length > 0) {
          setUserIcons(response.data);
        } else {
          // 사용자가 아이콘을 보유하지 않은 경우 기본 아이콘 설정
          const defaultIcon = {
            IconID: 'default',
            IconURL: defaultIconUrl,
            isCurrent: 1,
          };
          setUserIcons([defaultIcon]);
        }
      } catch (error) {
        // 요청 중 오류 발생 시 콘솔에 오류 메시지 출력
        console.error("Error fetching user icons:", error);
      }
    }
  };

  // 컴포넌트 마운트 시와 userData 변경 시 사용자 아이콘 목록 다시 불러오기
  useEffect(() => {
    fetchUserIcons();
  }, [userData]);

  // 현재 사용 중인 아이콘을 설정하는 함수
  const setCurrentIcon = async (iconId) => {
    try {
      // 선택한 아이콘 ID와 사용자 ID를 사용하여 서버에 현재 아이콘 설정 요청
      const response = await axios.post(`http://localhost:3001/api/user-icons/set-current/${userData.id}`, { iconId });

      // 요청이 성공하면, 로컬 상태(userIcons) 업데이트
      if (response.status === 200) {
        const updatedIcons = userIcons.map(icon => ({
          ...icon,
          isCurrent: icon.IconID === iconId ? 1 : 0 // 선택한 아이콘은 isCurrent를 1로, 나머지는 0으로 설정
        }));
        setUserIcons(updatedIcons);
      }
    } catch (error) {
      // 요청 중 오류 발생 시 콘솔에 오류 메시지 출력
      console.error("Error setting current icon:", error);
    }
  };

  // IconContext.Provider를 사용하여 상태와 함수를 자식 컴포넌트에 제공
  return (
    <IconContext.Provider value={{ icons, setIcons, userIcons, setCurrentIcon, fetchUserIcons }}>
      {children}
    </IconContext.Provider>
  );
};