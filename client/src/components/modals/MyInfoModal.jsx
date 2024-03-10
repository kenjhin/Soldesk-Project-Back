import React, { useRef, useState } from 'react';
import myInfoIco from "../../assets/img/home/nav-icon-profile.png";
import PostCode from '../PostCode';
import "../../styles/MyInfoModal.css";

const MyInfoModal = ({ data, setData }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const modalBackground = useRef();
  const [prevData, setPrevData] = useState();
  
  const handleInputChange = (e, key) => {
    if(key!=='detailAddress'){
      setPrevData(() => ({
        ...prevData,
        [key]: e.target.value,
      }));
    }else{
      setPrevData(() => ({
        ...prevData,
        address: {
          ...prevData.address,
          detailAddress: e.target.value,
        },
      }));
    }
  };

  const handleAddressSelected = (zonecode, fullAddress) => {
    setPrevData(() => ({
      ...prevData,
      address: {
        zonecode: zonecode,
        fullAddress: fullAddress,
        detailAddress: prevData.address.detailAddress,
      }
    }));
  };

  const handleOpen = () => {
    setPrevData(data || {
      username: '',
      password: '',
      confirmPassword: '',
      nickname: '',
      address: {
        zonecode: '',
        fullAddress: '',
        detailAddress: '',
      },
    });
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleConfirmClick = () => {
    if (!prevData.username || !prevData.password || !prevData.confirmPassword || !prevData.nickname || !prevData.address.zonecode || 
        !prevData.address.fullAddress || !prevData.address.detailAddress) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
    
    // 비밀번호 일치 여부 확인
    if (prevData.password !== prevData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // prevData의 address의 데이터 사이에 !!을 넣어서 합쳐주고 setData
    setData(prevData);
    // DB에 전송하기 data << 이거 보내면 됨
    // DB전송함수
    alert('저장되었습니다.')

  };

  return (
    <>
      <button className="myInfoBtn mouseover" onClick={handleOpen}>
        <img src={myInfoIco} alt="" />
      </button>

      {modalOpen && (
        <div className="myInfo-container" ref={modalBackground} onClick={(e) => e.target === modalBackground.current && handleClose()}>
          <div className="myInfo-content">
            <div className="myInfoBox">
              <h1>MY INFO</h1>
              <div className="myInfo-fields-1">
                <input value={prevData.username || ''} readOnly placeholder="Username" style={{borderTopLeftRadius: '10px', borderTopRightRadius: '10px'}} />
                <input value={prevData.password || ''} onChange={(e) => handleInputChange(e, 'password')} type="password" placeholder="Password" />
                <input value={prevData.confirmPassword || ''} onChange={(e) => handleInputChange(e, 'confirmPassword')} type="password" placeholder="Confirm Password" style={{borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px'}}/>
                {prevData.password!==prevData.confirmPassword && 
                    <p style={{color: 'red'}}>비밀번호가 일치하지 않습니다.</p>}
              </div>
              <div className="myInfo-fields-2">
                <input value={prevData.nickname || ''} onChange={(e) => handleInputChange(e, 'nickname')} placeholder="Nickname" style={{borderTopLeftRadius: '10px', borderTopRightRadius: '10px'}}/>
                <PostCode onAddressSelected={handleAddressSelected} />
                <PostCode
                  onAddressSelected={handleAddressSelected}
                  inputForm={
                    <>
                      <input
                        value={prevData.address?.zonecode}
                        spellCheck="false"
                        readOnly
                      />
                      <input
                        value={prevData.address?.fullAddress}
                        spellCheck="false"
                        readOnly
                      />
                    </>
                  }
                />
                <input value={prevData.address?.detailAddress || ''} onChange={(e) => handleInputChange(e, 'detailAddress')} placeholder="Detail Address" style={{borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px'}}/>
                <button onClick={handleConfirmClick}>Apply</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyInfoModal;