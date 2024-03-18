import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/App.css';
import '../styles/Main.css';
import formatDate from '../components/function/formatDate';

const Board = () => {
  const location = useLocation();
  const boardId = location.state?.boardId;
  const boardNames = ['자유게시판', '인기게시판', '이슈게시판', '기념게시판', '신고게시판'];
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(20);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/posts/list?boardId=${boardId}`);
        const data = await response.json();
        setData(data); // 데이터가 배열 형태인지 확인 후 상태 업데이트
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [boardId]);

  const totalPages = Math.ceil(data.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  // 데이터가 배열인 경우에만 slice 사용
  const currentPosts = Array.isArray(data) ? data.slice(indexOfFirstPost, indexOfLastPost) : [];

  return (
    <div style={{ width: "100%", height: "100%", paddingRight: "50px", paddingLeft: "50px", overflow: "scroll", display: "flex", justifyContent: "center" }}>
      <div>
        <h2 style={{ color: "white", marginTop: "20px", marginBottom: "20px", fontSize: "32px", fontWeight: 'bold' }}>
          {boardNames[boardId - 1]}
        </h2>
        <table className="boardTable">
          <thead>
            <tr>
              <th className="th_id">번호</th>
              <th className="th_title">제목</th>
              <th className="th_writer">작성자</th>
              <th className="th_date">작성일</th>
              <th className="th_views">조회수</th>
              <th className="th_like">좋아요</th>
            </tr>
          </thead>
          <tbody> 
          {currentPosts.map((post, index) => (
            <tr key={index}>
            {console.log(boardId)}
            {console.log(post)}
              <td className="td_id">{index + 1}</td> 
              <td className="td_title">
              <Link to={`/board/${post.boardId}/${post.id}`} state={{ post }}>
                {post.title}
              </Link>
              </td>
              <td className="td_writer">{post.writer}</td>
              <td className="td_date">{formatDate(post.created_at, 'postList')}</td>
              <td className="td_views">{post.views}</td>
              <td className="td_like">{post.likes}</td>
            </tr>
          ))}
          </tbody>
        </table>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: '10px'}}>
          <Link to={`/board/${boardId}/post`} state={{ boardId }}>
            <button className='board-btn'>글쓰기</button>
          </Link>
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button key={index + 1} onClick={() => paginate(index + 1)} style={{ margin: "0 5px", border: 'white solid 1px', background: 'none', color: 'white' }}>
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Board;