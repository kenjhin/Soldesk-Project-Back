import React, { useRef, useEffect } from 'react';
import { useIcon } from '../../contexts/IconContext'; // IconContext 사용
import { useUser } from '../../contexts/UserContext'; // UserContext 사용
import '../../styles/IconSetModal.css';

const IconSetModal = ({ img, modalOpen, setModalOpen }) => {
  const modalBackground = useRef();
  const { userIcons, setCurrentIcon,  } = useIcon(); // 사용자가 보유한 아이콘 목록 가져오기
  const { userData } = useUser(); // UserContext에서 유저 데이터 가져오기
  const currentUserIcon = userIcons.find(icon => icon.isCurrent === 1);

  
  const handleIconClick = async (iconId) => {
    await setCurrentIcon(iconId); // setCurrentIcon 호출을 await로 처리
  };

  useEffect(() => {
    // 이 부분은 실제로 사용되지 않으므로 삭제하거나 로직을 추가해야 할 필요가 있습니다.
  }, [setCurrentIcon, userIcons]); //


  return (
    <>
      <div className="icon-modal-btn-wrapper">
        <button className="icon-modal-open-btn">
          {img}
        </button>
      </div>
      {modalOpen && (
        <div className="icon-modal-container" ref={modalBackground} onClick={(e) => {
          if (e.target === modalBackground.current) {
            setModalOpen(false);
          }
        }}>
          <div className="icon-modal-content">
            <div className="iconModal">
              <div className="iconModalLeftBox">
                {/* 현재 선택된 아이콘 이미지 표시 */}
                {currentUserIcon && (
                  <img src={currentUserIcon.IconURL} alt="Current User Icon"/>
                )}
                <p>{userData.nickname}</p>
              </div>
              <div className="iconModalRightBox">
                <div className="iconModalTitle">
                  <p>아이콘 설정</p>
                </div>
                <div className="iconSelectArea">
                  <div className="icon-container">
                    {userIcons.map(icon => (
                      <div key={icon.UserIconID} 
                      className='iconsBox'
                      onClick={() => handleIconClick(icon.IconID)} 
                      style={{ cursor: 'pointer', margin: '10px' }}>
                        <img src={icon.IconURL} alt="User Icon"/>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IconSetModal;