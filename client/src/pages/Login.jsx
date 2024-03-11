/* eslint-disable */
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/Login.css";
import loginBanner from "../assets/img/login/login_banner.png";
import arrow from "../assets/img/login/arrow_right.png"
import riot_logo from "../assets/img/login/riot_logo.png"
import TextInput from "../components/TextInput.jsx"
import SignUpModal from "../components//modals/SignUpModal.jsx"
import SimpleSlider from "../components/SimpleSlider.jsx";

function Login() {
  const navigate = useNavigate();

  const [modalShow, setModalShow] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  function handleTextInputValueChange(value) {
    setUsername(value);
  }

  function handlePasswordChange(value) {
    setPassword(value);
  }

  const handleLoginClick = async () => {
    try {
      const response = await axios.post('http://localhost:3001/login', {
        username,
        password
      }, { withCredentials: true }); // 쿠키를 주고받기 위해 withCredentials 옵션 추가

      if (response.data.success) {
        // 로그인 성공: 리다이렉트 경로로 이동
        console.log('로그인 성공 Login.jsx')
        navigate(response.data.redirectPath || '/');
      } else {
        // 로그인 실패: 오류 메시지 처리
        alert(response.data.message);
      }
    } catch (error) {
      console.error('로그인 요청 실패:', error);
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="loginBody">
      <div className="loginArea">
        <img className="loginLogo" src={riot_logo} alt=""/>
        <div className="loginLoginText">로그인</div>
        <div className="loginInputArea"> 
          <TextInput label="계정이름" value={username} onInputChange={handleTextInputValueChange}/>
          <TextInput label="비밀번호" type="password" value={password} onInputChange={handlePasswordChange}/>
          <div className="idCheckboxContainer">
            <label className="idCheckLabel"><input className="idCheckbox" type="checkbox"/>로그인 상태 유지</label>
          </div>
        </div>
        <button className="loginBtnContainer" onClick={handleLoginClick}><img className="loginBtn" src={arrow} alt=""/></button>
        <button className="singUpBtn" onClick={() => setModalShow(true)}>계정 생성</button>
        <SignUpModal show={modalShow} onHide={() => setModalShow(false)}/>
      </div>
      <div className="loginBanner-container">
        <SimpleSlider/>
        {/* 배너 크기 1920x1080  높이*(4/3) */}
      </div>
    </div>
  )
}

export default Login;