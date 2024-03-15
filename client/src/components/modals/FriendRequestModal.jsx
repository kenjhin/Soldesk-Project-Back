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
        <div className='request-header-box'>
          <span>친구 요청{friendRequest.length!== 0 && `(${friendRequest.length})`}</span>
        </div>
        <div className='request-body-container'>
        {friendRequest.map((data, i) => (
          <div key={i} className='request-list-container'>
            <div className='request-userIcon-box'>
              <img src={x} alt=''/>
            </div>
            <div className='request-userInfo-container'>
              {/* <img src={} alt=''/> */}
              <div className='request-nickname-box'>
                {data.nickname}
              </div>
              <div className='request-text-box'>
                <span>친구 요청</span>
              </div>
            </div>
            <div className='request-btn-container'>
              <button onClick={() => handleAcceptFriendRequest(data.id)}>
                <img src={check} alt=''/>
              </button>
              <button onClick={() => handleRejectFriendRequest(data.id)}>
                <img src={x} alt=''/>
              </button>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  )
}

export default FriendRequestModal