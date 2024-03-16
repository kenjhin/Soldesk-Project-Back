import React, { useState } from 'react'
import FriendRequestModal from './modals/FriendRequestModal';
import '../styles/FriendRequest.css'

const FriendRequests = ({friendRequest}) => {
  const [modalShow, setModalShow] = useState(false);

  const handleOnClick = () => {
    setModalShow(true);
  }

  return { friendRequest } ? (
    <div className='friend-request' >
      <div className='friend-request-box' onClick={handleOnClick}>
          {(friendRequest.length !== 0) && 
          <>
            <span className='friend-request-text'>친구 요청</span>
            <div className='count-container'>
              <span className='friend-request-count'>{`${friendRequest.length}`}</span>
            </div>
          </>
          }
        
      </div>
      {modalShow && (
          <FriendRequestModal
            show={modalShow}
            onClose={() => setModalShow(false)}
            friendRequest={friendRequest}
          />
        )}
    </div>
  ) : (
    <></>
  );
}

export default FriendRequests