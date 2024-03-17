/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import getCurrentDateTime from '../components/function/getCurrentDateTime';
import { useUser } from '../contexts/UserContext'; // 사용자 정보를 가져오는 컨텍스트
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import formatDate from '../components/function/formatDate';
import '../styles/Post.css'
import '../styles/PostDetail.css'




const PostDetail = () => {
  const { userData } = useUser(); // 현재 로그인한 유저 정보 사용
  const textarea = useRef(); // 댓글 입력창 참조
  const location = useLocation();
  const navigate = useNavigate();
  const post = location.state?.post;


  // 조회수증가
  useEffect(() => {
    const updatePostViews = async () => {
      try {
        await axios.put(`http://localhost:3001/api/posts/${post?.id}`, {
          title: post.title, 
          content: post.content, 
          views: post.views + 1 
        });
      } catch (error) {
          console.error('조회수 업데이트 중 오류 발생:', error);
      }
    };
    
    updatePostViews();
}, [post]);





  useEffect(() => {
    console.log("PostDetail 컴포넌트 마운트됨. post 객체:", post);
  }, [post]);
  

  // 댓글 입력창 크기 자동 조절 함수
  const handleResizeHeight = () => {
    textarea.current.style.height = "auto";
    textarea.current.style.height = textarea.current.scrollHeight + "px";
  };


  // 댓글 추가
  const handleCommentSubmit = async () => {
    if (!commentContent.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    
    try {
      // 댓글 생성 API 호출
      await axios.post(`http://localhost:3001/api/posts/${post.id}/comments`, {
        writer: userData.username, 
        content: commentContent,
        board_id: post.board_id,
      });
  
      // 댓글 목록을 다시 불러옵니다. (댓글 목록 갱신)
      fetchComments();
  
      // 입력 필드 초기화
      setCommentContent("");
    } catch (error) {
      console.error("댓글 등록 중 오류 발생:", error);
      alert("댓글을 등록하지 못했습니다.");
    }
  };

  const [commentContent, setCommentContent] = useState(""); // 댓글 내용을 저장할 상태 추가
  const [comment, setComment] = useState([]); // 댓글 데이터 상태
  const [currentComment, setCurrentComment] = useState({
    // 현재 작성 중인 댓글 상태
    id: "",
    postId: "",
    writer: "",
    content: "",
    date: "",
  });

  // 댓글 목록을 불러오는 함수
  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/posts/${post.id}/comments`
      );
      console.log(response.data); // 응답 확인
      setComment(response.data); // 가져온 댓글 데이터로 상태 업데이트
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [post.id, fetchComments]); // post.id가 변경될 때마다 댓글 목록을 다시 불러옵니다.

  // 게시글 수정 로직
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태
  const [editedTitle, setEditedTitle] = useState(post?.title); // 수정된 제목
  const [editedContent, setEditedContent] = useState(post?.content); // 수정된 내용

  // 1) 현재 로그인한 사용자가 게시글 작성자인지 확인
  const handleEdit = () => {
    if (userData && userData.nickname === post?.writer) {
      setIsEditing(true); // 수정 모드 활성화
    } else {
      alert("이 게시글의 작성자만 수정할 수 있습니다.");
    }
  };

  // 2) 수정된 게시글 내용을 서버로 전송하는 로직
  const handleEditSave = async () => {
  try {
    await axios.put(`http://localhost:3001/api/posts/${post?.id}`, {
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
      <div className='writeBox'>
        <div className='write-header'>
          <h2 className='write-title'>글 수정</h2>
        </div>
        <div className='write-body'>
          <input
            type='text'
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder='제목을 입력해주세요.'
          />
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder='내용을 입력해주세요.'
          />
        </div>
        <div className='write-footer'>
          <div className='btnBox'>
            <button className="saveButton" onClick={handleEditSave}>저장</button>
          </div>
        </div>
      </div>
    );
  }

  // 게시글 삭제 처리 함수
  const handleDelete = async () => {
    if (window.confirm("게시글을 삭제하시겠습니까?")) {
      try {
        await axios.delete(`http://localhost:3001/api/posts/${post?.id}`);
        alert('게시글이 삭제되었습니다.');
        navigate(`/board/${post?.boardId}`); // 게시글 목록 페이지로 리다이렉트
      } catch (error) {
        console.error("게시글 삭제 중 오류 발생:", error);
        alert("게시글 삭제에 실패했습니다.");
      }
    }
  };

