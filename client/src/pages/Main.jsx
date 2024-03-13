/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { Routes, Route } from "react-router-dom";
import "../styles/Main.css";
import logo from "../assets/img/login/login_banner.png"
import Board from './Board';
import PostDetail from './PostDetail';
import Post from './Post';
import Slider from 'react-slick';
import SimpleSlider from '../components/SimpleSlider';
import Store from './Store';

const Main = () => {
  const [posts, setPosts] = useState();

  useEffect(() => {
    // DB 게시글 파일들 받아오기
    setPosts();
  }, []); // 처음 화면 떴을 때 실행

  return (
    <div className="mainBody">
      <Routes>
        <Route
          path="*"
          element={
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <div className="slide-container">
                <SimpleSlider/>
              </div>
              <div className="hotPostBox" style={{ color: "white" }}>
                <div className='host-post'>
                  <p>좋아요 1등글</p>
                  <p>대충 맨 위 제목 그 아래 내용</p>
                </div>
                <div className='host-post'>
                  <p>좋아요 2등글</p>
                </div>
                <div className='host-post'>
                  <p>좋아요 3등글</p>
                </div>
              </div>
            </div>
          }
        />
        <Route path={`/board/:boardId/*`} element={<Board/>}/>
        <Route path={`/board/:boardId/:postId`} element={<PostDetail/>}/>
        <Route path={`/board/:boardId/post`} element={<Post/>}/>
        <Route path={`/Store`} element={<Store/>}/>
      </Routes>
    </div>
  );
}

export default Main