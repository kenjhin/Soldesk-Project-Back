/* eslint-disable */
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext'; // UserContext 유저 데이터 받아옴.

const Post = () => {
  const { userData } = useUser(); // 현재 로그인한 유저 정보 사용
  const navigate = useNavigate();
  const location = useLocation();
  const boardId = location.state?.boardId; // 게시판 아이디 가져오기
  const [title, setTitle] = useState('');   // POST 요청을 위한 스테이트
  const [content, setContent] = useState('');
  const textareaRef = useRef(null); // textarea를 위한 ref

  // 텍스트 영역의 높이를 내용에 따라 자동으로 조절
  const handleResizeHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // 높이 초기화
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // 스크롤 높이로 설정
    }
  };

  // 게시글 Post 요청
 const handlePostSubmit = async () => {
   
  if (!userData) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
  
    try {
      await axios.post(`http://localhost:3001/api/posts`, {
        title,
        content,
        boardId,
        writerId: userData.username, // writer 대신 writerId를 사용하여 현재 로그인한 사용자의 ID 전송
      });
  
      alert('게시글이 작성되었습니다.');
      // 임시로 navigate 지정해놓음 일단.
      navigate(`/board/${boardId}`);
    } catch (error) {
      console.error('게시글 작성 중 오류 발생:', error);
      alert('게시글 작성에 실패했습니다.');
  }
};

  return (
    <div className='writeBox'>
      <div className='write-header'>
        <h2 className='write-title'>글쓰기</h2>
      </div>
      <div className='write-body'>
        <input
          type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='제목을 입력해주세요.'
        />
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onInput={handleResizeHeight}
          placeholder='내용을 입력해주세요.'
        />
      </div>
      <div className='write-footer'>
        <div className='btnBox'>
          <button onClick={handlePostSubmit}>글쓰기</button>
        </div>
      </div>
    </div>
  );
};

export default Post;