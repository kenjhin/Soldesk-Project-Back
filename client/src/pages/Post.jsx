/* eslint-disable */
import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const Post = () => {
  const textarea = useRef();
  const location = useLocation();
  const boardId = location.state?.boardId; 
  const [postData, setPostData] = useState({
    boardId: '',
    id: '',
    title: '',
    content: '',
    writer: '',
    date: '',
    views: 0,
    like: 0,
  });

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = String(now.getFullYear()).slice(2);
    const month = String(now.getMonth() + 1).padStart(2, '0'); 
    const day = String(now.getDate()).padStart(2, '0'); 
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
  
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  const handleResizeHeight = () => {
    textarea.current.style.height = 'auto'; //height 초기화
    textarea.current.style.height = textarea.current.scrollHeight + 'px';
  };

  const handlePostSubmit = () => {
    // 데이터 취합
    setPostData({
      ...postData,
      boardId: boardId,
      id: '',
      writer: '',
      date: getCurrentDateTime(),
      views: 0,
      like: 0,
    })

    // DB로 현재 데이터 보내기
    //

    // 글쓰기 데이터 초기화
    setPostData({
      boardId: '',
      id: '',
      title: '',
      content: '',
      writer: '',
      date: '',
      views: 0,
      like: 0,
    });

    // textarea 초기화 (setPostData에서 초기화시켜서 필요없음)
    // textarea.current.value = '';

    // home으로 navigate해주면될듯
  }

  return (
    <div className='writeBox'>
      <div className='write-header'> 
        <h2 className='write-title'>글쓰기</h2>
      </div>
      <div className='write-body'>
        <input 
          type='text' 
          value={postData.title} 
          placeholder='제목을 입력해주세요.'
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
        />
        <textarea 
          ref={textarea} 
          value={postData.content} 
          placeholder='내용을 입력해주세요.'
          onChange={(e) => setPostData({ ...postData, content: e.target.value })}
          onInput={handleResizeHeight}
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