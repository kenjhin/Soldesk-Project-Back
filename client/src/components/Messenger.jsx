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

const Messenger = () => {
  const [modalShow, setModalShow] = useState(false);
  const [addFriendModalShow, setAddFriendModalShow] = useState(false);
  const [myChat, setMyChat] = useState([{
    senderId: '실험용계정',
    receiverId: '잼민이',
    content: '11111111',
    date: '24.03.08 12.00',
  },{
    senderId: '실험용계정',
    receiverId: '잼민이',
    content: '22222222222222222222222222222',
    date: '24.03.08 12.01',
  },{
    senderId: '잼민이',
    receiverId: '실험용계정',
    content: '33333333333333333',
    date: '24.03.08 12.02',
  },{
    senderId: '다른사람',
    receiverId: '실험용계정',
    content: '다른 사람이 보냄',
    date: '24.03.08 12.04',
  }]);
  const [userData, setUserData] = useState({
    logined: true,
    icon: defaultIcon,
    icons: [defaultIcon, defaultIcon],
    nickname: '실험용계정',
    profileMessage: '상태메시지',
    status: undefined,
    username: 'ID',
    password: 'password',
    confirmPassword: 'password',
    friends: [{
      groupId: 1,
      groupName: "일반",
      friendsId: ['잼민이', '아트록스', '세주아니']
    },{
      groupId: 2,
      groupName: "안친함",
      friendsId: ['다른사람']
    }],
    address: {
      zonecode: 'zonecode',
      fullAddress: 'fullAddress',
      detailAddress: 'detailAddress'
    }
  });
  const [chatTarget, setChatTarget] = useState();
  const [currentChat, setCurrentChat] = useState({
    senderId: '',
    receiverId: '',
    content: '',
    date: getCurrentDateTime(),
  });
  const [expandedGroups, setExpandedGroups] = useState([]);

  const toggleGroup = (groupId) => {
    if (expandedGroups.includes(groupId)) {
      setExpandedGroups(expandedGroups.filter(id => id !== groupId));
    } else {
      setExpandedGroups([...expandedGroups, groupId]);
    }
  };

  const openChatModal = (friendId) => {
    setChatTarget(friendId);
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
    // 친구 확장된 그룹 state에 친구리스트 전부 등록
    const allGroupIds = userData.friends.map((group) => group.groupId);
    setExpandedGroups(allGroupIds);
  }, []);

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
      {userData.friends.map(group => (
        <div key={group.groupId} className='messenger-friend-group'>
          <div className='messenger-group-header' onClick={() => toggleGroup(group.groupId)}>
            <span>{group.groupName}</span>
          </div>
        {/* 그룹 열려있으면 그룹안에 친구들 보여주기 */}
        {expandedGroups.includes(group.groupId) && (group.friendsId.map((friendId, i) => (
          <div key={i} className='messenger-friend-list' onClick={() => openChatModal(friendId)}>
            <div className='friend-icon'>
              <img src={defaultIcon} alt='friend-icon' />
            </div>
            <div className='friend-info'>
              <span className='friend-id'>{friendId}</span>
              <span className='friend-profile-message'>{'상태메시지'}</span>
            </div>
          </div>
        )))}
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
          />
        )}
        <button className='chatBtn' onClick={()=>{setModalShow((e) => !e)}}/>
      </div>
    </div>
  );
}

export default Messenger