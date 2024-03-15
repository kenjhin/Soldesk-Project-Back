import React, { useEffect, useState } from 'react';
import '../../styles/AddFriendModal.css'
import axios from 'axios';
import { useUser } from '../../contexts/UserContext';

const AddFriendModal = ({ show, onClose, onAddFriend, userFriends }) => {
  const [friendNickname, setFriendId] = useState('');
  const [usersNickname, setUsersNickname] = useState();
  const { userData, setUserData } = useUser();
  // 친구 추가 요청하기
  const handleAddFriend = () => {
    // 유효성검사
    if(userData.nickname===friendNickname){
      alert('다른 유저의 닉네임을 입력해주세요.');
      return;
    }else if (userFriends.some(data => data.nickname === friendNickname)) {
      alert(`${friendNickname} 님과는 이미 친구입니다.`);
      return;
    }else if(!usersNickname.some(user => user.nickname === friendNickname)){
      alert(`${friendNickname} 님은 존재하지 않는 사용자입니다.`);
      console.log(usersNickname);
      return;
    }

    handlefriendRequestSend();
    alert('요청을 보냈습니다! 사용자에게 친구 수락 요청을 보냈습니다. 사용자가 요청을 수락하면 온라인으로 확인할 수 있습니다.')
    
    // 친구 추가되면, 부모 컴포넌트에 알림.
    if (onAddFriend) {
      onAddFriend();
    }
  };

  const handlefriendRequestSend = async () => {
    try {
      await axios.post(`http://localhost:3001/friendRequest/send`, {
        senderId: userData.username,
        receiverNickname: friendNickname,
      });
    } catch (error) {
      console.error('채팅 전송 오류:', error);
    }
  };

  useEffect(() => {
    const fetchUsersNickname = async () => {
      try {
        const response = await axios.get('http://localhost:3001/Users/Nickname', { withCredentials: true });
        setUsersNickname(response.data);
      } catch (error) {
        console.error('UsersNickname 로드 중 오류 발생:', error);
      }
    };
    fetchUsersNickname();
  }, [])

  return (
    <div className='add-friend-modal'>
      <div className='modal-content'>
        <div className='close-wrapper'>
            <span className='close' onClick={onClose}>&times;</span>
        </div>
        <p>친구추가</p>
        <input placeholder='플레이어 이름' value={friendNickname} onChange={(e) => {setFriendId(e.target.value)}} autoFocus/>
        <button onClick={handleAddFriend}>친구 추가</button>
        <h2 style={{marginTop: '100px', color: 'gray'}}>★ 상점에서 아이콘을 구매해보세요! ★</h2>
        
      </div>
    </div>
  );
};

export default AddFriendModal;