import React, { useEffect, useRef, useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import myInfoIco from "../../assets/img/home/nav-icon-profile.png";
import PostCode from '../PostCode';
import "../../styles/MyInfoModal.css";

const MyInfoModal = ( ) => {
  const [modalOpen, setModalOpen] = useState(false);
  const modalBackground = useRef();
  const [prevData, setPrevData] = useState();
  const { userData, setUserData } = useUser();

  // 0) userEffect
  useEffect(() => {
    // 사용자 편의를 위해 유즈이펙트 사용해서 모달창 열고 닫을때 #비밀번호 확인 부분을 비워두겠습니다~!
    if (modalOpen) {
      setPrevData({ ...userData, confirmPassword: '' }); 
    }
  }, [modalOpen, userData]);


  // 1) 유저데이터 prevDate Input
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


  // 2) 유저데이터(주소) prevDate Input
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


  // 3-1) modal open
  const handleOpen = () => {
    setPrevData(userData || {
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


  // 3-2) modal close 
  const handleClose = () => {
    setModalOpen(false);
  };


  // 4) setUserData = update logic Btn
  const handleConfirmClick = async () => {
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

    try {
      const response = await fetch('http://localhost:3001/updateMyInfo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prevData),
        credentials: 'include',  // credentials : cookie로 사용자 식별하는 부분도 여기서 필요하답니다!
      });
  
      const responseData = await response.json();
      if (response.ok) {
        alert('내 정보가 저장되었습니다.');
        setUserData(prevData);
        setModalOpen(false);
      } else {
        alert(responseData.message);
      }
    } catch (error) {
      console.error('Error updating user info:', error);
      alert('정보 업데이트 중 오류가 발생했습니다.');
    }

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