import axios from 'axios';
import React from 'react'
import '../../styles/FriendRequest.css'
import check from '../../assets/img/messenger/check_mask.png'
import x from '../../assets/img/messenger/x_mask.png'
const FriendRequestModal = ({show, onClose, friendRequest}) => {

  const handleAcceptFriendRequest = async (requestId) => {
    try {
      await axios.put('http://localhost:3001/friendRequest/accept', {
        requestId: requestId
      });
    } catch (error) {
      console.error('수락 요청 실패:', error);
    }
  };

  const handleRejectFriendRequest = async (requestId) => {
    try {
      await axios.put('http://localhost:3001/friendRequest/reject',{
        requestId: requestId
      });
    } catch (error) {
      console.error('수락 요청 실패:', error);
    }
  };

  return (
    <div className='friend-request-modal'>
      <div className='modal-content'>
        <div className='close-wrapper'>
            <span className='close' onClick={onClose}>&times;</span>
        </div>
        {/* <input placeholder='플레이어 이름' value={friendId} onChange={(e) => {setFriendId(e.target.value)}} />
        <button onClick={handleAddFriend}>친구 추가</button> */}
        <h2 style={{marginTop: '100px', color: 'gray'}}>친구 요청{friendRequest.length!== 0 && `(${friendRequest.length})`}</h2>
        {friendRequest.map((data, i) => (
          <div key={i}>
            <div>{data.nickname}</div>
            <button onClick={() => handleAcceptFriendRequest(data.id)}>
              <img src={check} alt=''/>
            </button>
            <button onClick={() => handleRejectFriendRequest(data.id)}>
              <img src={x} alt=''/>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FriendRequestModal