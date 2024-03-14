/* eslint-disable */
import React, { useEffect, useState } from 'react'
import addPerson from "../assets/img/messenger/add_person_mask.png";
import addFolder from "../assets/img/messenger/add_folder_mask.png";
import search from "../assets/img/messenger/search_mask.png";
import sort from "../assets/img/messenger/sort_mask.png";
import defaultIcon from "../assets/img/hamster.jpg"
import ChatModal from './modals/ChatModal';
import getCurrentDateTime from './function/getCurrentDateTime';
import AddFriendModal from './modals/AddFriendModal';

import { useUser } from '../contexts/UserContext';
import axios from 'axios';
import { useIcon } from '../contexts/IconContext';

const Messenger = () => {
  const [modalShow, setModalShow] = useState(false);
  const [addFriendModalShow, setAddFriendModalShow] = useState(false);
  const [myChat, setMyChat] = useState([]);
  const { userData, setUserData } = useUser(); // UserContext의 유저 데이터와 세터 함수 사용
  const [userFriends, setUserFriends] = useState([]);
  const { icons, setIcons } = useIcon();
  const [chatTarget, setChatTarget] = useState();
  const [targetInfo, setTargetInfo] = useState([]);
  const [currentChat, setCurrentChat] = useState({
    senderId: '',
    receiverId: '',
    content: '',
  });
  const [expandedGroups, setExpandedGroups] = useState();
  const [uniqueGroupNames, setUniqueGroupNames] = useState([]);

  const toggleGroup = (groupName) => {
    if (expandedGroups.includes(groupName)) {
      setExpandedGroups(expandedGroups.filter(name => name !== groupName));
    } else {
      setExpandedGroups([...expandedGroups, groupName]);
    }
  };
  
  const openChatModal = (friendInfo) => {
    setChatTarget(friendInfo.nickname);
    setTargetInfo(friendInfo);
    setModalShow(true);
  };

  const openAddFriendModal = () => {
    setAddFriendModalShow(true);
  };

  const handleAddFriend = () => {
    // 로직구현필요
    setAddFriendModalShow(false);
  };


  
  useEffect(() => {
    const fetchUserFriends = async () => {
      try {
        const response = await axios.get('http://localhost:3001/userFriends', { withCredentials: true });
        // response.data 답장온 user_friends.json 데이터
        setUserFriends(response.data);
      } catch (error) {
        console.error('userFriends 로드 중 오류 발생:', error);
      }
    };

    fetchUserFriends();
  }, [chatTarget]); // 친구 요청받거나 채팅바뀌거나할때마다 

  useEffect(() => {
    const fetchMyChat = async () => {
      try {
        const response = await axios.get('http://localhost:3001/chatData', { withCredentials: true });
        setMyChat(response.data);
      } catch (error) {
        console.error('chat 로드 중 오류 발생:', error);
      }
    };

    fetchMyChat();

    const intervalId = setInterval(fetchMyChat, 100);

    return () => clearInterval(intervalId);
  }, []); 

  useEffect(() => {
    // 친구 그룹 확장 여부 설정
    const allGroupNames = [...new Set(userFriends.map((group) => group.group_name))];
    setExpandedGroups(allGroupNames);
    updateUniqueGroupNames();
  }, [userFriends]);

  // updateUniqueGroupNames
  const updateUniqueGroupNames = () => {
    const newUniqueGroupNames = [...new Set(userFriends.map((group) => group.group_name))];
    const sortedGroupNames = sortGroupNames(newUniqueGroupNames);
    setUniqueGroupNames(sortedGroupNames);
  };

  // 그룹명 정렬(일반이 맨 위에)
  const sortGroupNames = (groupNames) => {
    const sortedGroupNames = [...groupNames];
    const normalIndex = sortedGroupNames.indexOf('일반');
    if (normalIndex !== -1) {
      sortedGroupNames.splice(normalIndex, 1);
      sortedGroupNames.unshift('일반');
    }
    return sortedGroupNames;
  };
  // 친구요청 보낸거 받으면 서로의 friends에 상대 id추가
  // 상대id.profileMessage 받아오기

  return (
    <div className="messenger">
      <div className="messengerHeaderBtnBox">
        <p className="messengerText">커뮤니티</p>
        <button className="messengerHeaderBtn">
          <img src={search} alt=''/>
        </button>
        <button className="messengerHeaderBtn">
          <img src={sort} alt=''/>
        </button>
        <button className="messengerHeaderBtn">
          <img src={addFolder} alt=''/>
        </button>
        <button className="messengerHeaderBtn" onClick={openAddFriendModal}>
          <img src={addPerson} alt=''/>
        </button>
      </div>
      {addFriendModalShow && 
      <AddFriendModal 
        show={addFriendModalShow} 
        onClose={() => setAddFriendModalShow(false)} 
        onAddFriend={handleAddFriend}
      />}
      
      <div className="messenger-friend-area">
      {/* group 리스트 받아와서 map돌리기 */}
      {uniqueGroupNames.map((group, index) => (
        <div key={index} className="messenger-friend-group">
          <div className="messenger-group-header" onClick={() => toggleGroup(group)}>
            <span>{group}</span>
          </div>
          {expandedGroups.includes(group) && (
            userFriends
              .filter((data) => data.group_name === group)
              .map((friends, j) => (
                <div key={j} className='messenger-friend-list' onClick={() => openChatModal(friends)}>
                  <div className='friend-icon'>
                    <img src={icons[friends.current_icon]} alt='friend-icon' />
                  </div>
                  <div className='friend-info'>
                    <span className='friend-id'>{friends.nickname}</span>
                    <span className='friend-profile-message'>{friends.profile_message}</span>
                  </div>
                </div>
              ))
          )}
        </div>
      ))}
      </div>
      {/* 하단 채팅 버튼 누르면 채팅창열림 */}
      <div className='messengerFooterBtnBox'>
        {modalShow&&(
          <ChatModal 
            onHide={()=>{
              setModalShow((e) => !e)
            }}
            myChat={myChat}
            setMyChat={setMyChat}
            userData={userData}
            setUserData={setUserData}
            chatTarget={chatTarget}
            setChatTarget={setChatTarget}
            currentChat={currentChat}
            setCurrentChat={setCurrentChat}
            targetInfo={targetInfo}
            icons={icons}
          />
        )}
        <button className='chatBtn' onClick={()=>{setModalShow((e) => !e)}}/>
      </div>
    </div>
  );
}

export default Messenger