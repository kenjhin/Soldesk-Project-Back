import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/App.css';
import '../styles/Main.css';

const Board = () => {
  const location = useLocation();
  const boardId = location.state?.boardId;
  const boardNames = ['자유게시판', '인기게시판', '이슈게시판', '기념게시판', '신고게시판'];
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(20);
  // 컴포넌트 마운트 시 게시물 리스트 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/posts/list?boardId=${boardId}`);
        const data = await response.json();
        setData(data); // 가져온 데이터로 posts 상태 업데이트
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [boardId]); // boardId가 변경될 때마다 fetchData 함수 실행

  // 페이지 변경 함수
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(data.length / postsPerPage);

  // 현재 페이지에서 보여줄 포스트 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = data.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div style={{ width: "100%", height: "100%", paddingRight: "50px", paddingLeft: "50px", overflow: "scroll", display: "flex", justifyContent: "center" }}>
      <div>
        <h2 style={{ color: "white", marginTop: "20px", marginBottom: "20px", fontSize: "32px", fontWeight: 'bold' }}>
          {boardNames[boardId - 1]}
        </h2>
        {data.length > 0 ? (
          <table className="boardTable">
            <thead>
              <tr>
                <th className="th_id">번호</th>
                <th className="th_title">제목</th>
                <th className="th_writer">작성자</th>
                <th className="th_date">작성일</th>
                <th className="th_views">조회수</th>
                <th className="th_like">추천</th>
              </tr>
            </thead>
            <tbody> 
            {currentPosts.map((post, index) => (
              <tr key={index}>
                {/* 게시글 번호를 순서대로 표시 */}
                <td className="td_id">{index + 1}</td> 
                <td className="td_title">
                  {/* 게시판 URL 링크 로직 설정. */}
                   {/* 순서번호(index)를 URL에 사용하였습니당 */}
                   {/* 즉 board는 각각 5개의 게시판으로 나뉘고 boardID에 정의된 수에 따라
                    게시판별로 분류 후 각각 타이틀의 링크를 게시판변로 분류된 index 순서대로
                    링크를 부여.. 제가 설명해도 이게 무슨말인지 모르겠네
                    코드를 보시는게 더 빠를겁니다! ㅎㅎ... 이렇게 링크 설정했어요~
                   */}
                  <Link to={`/board/${boardId}/${index + 1}`} state={{ post }}>
                    {post.title}
                  </Link>
                </td>
                <td className="td_writer">{post.writer}</td>
                <td className="td_date">{post.created_at}</td>
                <td className="td_views">{post.views}</td>
                <td className="td_like">{post.likes}</td>
              </tr>
            ))}
          </tbody>
          </table>
        ) : (
          <p >게시글이 없습니다.</p>
        )}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Link to={`/board/${boardId}/post`} state={{ boardId }}>
            <button style={{ marginTop: '10px', border: 'none', color: 'white' }}>글쓰기</button>
          </Link>
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button key={index + 1} onClick={() => paginate(index + 1)} style={{ margin: "0 5px" }}>
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Board;