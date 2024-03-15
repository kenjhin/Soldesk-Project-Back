/* eslint-disable */
import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { UserProvider } from './contexts/UserContext';
import { IconProvider } from "./contexts/IconContext";
// css
import "./styles/App.css";
// img
import hamster from "./assets/img/hamster.jpg";
// pages
import Login from "./pages/Login";
import Home from "./pages/Home";

// components

function App() {
  const [logined, setLogined] = useState(false);
  const navigate = useNavigate();

  // 로그인 체크
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('http://localhost:3001/checkSession', { withCredentials: true });
        if (response.data.success) {
          setLogined(true);
          // 현재 경로가 로그인 페이지나 루트 경로일 때만 /home으로 리다이렉트
          if (window.location.pathname === '/login' || window.location.pathname === '/') {
            navigate('/home');
          }
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('세션 확인 요청 실패:', error);
        navigate('/login');
      }
    };
  
    checkSession();
  },[navigate]);





  return (
    <UserProvider>
      <IconProvider>
        <Routes>
          <Route path="/login" element={<Login setLogined={setLogined} />} />
          <Route path="*" element={logined ? <Home setLogined={setLogined} /> : <Navigate to="/login" replace />} />
          {/* {/* 기본 경로 설정 */}
          <Route path="/" element={<Navigate to={logined ? "/home" : "/login"} replace />} />
        </Routes>
      </IconProvider>
    </UserProvider>

  );
}

export default App;