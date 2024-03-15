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
import IconStoreManager from './admin/IconStoreManager';


const Main = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/posts/likes');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('게시글 가져오기 실패:', error);
      }
    };

    fetchPosts();
  }, []);

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
                {posts.slice(0, 3).map((post, index) => ( 
                  <div key={post.id} className='host-post'>
                    <p>{`${index + 1}등글: ${post.title}`}</p>
                    <p>{post.content}</p>
                  </div>
                ))}
              </div>
            </div>
          }
        />
        <Route path={`/board/:boardId/*`} element={<Board/>}/>
        <Route path={`/board/:boardId/:postId`} element={<PostDetail/>}/>
        <Route path={`/board/:boardId/post`} element={<Post/>}/>
        <Route path={`/Store`} element={<Store/>}/>
        <Route path={`//icon-store-manager`} element={<IconStoreManager/>}/>
      </Routes>
    </div>
  );
}

export default Main;