/* eslint-disable */
import React, {useState, useRef, useEffect} from 'react'
import hamster from "../../assets/img/hamster.jpg"
import "../../styles/IconSetModal.css";

const IconSetModal = ({img, content}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const modalBackground = useRef();
  const [userData, setUserData] = useState({
    logined: true,
    icon: hamster,
    icons: [hamster, hamster],
    nickname: '유저닉네임',
    profileMessage: '상태메시지',
    status: undefined,
    username: 'ID',
    password: 'password',
    confirmPassword: 'password',
    address: {
      zonecode: 'zonecode',
      fullAddress: 'fullAddress',
      detailAddress: 'detailAddress'
    }
  });

  useEffect(()=>{
    // DB데이터 받아오기
    // setUserData(DB);
  }, []);

  return (
    <>
      <div className="icon-modal-btn-wrapper">
        <button
          className="icon-modal-open-btn"
          onClick={() => setModalOpen(true)}
        >
          {img}
        </button>
      </div>
      {modalOpen && (
        <div
          className="icon-modal-container"
          ref={modalBackground}
          onClick={(e) => {
            if (e.target === modalBackground.current) {
              setModalOpen(false);
            }
          }}
        >
          <div className="icon-modal-content">
            {
              <div className="iconModal">
                <div className="iconModalLeftBox">
                  <img src={userData.icon} alt="" />
                  <p>{userData.nickname}</p>
                </div>
                <div className="iconModalRightBox">
                  <div className="iconModalTitle">
                    <p>아이콘 설정</p>
                  </div>
                  <div className="iconSelectArea">
                    {userData.icons.map(function (a, i) {
                      return (
                        <div key={i} className="iconsBox">
                          {/* 눌렀을 때 icon=icons[i]로 바꾸기 */}
                          <img src={userData.icons[i]} alt="" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      )}
    </>
  );
}

export default IconSetModal