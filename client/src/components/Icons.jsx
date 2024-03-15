 /* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useIcon } from '../contexts/IconContext';
import "../styles/App.css";
import { useUser } from '../contexts/UserContext';
import axios from 'axios';

const Icons = () => {
  const { icons, setIcons } = useIcon([]);
  const { userData, setUserData } = useUser();
  const [filteredIcons, setFilteredIcons] = useState([]);

  useEffect(() => {
    // userData.owned_icon이 존재하면 실행
    if (userData.owned_icon && icons.length > 0) {
      const filteredIcons = userData.owned_icon.map((number) => icons[number]);
      setFilteredIcons(filteredIcons);
    }
  }, [userData.owned_icon, icons]);


  const handleOnClick = (icon) => {
    const index = icons.findIndex((item) => item === icon);
    setUserData({ ...userData, current_icon: index });
    handleIconSet(index);
  };

  const handleIconSet = async (index) => {
    try {
      await axios.put(`http://localhost:3001/icon/set`, {
        currentIcon: index,
        username: userData.username
      });
    } catch (error) {
      console.error('아이콘 전송 오류:', error);
    }
  };

  return (
    <>
      {filteredIcons.map((icon, i) => (
        <div key={i} className='iconsBox' onClick={() => (handleOnClick(icon))}>
            <img src={icon} alt='' />
        </div>
      ))}
    </>
  );
};

export default Icons;