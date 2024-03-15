import React, { useState } from 'react'
import FriendRequestModal from './modals/FriendRequestModal';

const FriendRequests = ({friendRequest}) => {
  const [modalShow, setModalShow] = useState(false);

  const handleOnClick = () => {
    setModalShow(true);
  }

  return { friendRequest } ? (
    <div>
      <div onClick={handleOnClick}>
        <span style={{ color: "white" }}>
          {(friendRequest.length !== 0) && `친구요청 : ${friendRequest.length}`}
        </span>
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