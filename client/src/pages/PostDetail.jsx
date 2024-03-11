/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import getCurrentDateTime from '../components/function/getCurrentDateTime';

const PostDetail = () => {
    const textarea = useRef();
    const location = useLocation();

    const post = location.state?.post;
    const [comment, setComment] = useState([{
      id: 1,
      postId: 1, 
      writer: '김관무',
      content: '동해물과',
      date: '24.03.05 08.00'
    },{
      id: 2,
      postId: 2, 
      writer: '틀딱딱',
      content: '동해물백백과',
      date: '24.03.05 08.03'
    },{
      id: 3,
      postId: 2, 
      writer: 'asd',
      content: '윗댓특) ㅄ임ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd',
      date: '24.03.05 09.11'
    }]);
    const [currentComment, setCurrentComment] = useState({
      id: '',
      postId: '',
      writer: '',
      content: '',
      date: ''
    })
    const [userData, setUserData] = useState([{}]);

    useEffect(() => {
      // setComment(DB);
      // DB데이터 comment에 최신화
    }, [comment])

    // 댓글 textarea크기조절
    const handleResizeHeight = () => {
      textarea.current.style.height = 'auto'; //height 초기화
      textarea.current.style.height = textarea.current.scrollHeight + 'px';
    };

    const handleCommentSubmit = () => {
      console.log(textarea.current.value);
      // db에 댓글등록
      // 

      // 일단 currentComment state에 등록
      const newComment = {
        ...currentComment,
        id: comment.length + 1,
        postId: post.id,
        writer: '현재 접속중인 아이디',
        content: textarea.current.value,
        date: getCurrentDateTime(),
      };

      setComment((prevComment) => [...prevComment, newComment]);
      
      // currentComment 초기화
      setCurrentComment({
        id: '',
        postId: '',
        writer: '',
        content: '',
        date: '',
      });

      // 댓글 입력창 초기화
      textarea.current.value = '';
    }

    return (
      <div className='postBox' >
        <div className='post-header'> 
         <h2 className='post-title' >{post.title}</h2>
          <p className='post-writer' >{post.writer}</p>
          {/* 날짜 + 시간데이터,  */}
          <p className='post-date' >{post.date}</p>
          <p className='post-views' >조회 {post.views}</p>
        </div>
        <div className='post-body'>
          <p className='post-content' >{post.content}</p>
        </div>
        <div className='post-footer'>
          {/*post테이블에 해당 게시글 좋아요 
          누른 사람 id목록 받아와서 확인하고 눌렀으면 꽉 찬 하트*/}
          <p className='post-like' >♡좋아요 {post.like} </p>
          {/* comment테이블에서 현재 post의 postId랑 같은 것 */}
          <p className='post-comment' >댓글 {comment.filter(data => data.postId === post.id).length} </p>
          <div style={{flexBasis: '100%', borderBottom: '1px rgba(255,255,255, 0.2) solid', marginBottom: '20px'}}></div>
          <div className='commentBox'>
            <div className='comment-body' spellCheck="false">
              <p style={{flexBasis: '100%'}}>댓글</p>

              {/* 아래 comment대신 새 state만들고 */}
              {/* 게시글 post.id와 comment.postId를 비교하여 같은 것들만 출력*/}
              {comment.map((data) => (
                data.postId === post.id && (
                  <div key={data.id} style={{display: 'flex', flexWrap: 'wrap', flexBasis: '100%', 
                  borderBottom: '1px rgba(255,255,255, 0.2) solid', marginBottom: '20px'}}>
                  <div style={{display: 'flex', flexBasis: '100%'}}>
                    {/* 아이콘 */}
                    <div style={{margin: '0px', width: '40px', height: '40px', border: 'white solid 1px',
                                borderRadius: '50%', marginRight: '8px'}}></div>
                    <div style={{display: 'flex', flexWrap: 'wrap', flexBasis: '100%'}}> 
                      <p style={{flexBasis: '100%', margin: '0px', fontWeight: 'bold'}}>{data.writer}</p>
                      <p style={{flexBasis: '100%', margin: '0px', fontSize: '15px', wordBreak: 'break-all'}}>{data.content}</p>
                      <div style={{display: 'flex', flexBasis: '100%'}}>
                        <p style={{fontSize: '12px', opacity: '0.5', marginRight: '10px'}}>{data.date}</p>
                        <p style={{fontSize: '12px', opacity: '0.5'}} onClick={() => {}}>답글쓰기</p>
                      </div>
                    </div>
                  {/* 내 id와 댓글의 writer가 같으면 */}
                  {/* <p onClick={() => {}}>수정</p><p onClick={() => {}}>삭제</p> */}
                  </div>
                </div>
                )
              ))}
              <div className='comment-textarea-container'>
                <p>아이디</p>
                <textarea ref={textarea} onInput={handleResizeHeight} placeholder='댓글을 남겨보세요.'/>
                <div className='btnBox'>
                  <button onClick={handleCommentSubmit}>등록</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  };

export default PostDetail