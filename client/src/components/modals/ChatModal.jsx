/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react'
import getCurrentDateTime from '../function/getCurrentDateTime';
import defaultIcon from "../../assets/img/hamster.jpg"
import axios from 'axios';
const ChatModal = ({onHide, myChat, setMyChat, chatTarget, setChatTarget, userData, setUserData, currentChat, setCurrentChat}) => {
  const scrollRef = useRef();
  const prevScrollHeight = useRef();
  // senderId나 receiverId가 내 아이디인 모든 채팅들이 시간별로 정리된 것
  

  useEffect(() => {
    // 채팅 스크롤 아래에서 시작
    // 현재 스크롤 위치 = 현재 스크롤 길이
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;

    // 친구리스트에서 친구 눌러서 채팅창 열었으면 해당 친구와의 채팅창 띄우기
    if(chatTarget){
      return;
    }

    // 가장 최근에 채팅한 사람 첫타겟으로 잡기
    // 최근 채팅한 상대방 내림차순으로
    const recentChat = myChat.reduce((recent, chat) => {
      if (
        (chat.sender_id === userData.nickname || chat.receiver_id === userData.nickname) &&
        (!recent || new Date(chat.date) > new Date(recent.date))
      ) {
        return chat;
      }
      return recent;
    }, null);
  
    // 찾은 상대방을 기본 타겟으로 설정
    if (recentChat) {
      setChatTarget(
        recentChat.sender_id === userData.nickname
          ? recentChat.receiver_id
          : recentChat.sender_id
      );
    }
  }, []);

  useEffect(() => {
    // 현재 채팅 목록에서 receiver_id 또는 senderId가 chatTarget과 일치하는 경우에만 스크롤 조절
    const shouldAdjustScroll = myChat.some(data => data.receiver_id === chatTarget || data.sender_id === chatTarget);
    if (shouldAdjustScroll) {
      // 현재 스크롤 높이
      const currentScrollHeight = scrollRef.current.scrollHeight;
      // 이전 스크롤 높이와 현재 스크롤 높이 비교
      if (prevScrollHeight.current !== currentScrollHeight) {
        // 스크롤 아래로 이동
        scrollRef.current.scrollTop = currentScrollHeight;
        // 이전 스크롤 높이 업데이트
        prevScrollHeight.current = currentScrollHeight;
      }
    }

  }, [myChat, chatTarget]);
  
// 1. senderId가 내 아이디인 채팅을 DB에서 싹 가져온다.
// 2. receiverId가 내 아이디인 채팅을 싹 가져온다.
// 3. 메시지들을 시간순으로 정렬
// 4. 반복문 돌려서 출력한다.

  // 채팅
  const ChatBox = ({action, content}) =>{
    return(
      <div className='chat-content-container'>
        <div className={`chat-content-${action}`}>
          <div>{content}</div>
        </div>
      </div>
  )}

  // 게시글 Post 요청
  const handleChatSend = async () => {
    if (!userData) {
        alert('로그인 세션이 만료되었습니다.');
        navigate('/login');
        return;
      }
  
    try {
      await axios.post(`http://localhost:3001/chat/send`, {
        senderId: userData.username,
        receiverId: chatTarget,
        content: currentChat.content,
      });
    } catch (error) {
      console.error('채팅 전송 오류:', error);
    }
  };
  
  const handleKeyDown = (e) => {
    // 엔터누를 때 + 공백방지
    if (e.key === 'Enter' && currentChat.content.trim() !== '') {
      e.preventDefault(); // 기본 엔터 동작 방지
      setCurrentChat({ 
        ...currentChat,
        content: '', 
      })
      setMyChat([...myChat, currentChat]);
      handleChatSend();
    } else if(!chatTarget){
      alert('채팅 상대를 선택해주세요.');
    }
  };
  
  return (
    <>
      <div className='chatModal'>
          <div className='chat-list-container'>
            {/* 나와 관련한 채팅만 나오게 조건 걸어뒀는데, DB에서 받아올 때 거를거임 */}
            {[...new Set(myChat.map(data => (data.receiver_id === userData.username ? data.sender_id : data.receiver_id)))]
            .map((friendId, i) => (
              <div key={i} className='chat-list' onClick={() => { setChatTarget(friendId) }}>
              <div className='chat-friend-icon'>
                {/* chat.senderId와 chat.receiver_id 중에 내 id와 다른 id의 아이콘 출력 */}
                <img src={defaultIcon} alt='' />
              </div>
              <div className='chat-info'>
                <span className='chat-friend-nickname'>
                  {/* 상대방 아이디 출력 : chat.senderId와 chat.receiver_id 중에 내 id와 다른 아이디 출력 */}
                  {friendId}
                </span>
                <span className='chat-friend-content'>
                  {/* 최근 채팅 한줄만 출력 */}
                  {myChat.filter(data => (data.receiver_id === userData.username && data.sender_id === friendId) || (data.sender_id === userData.username && data.receiver_id === friendId))
                    .sort((a, b) => new Date(b.date) - new Date(a.date)).reverse()[0]?.content}
                </span>
              </div>
            </div>

            ))}
          </div>
          <div className='chat-container'>
            <div className='chat-header'>
              <div className='chat-friend'>
                <div className='chat-friend-icon'>
                  {/* chat.senderId와 chat.receiverId중에 내 id와 다른 것의 아이콘 출력 */}
                  <img src={defaultIcon} alt=''/>
                </div>
                <span className='chat-friend-nickname'>
                  {/* chat.senderId와 chat.receiverId중에 내 id와 다른 것 출력 */}
                  {chatTarget}
                </span>
                <button className='chat-closeBtn' onClick={onHide}>ㅡ</button>
              </div>
            </div>
            <div className='chat-content' ref={scrollRef}>
              {/* chat.senderId가 내 id랑 같으면 채팅출력. 시간이 최근것부터 위에서*/}
              <div className='blank'/>
              {myChat.map((data, i)=>(
                (chatTarget ? (data.sender_id === chatTarget || data.receiver_id === chatTarget) : false) &&
                <ChatBox key={i} action={data.sender_id===userData.username?'send':'receive'} content={data.content}/>
              ))}
            </div>
            <div className='chat-textarea-container'>
              <textarea value={currentChat.content} onInput={(e) => chatTarget && setCurrentChat({ sender_id: userData.username, receiver_id: chatTarget, content: e.target.value })} 
                        onKeyDown={handleKeyDown} placeholder='메시지를 입력하세요.'/>
            </div>
          </div>
      </div>
    </>
  )
}

export default ChatModal