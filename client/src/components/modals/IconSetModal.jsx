/* eslint-disable */
import React, {useState, useRef, useEffect} from 'react'
import hamster from "../../assets/img/hamster.jpg"
import "../../styles/IconSetModal.css";
import { useIcon } from '../../contexts/IconContext';
import Icons from '../Icons';
import { useUser } from '../../contexts/UserContext';

const IconSetModal = ({img, content}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const modalBackground = useRef();
  const { icons, setIcons } = useIcon();
  const { userData, setUserData } = useUser();
  // const { icons, setIcons } = useIcon();

  useEffect(()=>{
    // DB데이터 받아오기

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
                  <img src={icons[userData.current_icon]} alt="" />
                  <p>{userData.nickname}</p>
                </div>
                <div className="iconModalRightBox">
                  <div className="iconModalTitle">
                    <p>아이콘 설정</p>
                  </div>
                  <div className="iconSelectArea">
                    <div className="icon-container">
                      <Icons show={true}/>
                    </div>
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