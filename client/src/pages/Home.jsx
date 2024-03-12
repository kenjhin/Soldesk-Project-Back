import React, {  useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from '../contexts/UserContext';
// css
import "../styles/App.css";
// img
import storeIco from "../assets/img/home/nav-icon-store.png";
import inventoryIco from "../assets/img/home/nav-icon-collections.png";
import hamsterIcon from '../assets/img/hamster.jpg';
// pages
import Main from "./Main";
// components
import IconSetModal from '../components/modals/IconSetModal';
import MyInfoModal from '../components/modals/MyInfoModal';
import Messenger from "../components/Messenger";
import EditableText from "../components/EditableText";

function Home({setLogined}) {

    const boardNames = ['자유게시판', '인기게시판', '이슈게시판', '기념게시판', '신고게시판'];
    const navigate = useNavigate();
    const { userData, setUserData } = useUser(); // UserContext의 유저 데이터와 세터 함수 사용

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/userData', { withCredentials: true });
        if (response.data.success) {
          setUserData(response.data.user); // API 응답으로 받은 유저 데이터로 상태 업데이트
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
            <button className="storeBtn mouseover">
              <img src={storeIco} alt="" />
            </button>
          </div>
        </div>
        <div className="headerProfileBox">
          {userData && (
            <IconSetModal
              img={<img className="userIcon" src={userData.icon || hamsterIcon} alt="" />}
            />
          )}
          {userData && (
          <div className="nameBox">
            <p className="nickname">{userData.nickname}</p>
            <EditableText
              text={userData.profileMessage}
              onSave={(newMessage) => {
                setUserData({...userData, profileMessage: newMessage});
              }}
            />
          </div>
          )}
          <button className="logoutBtn" onClick={handleLogout}>
            logout
          </button>
        </div>
      </header>
      <main className="main">
        <Messenger />
        <Main />
      </main>
      <footer></footer>
    </div>
  );
}
export default Home;