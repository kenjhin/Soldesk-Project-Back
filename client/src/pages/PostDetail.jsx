/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import getCurrentDateTime from '../components/function/getCurrentDateTime';
import { useUser } from '../contexts/UserContext'; // 사용자 정보를 가져오는 컨텍스트
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const PostDetail = () => {
  const { userData } = useUser(); // 현재 로그인한 유저 정보 사용
  const textarea = useRef(); // 댓글 입력창 참조
  const location = useLocation(); 
  const navigate = useNavigate();
  const post = location.state?.post; 
  // 댓글 입력창 크기 자동 조절 함수
  const handleResizeHeight = () => {
    textarea.current.style.height = 'auto';
    textarea.current.style.height = textarea.current.scrollHeight + 'px';
  };

  // 댓글 등록 처리 함수
  const handleCommentSubmit = () => {
    // TODO: 댓글 등록 로직 구현
    // 예: DB에 댓글 데이터 등록 후, setComment를 사용해 상태 업데이트
    textarea.current.value = ''; // 댓글 입력창 초기화
  };


  const [comment, setComment] = useState([]); // 댓글 데이터 상태
  const [currentComment, setCurrentComment] = useState({ // 현재 작성 중인 댓글 상태
    id: '',
    postId: '',
    writer: '',
    content: '',
    date: ''
  });

  useEffect(() => {
    // TODO: DB에서 댓글 데이터 가져오기 및 상태 업데이트
  }, [comment]); // comment 상태가 변경될 때마다 실행





// 게시글 수정 로직

    const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태
    const [editedTitle, setEditedTitle] = useState(post?.title); // 수정된 제목
    const [editedContent, setEditedContent] = useState(post?.content); // 수정된 내용


// 1) 현재 로그인한 사용자가 게시글 작성자인지 확인
    const handleEdit = () => {
      
      if (userData && userData.nickname === post?.writer) {
        setIsEditing(true); // 수정 모드 활성화
      } else {
        alert('이 게시글의 작성자만 수정할 수 있습니다.');
      }
    };

// 2) 수정된 게시글 내용을 서버로 전송하는 로직    
    const handleEditSave = async () => {
      
      try {
        await axios.put(`http://localhost:3001/api/posts/${post?.post_id}`, {
          title: editedTitle,
          content: editedContent,
        });
        alert('게시글이 수정되었습니다.');
        setIsEditing(false); // 수정 모드 비활성화
        navigate(`/board/${post?.boardId}`); // 게시글 목록 페이지로 리다이렉트
      } catch (error) {
        console.error('게시글 수정 중 오류 발생:', error);
        alert('게시글 수정에 실패했습니다.');
      }
    };



// 수정 모드일 때의 뷰
    if (isEditing) {
    
      return (
        <div className='postBox'>
          <div className='post-header'>
            <h2 className='post-title'>
              <input
                className="titleInput"
                type='text'
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
            </h2>
          </div>
          <div className='post-body'>
            <p className='post-content'>
              <textarea
                className="contentTextarea" 
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
            </p>
          </div>
          <div className='post-footer'>
            <button className="saveButton" onClick={handleEditSave}>저장</button>
          </div>
        </div>
      );
    }

// 게시글 삭제 처리 함수
const handleDelete = async () => {
  if (window.confirm('게시글을 삭제하시겠습니까?')) {
    try {
      await axios.delete(`http://localhost:3001/api/posts/${post?.post_id}`);
      alert('게시글이 삭제되었습니다.');
      navigate(`/board/${post?.boardId}`); // 게시글 목록 페이지로 리다이렉트
    } catch (error) {
      console.error('게시글 삭제 중 오류 발생:', error);
      alert('게시글 삭제에 실패했습니다.');
    }
  }
};









  return (
    <div className='postBox'>
      <div className='post-header'>
        <h2 className='post-title'>{post?.title}</h2>
        <p className='post-writer'>{post?.writer}</p>
        <p className='post-date'>{post?.date}</p>
        <p className='post-views'>조회 {post?.views}</p>
      </div>
      <div className='post-body'>
        <p className='post-content'>{post?.content}</p>
      </div>
      <div className='post-footer'>
        <p className='post-like'>♡좋아요 {post?.like}</p>
        <p className='post-comment'>댓글 {comment.filter(data => data.postId === post?.id).length}</p>
        <div style={{flexBasis: '100%', borderBottom: '1px rgba(255,255,255, 0.2) solid', marginBottom: '20px'}}></div>
        
        
        <div className='commentBox'>
          <div className='comment-body' spellCheck="false">
            {/* 댓글 목록 출력 부분 */}
            {/* 현재 post의 id와 일치하는 댓글만 필터링하여 출력 */}
            {/* 댓글 데이터가 동적으로 처리되도록 구현 필요 */}
            <div className='comment-textarea-container'>
              <textarea ref={textarea} onInput={handleResizeHeight} placeholder='댓글을 남겨보세요.' />
              <div className='btnBox'>
                {userData && userData.nickname === post?.writer && (<>
                <button onClick={handleEdit}>수정</button>
                <button onClick={handleDelete}>삭제</button></>)}
                <button onClick={handleCommentSubmit}>등록</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;




// useEffect(() => {
//   console.log("현재 로그인한 사용자 ID:", userData?.nickname); // 현재 로그인한 사용자의 ID 출력
//   console.log("게시글 작성자 ID:", post?.writer); // 게시글 작성자의 ID 출력
// }, [userData, post]);