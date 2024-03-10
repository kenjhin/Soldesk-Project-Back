import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// css
import "../styles/App.css";
// img
import storeIco from "../assets/img/home/nav-icon-store.png";
import inventoryIco from "../assets/img/home/nav-icon-collections.png";
import hamster from "../assets/img/hamster.jpg";
// pages
import Main from "./Main";
// components
import IconSetModal from '../components/modals/IconSetModal';
import MyInfoModal from '../components/modals/MyInfoModal';
import Messenger from "../components/Messenger";

function Home({setLogined}) {

    const boardNames = ['자유게시판', '인기게시판', '이슈게시판', '기념게시판', '신고게시판'];
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    address: {
      zonecode: '',
      fullAddress: '',
      detailAddress: ''
    }
  });
  

 // 유저 데이터 불러오기
 useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/userData', { withCredentials: true });
        if (response.data.success) {
          // 유저 데이터 세팅
          setUserData(prevState => ({
            ...prevState,
            ...response.data.user,
            icon: response.data.user.icon || hamster, // 예시로 hamster를 기본값으로 설정했습니다. 실제로는 서버에서 받아온 아이콘 URL을 사용해야 합니다.
          }));
        } else {
          // 유저 데이터 로드 실패 시 처리
          console.log('유저 데이터 로드 실패');
        }
      } catch (error) {
        console.error('유저 데이터 로드 중 오류 발생:', error);
      }
    };

    fetchUserData();
  }, []); // 빈 배열을 전달하여 컴포넌트 마운트 시 한 번만 실행되도록 합니다.
  


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
          {/* hamster에 현재 로그인한 계정의 아이콘 받아오기 */}
          <IconSetModal
            img={<img className="userIcon" src={userData.icon} alt="" />}
          />
          <div className="nameBox">
            <p className="nickname">{userData.name}</p>
            <p className="profileMessage">"{userData.profileMessage}"</p>
          </div>
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