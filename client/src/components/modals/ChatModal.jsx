/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios';

const ChatModal = ({onHide, myChat, setMyChat, chatTarget, setChatTarget, userData, setUserData, 
                    currentChat, setCurrentChat, icons, userFriends}) => {
  const scrollRef = useRef();
  const prevScrollHeight = useRef();

  // chat버튼으로 열었을 때 채팅 스크롤 및 최근 chatTarget 설정
  useEffect(() => {
    // 채팅 스크롤 아래에서 시작
    // 현재 스크롤 위치 = 현재 스크롤 길이
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;

    // 친구리스트에서 친구 눌러서 채팅창 열었으면 해당 친구와의 채팅창 띄우기
    if(chatTarget.friend_id){
      return;
    }

    // 가장 최근에 채팅한 사람 첫타겟으로 잡기
    // 최근 채팅한 상대방 내림차순으로
    const recentChat = myChat.reduce((recent, chat) => {
      if (
        (chat.sender_id === userData.username || chat.receiver_id === userData.username) &&
        (!recent || new Date(chat.created_at) > new Date(recent.created_at))
      ) {
        return chat;
      }
      return recent;
    }, null);
  
    // 찾은 상대방을 기본 타겟으로 설정
    if (recentChat) {
      const recentChatTarget = recentChat.sender_id === userData.username
        ? recentChat.receiver_id
        : recentChat.sender_id;

      setChatTarget(userFriends.filter((data) => data.friend_id===recentChatTarget)[0]);
      console.log(recentChat);
    }
  }, []);

  // 친구 리스트에서 눌러서 열었을 때 채팅 스크롤 설정
  useEffect(() => {
    // 현재 채팅 목록에서 receiver_id 또는 senderId가 chatTarget과 일치하는 경우에만 스크롤 조절
    const shouldAdjustScroll = myChat.some(data => data.receiver_id === chatTarget.friend_id || data.sender_id === chatTarget.friend_id);
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

  // 채팅 Box
  const ChatBox = ({action, content}) =>{
    return(
      <div className='chat-content-container'>
        <div className={`chat-content-${action}`}>
          <div>{content}</div>
        </div>
      </div>
  )}

  // 채팅 post 보내기
  const handleChatSend = async () => {
    if (!userData) {
        alert('로그인 세션이 만료되었습니다.');
        navigate('/login');
        return;
      }
  
    try {
      await axios.post(`http://localhost:3001/chat/send`, {
        senderId: userData.username,
        receiverId: chatTarget.friend_id,
        content: currentChat.content,
      });
    } catch (error) {
      console.error('채팅 전송 오류:', error);
    }
  };
  
  // 채팅창 엔터누를 때
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
    } else if(!chatTarget.friend_id){
      alert('채팅 상대를 선택해주세요.');
    }
  };
  
  // 채팅 리스트 최근 채팅순 정렬
  const sortedFriends = [...new Set(myChat.map(data => (data.receiver_id === userData.username ? data.sender_id : data.receiver_id)))]
  .map((friendId, i) => ({
    friendId,
    latestMessageTime: Math.max(
      ...myChat
        .filter(data => (data.receiver_id === userData.username && data.sender_id === friendId) || (data.sender_id === userData.username && data.receiver_id === friendId))
        .map(data => new Date(data.created_at).getTime())
    )
  }))
  .sort((a, b) => b.latestMessageTime - a.latestMessageTime);

  return (
    <>
       <div className='chatModal'>
          <div className='chat-list-container'>
            {/* 나와 관련한 채팅만 나오게 조건 걸어뒀는데, DB에서 받아올 때 거를거임 */}
            {sortedFriends
            .map((friend, i) => (
              <div key={i} className='chat-list' onClick={() => { 
                setChatTarget(userFriends.filter((data) => data.friend_id===friend.friendId)[0]) }}>
              <div className='chat-friend-icon'>
               
                {/* 채팅리스트 - 아이콘 */}
                <img src={icons[userFriends.filter((data) => data.friend_id === friend.friendId)[0].current_icon]} alt='' />
              </div>
              <div className='chat-info'>
                <span className='chat-friend-nickname'>
                  {/* 채팅리스트 - 닉네임 */}
                  {userFriends.filter((data) => data.friend_id===friend.friendId)[0].nickname}
                </span>
                <span className='chat-friend-content'>
                  {/* 채팅리스트 - 최근 채팅 한줄 */}
                  {myChat.filter(data => (data.receiver_id === userData.username && data.sender_id === friend.friendId) || (data.sender_id === userData.username && data.receiver_id === friend.friendId))
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
                  {/* 채팅 헤더 아이콘 */}
                  <img src={icons[chatTarget.current_icon]} alt=''/>
                </div>
                {/* 채팅 헤더 닉네임 */}
                <span className='chat-friend-nickname'>
                  {chatTarget.nickname}
                </span>
                {/* 최소화 버튼 */}
                <button className='chat-closeBtn' onClick={onHide}>ㅡ</button>
              </div>
            </div>
            <div className='chat-content' ref={scrollRef}>
              <div className='blank'/>
              {/* 채팅 내용 */}
              {myChat.map((data, i)=>(
                (chatTarget ? (data.sender_id === chatTarget.friend_id || data.receiver_id === chatTarget.friend_id) : false) &&
                <ChatBox key={i} action={data.sender_id===userData.username?'send':'receive'} content={data.content}/>
              ))}
            </div>
            <div className='chat-textarea-container'>
              {/* 채팅 입력공간 */}
              <textarea value={currentChat.content} onInput={(e) => chatTarget.friend_id && setCurrentChat({ sender_id: userData.username, receiver_id: chatTarget.friend_id, content: e.target.value })} 
                        onKeyDown={handleKeyDown} placeholder='메시지를 입력하세요.'/>
            </div>
          </div>
      </div>
    </>
  )
}

export default ChatModal