// 댓글 삭제
const deleteComment = async (commentId) => {
  // 사용자에게 삭제를 확인
  const isConfirmed = window.confirm('댓글을 정말 삭제하시겠습니까?');

  if (isConfirmed) {
    try {
      await axios.delete(`http://localhost:3001/api/comments/${commentId}`);
      fetchComments(); // 댓글 목록 갱신
      alert("댓글이 삭제되었습니다.");
    } catch (error) {
      console.error("댓글 삭제 중 오류 발생:", error);
      alert("댓글 삭제에 실패했습니다.");
    }
  }
};

// 댓글 수정 함수
const editComment = async (commentId) => {
  const newContent = prompt("댓글을 수정하세요:");
  if (newContent) {
    try {
      await axios.put(`http://localhost:3001/api/comments/${commentId}`, {
        content: newContent,
      });
      fetchComments(); // 댓글 목록 갱신
      alert("댓글이 수정되었습니다.");
    } catch (error) {
      console.error("댓글 수정 중 오류 발생:", error);
      alert("댓글 수정에 실패했습니다.");
    }
  }
};


  ////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////
  const handleClickLikes = () => {
    const like = post.likes + 1;
    setPost({...post, likes: like});
    handleUpdateLikes(like);
  }

  const handleUpdateLikes = async (like) => {
    try {
      await axios.put(`http://localhost:3001/api/posts/${post?.id}`, {
        likes: like
      });
    } catch (error) {
        console.error('좋아요 수정 오류 발생:', error);
    }
  };
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className="postBox">
      <div className="post-header">
        <h2 className="post-title">{post?.title}</h2>
        <p className="post-writer">{post?.writer}</p>
        <p className="post-date">{formatDate(post.created_at, "post")}</p>
        <p className="post-views">조회 {post?.views}</p>
      </div>
      <div className="post-body">
        <p className="post-content">{post?.content}</p>
      </div>
      <div className="post-footer">
        <p className="post-like">♡좋아요 {post?.like}</p>
        <p className="post-comment">
          댓글 {comment.filter((data) => data.postId === post?.id).length}
        </p>
        <div
          style={{
            flexBasis: "100%",
            borderBottom: "1px rgba(255,255,255, 0.2) solid",
            marginBottom: "20px",
          }}
        ></div>

        <div className="commentBox">
          <div className="comment-body" spellCheck="false">
            {/* 댓글 목록 출력 부분 */}
            {/* 현재 post의 id와 일치하는 댓글만 필터링하여 출력 */}
            {/* 댓글 데이터가 동적으로 처리되도록 구현 필요 */}
            <div className="comments">
              {comment.map((cmt) => (
                <div key={cmt.comment_id} className="comment">
                  <h4 className="comment-writer">{cmt.writer}</h4>
                  <p>{cmt.content}</p>
                  <small className="comment-date">{new Date(cmt.created_ad).toLocaleString()}</small>
                  {userData.username === cmt.writer && (
                    <>
                      <button onClick={() => editComment(cmt.comment_id)} className="comment-edit">수정</button>
                      <button onClick={() => deleteComment(cmt.comment_id)} className="comment-delete">삭제</button>
                    </>
                  )}
                </div>
              ))}
            </div>
            {/* 댓글 데이터처리 */}
            <div className="comment-textarea-container">
              <textarea
                ref={textarea}
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                onInput={handleResizeHeight}
                placeholder="댓글을 남겨보세요."
              />
              <div className="btnBox">
                <button className="board-btn" onClick={handleCommentSubmit}>
                  등록
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-btn-container">
          {userData && userData.nickname === post?.writer && (
            <>
              <button className="board-btn" onClick={handleEdit}>
                수정
              </button>
              <button className="board-btn" onClick={handleDelete}>
                삭제
              </button>
            </>
          )}
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
