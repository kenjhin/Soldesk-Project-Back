/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios';

const ChatModal = ({onHide, myChat, setMyChat, chatTarget, setChatTarget, userData, setUserData, 
                    currentChat, setCurrentChat, icons, userFriends}) => {
  const scrollRef = useRef();
  const prevScrollHeight = useRef();

  // chat버튼으로 열었을 때 채팅 스크롤 및 최근 chatTarget 설정
  useEffect(() => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    if (chatTarget.friendId) {
      return;
    }

    const recentChat = myChat.reduce((recent, chat) => {
      if ((chat.sender_id === userData.username || chat.receiver_id === userData.username) &&
          (!recent || new Date(chat.created_at) > new Date(recent.created_at))) {
        return chat;
      }
      return recent;
    }, null);

    if (recentChat) {
      const recentChatTarget = recentChat.sender_id === userData.username ? recentChat.receiver_id : recentChat.sender_id;
      setChatTarget(userFriends.find((data) => data.friendId === recentChatTarget));
    }
  }, [myChat, chatTarget.friendId, setChatTarget, userData.username, userFriends]);

  // 친구 리스트에서 눌러서 열었을 때 채팅 스크롤 설정
  useEffect(() => {
    const shouldAdjustScroll = myChat.some(data => data.receiver_id === chatTarget.friendId || data.sender_id === chatTarget.friendId);
    if (shouldAdjustScroll) {
      const currentScrollHeight = scrollRef.current.scrollHeight;
      if (prevScrollHeight.current !== currentScrollHeight) {
        scrollRef.current.scrollTop = currentScrollHeight;
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
      // navigate('/login'); // 주석 처리된 navigate 함수 부분은 실제 라우팅 로직에 따라 수정 필요
      return;
    }

    try {
      await axios.post(`http://localhost:3001/chat/send`, {
        senderId: userData.username,
        receiverId: chatTarget.friendId,
        content: currentChat.content,
      });
    } catch (error) {
      console.error('채팅 전송 오류:', error);
    }
  };
  
  // 채팅창 엔터누를 때
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && currentChat.content.trim() !== '') {
      e.preventDefault();
      setCurrentChat({ ...currentChat, content: '' });
      setMyChat([...myChat, currentChat]);
      handleChatSend();
    } else if (!chatTarget.friendId) {
      alert('채팅 상대를 선택해주세요.');
    }
  };
  
  // 채팅 리스트 최근 채팅순 정렬
  const sortedFriends = [...new Set(myChat.map(data => (data.receiver_id === userData.username ? data.sender_id : data.receiver_id)))]
    .map(friendId => ({
      friendId,
      latestMessageTime: Math.max(...myChat.filter(data => 
        (data.receiver_id === userData.username && data.sender_id === friendId) || 
        (data.sender_id === userData.username && data.receiver_id === friendId))
        .map(data => new Date(data.created_at).getTime()))
    }))
    .sort((a, b) => b.latestMessageTime - a.latestMessageTime);


    // useEffect(() => {
    //   console.log(chatTarget); // chatTarget 구조와 데이터 확인
    // }, [chatTarget]);



    return (
      <>
        <div className='chatModal'>
          <div className='chat-list-container'>
            {sortedFriends.map((friend, i) => (
              <div key={i} className='chat-list' onClick={() => setChatTarget(userFriends.find(data => data.friendId === friend.friendId))}>
                <div className='chat-friend-icon'>
                  {/* 아이콘 출력 방식 변경 */}
                  <img src={userFriends.find(data => data.friendId === friend.friendId)?.iconURL || 'defaultIconPath'} alt='' />
                </div>
                <div className='chat-info'>
                  <span className='chat-friend-nickname'>
                    {userFriends.find(data => data.friendId === friend.friendId)?.nickname}
                  </span>
                  <span className='chat-friend-content'>
                    {myChat.filter(data => (data.receiver_id === userData.username && data.sender_id === friend.friendId) || (data.sender_id === userData.username && data.receiver_id === friend.friendId))
                      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]?.content}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className='chat-container'>
            {/* 채팅 헤더 아이콘과 닉네임 출력 방식 변경 */}
            <div className='chat-header'>
              <div className='chat-friend'>
                <div className='chat-friend-icon'>
                  <img src={chatTarget.iconURL} alt='friend-icon' />
                </div>
                <span className='chat-friend-nickname'>
                  {chatTarget.nickname}
                </span>
                <button className='chat-closeBtn' onClick={onHide}>ㅡ</button>
              </div>
            </div>
            <div className='chat-content' ref={scrollRef}>
              <div className='blank'/>
              {myChat.map((data, i) => (
                (chatTarget ? (data.sender_id === chatTarget.friendId || data.receiver_id === chatTarget.friendId) : false) &&
                <ChatBox key={i} action={data.sender_id===userData.username?'send':'receive'} content={data.content}/>
              ))}
            </div>
            <div className='chat-textarea-container'>
              <textarea value={currentChat.content} onInput={(e) => chatTarget.friendId && setCurrentChat({ sender_id: userData.username, receiver_id: chatTarget.friendId, content: e.target.value })} onKeyDown={handleKeyDown} placeholder='메시지를 입력하세요.'/>
            </div>
          </div>
        </div>
      </>
  )
}

export default ChatModal