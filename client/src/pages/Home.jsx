/* eslint-disable */
import React, {  useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from '../contexts/UserContext';
// css
import "../styles/App.css";
// img
import storeIco from "../assets/img/home/nav-icon-store.png";
import inventoryIco from "../assets/img/home/nav-icon-collections.png";
import RpIco from "../assets/img/icon-rp-24.png";
import RpIco2 from "../assets/img/icon-rp-gradient-32.png";
// user_icon
import icon_hamster from "../assets/img/icons/hamster.jpg";
import icon_challenger from "../assets/img/icons/challenger.jpg";
import icon_poro1 from "../assets/img/icons/poro1.png";
import icon_poro2 from "../assets/img/icons/poro2.jpg";
import icon_tomkenchi from "../assets/img/icons/탐켄띠.jpg";
import icon_default from "../assets/img/icons/Default.jpg";
import icon_latteArt from "../assets/img/icons/latteArt.png";
// pages
import Main from "./Main";
// components
import IconSetModal from '../components/modals/IconSetModal';
import MyInfoModal from '../components/modals/MyInfoModal';
import Messenger from "../components/Messenger";
import EditableText from "../components/EditableText";
import { useIcon } from "../contexts/IconContext";

function Home({setLogined}) {

  const boardNames = ['자유게시판', '인기게시판', '이슈게시판', '기념게시판', '신고게시판'];
  const navigate = useNavigate();
  const { userData, setUserData } = useUser(); // UserContext의 유저 데이터와 세터 함수 사용
  const { userIcons, setIcons } = useIcon();
  const currentIcon = userIcons.find(icon => icon.isCurrent === 1);

  useEffect(() => {
    setIcons([icon_default, icon_hamster, icon_challenger, icon_poro1, icon_poro2, icon_tomkenchi, icon_latteArt ]); 
  }, [setIcons]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/userData', { withCredentials: true });
        if (response.data.success) {
          setUserData(response.data.user); // API 응답으로 받은 유저 데이터로 상태 업데이트
          console.log(response.data)
        } else {
          console.log('유저 데이터 로드 실패');
        }
      } catch (error) {
        console.error('유저 데이터 로드 중 오류 발생:', error);
      }
    };
    fetchUserData();
  }, [setUserData]); // 의존성 배열에 setUserData 추가
  



  // 로그아웃 기능 임시 함수
  const handleLogout = async () => {
    console.log("로그아웃 시도");
    try {
      const response = await axios.post('http://localhost:3001/logout', {}, { withCredentials: true });
      if (response.data.success) {
        console.log("로그아웃 성공");
        setLogined(false);
        navigate('/login');
      }
    } catch (error) {
      console.error('로그아웃 요청 실패:', error);
    }
  };
  
  const handleEditSave = async (text) => {
    try {
      await axios.put(`http://localhost:3001/profileMessage`, {
        profileMessage: text,
        username: userData.username
      });
    } catch (error) {
      console.error('상태메시지 수정 중 오류 발생:', error);
    }
  };

  return (
    <div className="homeBody">
      <header className="header">
        <div className="headerBtnBox">
          <div className="leftBtnBox">
            <button className="noticeBtn mouseover">!</button>
            <Link to="/home">
              <button className="homeBtn mouseover">홈</button>
            </Link>
            {boardNames.map((boardName, index) => (
              <Link
                key={index + 1}
                to={`/board/${index + 1}`}
                state={{ boardId: index + 1 }}
              >
                <button className="boardBtn mouseover">{boardName}</button>
              </Link>
            ))}
          </div>
          <div className="rightBtnBox">
            <MyInfoModal data={userData} setData={setUserData} />
            <button className="inventoryBtn mouseover">
              <img src={inventoryIco} alt="" />
            </button>
            <Link to="/store">
            <button className="storeBtn mouseover">
              <img src={storeIco} alt="/store" />
            </button>     
            </Link>
          </div>
          <div className="RpBox">
            <div className="Rp-imgBox"><img src={RpIco2}/></div>
            <div className="RpBoxFont"><span>{userData?.point}</span></div>
          </div>
        </div>
        <div className="headerProfileBox">
        {userData && currentIcon && (
    <IconSetModal
      img={<img className="userIcon" src={currentIcon.IconURL} alt="현재 유저 아이콘" />}
    />
  )}
          {userData && (
          <div className="nameBox">
            <p className="nickname">{userData.nickname}</p>
            <EditableText
              text={userData.profile_message}
              onSave={(newMessage) => {
                handleEditSave(newMessage);
                setUserData({...userData, profile_message: newMessage});
              }}
            />
          </div>
          )}
          <button className="logoutBtn" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </header>
      <main className="main">
        <Messenger />
        <Main />
      </main>
    </div>
  );
}
export default Home;