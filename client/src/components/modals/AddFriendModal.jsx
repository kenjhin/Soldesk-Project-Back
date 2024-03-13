import React, { useState } from 'react';
import '../../styles/AddFriendModal.css'

const AddFriendModal = ({ show, onClose, onAddFriend }) => {
  const [friendId, setFriendId] = useState('');

  const handleAddFriend = () => {
    // 친구 추가 요청하기
    // console.log(`Adding friend with ID: ${friendId}`);
    
    // 친구 추가되면, 부모 컴포넌트에 알림.
    if (onAddFriend) {
      onAddFriend();
    }
  };

  return (
    <div className='add-friend-modal'>
      <div className='modal-content'>
        <div className='close-wrapper'>
            <span className='close' onClick={onClose}>&times;</span>
        </div>
        <p>친구추가</p>
        <input placeholder='플레이어 이름' value={friendId} onChange={(e) => setFriendId(e.target.value)} />
        <button onClick={handleAddFriend}>친구 추가</button>
      </div>
    </div>
  );
};

export default AddFriendModal;