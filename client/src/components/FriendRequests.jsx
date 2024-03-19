/* eslint-disable */
import React, { useEffect, useState } from 'react'
import FriendRequestModal from './modals/FriendRequestModal';
import '../styles/FriendRequest.css'
import axios from 'axios';

const FriendRequests = ({friendRequest, setFriendRequest, userFriends}) => {
  const [modalShow, setModalShow] = useState(false);

  const handleOnClick = () => {
    setModalShow(true);
  }

  return { friendRequest } ? (
    <div className='friend-request' >
      {/* {console.log(friendRequest.length !== 0)} */}
          {((friendRequest.length !== 0) && (friendRequest[0].status === 'awaiting')) && 
      <div className='friend-request-box' onClick={handleOnClick}>
          <>
            <span className='friend-request-text'>친구 요청</span>
            <div className='count-container'>
              <span className='friend-request-count'>{`${friendRequest.length}`}</span>
              {console.log(friendRequest)}
            </div>
          </>
        
      </div>
    }
      {modalShow && (
          <FriendRequestModal
            show={modalShow}
            onClose={() => setModalShow(false)}
            friendRequest={friendRequest}
            setFriendRequest={setFriendRequest}
            userFriends={userFriends}
          />
        )}
    </div>
  ) : (
    <></>
  );
}

export default FriendRequests