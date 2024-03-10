import React, { useRef, useState } from 'react';
import myInfoIco from "../../assets/img/home/nav-icon-profile.png";
import PostCode from '../PostCode';
import "../../styles/MyInfoModal.css";

const MyInfoModal = ({ data, setData }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const modalBackground = useRef();

  const handleInputChange = (e, key) => {
    if (key !== 'detailAddress') {
      setData(prev => ({
        ...prev,
        [key]: e.target.value,
      }));
    } else {
      setData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          detailAddress: e.target.value,
        },
      }));
    }
  };

  const handleAddressSelected = (zonecode, fullAddress) => {
    setData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        zonecode: zonecode,
        fullAddress: fullAddress,
      },
    }));
  };

  const handleModalToggle = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <>
      <button className="myInfoBtn mouseover" onClick={handleModalToggle}>
        <img src={myInfoIco} alt="" />
      </button>

      {modalOpen && (
        <div className="myInfo-container" ref={modalBackground} onClick={(e) => e.target === modalBackground.current && handleModalToggle()}>
          <div className="myInfo-content">
            <h1>MY INFO</h1>
            <div className="myInfo-fields">
              <input value={data.username || ''} readOnly placeholder="Username" />
              <input value={data.password || ''} onChange={(e) => handleInputChange(e, 'password')} type="password" placeholder="Password" />
              <input value={data.confirmPassword || ''} onChange={(e) => handleInputChange(e, 'confirmPassword')} type="password" placeholder="Confirm Password" />
              <input value={data.name || ''} onChange={(e) => handleInputChange(e, 'name')} placeholder="Name" />
              {/* 주소 관련 필드 추가 */}
              <input value={data.address?.zonecode || ''} onChange={(e) => handleInputChange(e, 'zonecode')} placeholder="Zone Code" />
              <input value={data.address?.fullAddress || ''} onChange={(e) => handleInputChange(e, 'fullAddress')} placeholder="Full Address" />
              <PostCode onAddressSelected={handleAddressSelected} />
              <input value={data.address?.detailAddress || ''} onChange={(e) => handleInputChange(e, 'detailAddress')} placeholder="Detail Address" />
              <button onClick={handleModalToggle}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyInfoModal;