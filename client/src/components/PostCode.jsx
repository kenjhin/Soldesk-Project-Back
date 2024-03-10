import React from 'react'
import { useDaumPostcodePopup } from 'react-daum-postcode';
const PostCode = ({onAddressSelected, style, inputForm}) => {
  const open = useDaumPostcodePopup();

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    const zonecode = data.zonecode;
    onAddressSelected(zonecode, fullAddress);
  };

  const handleClick = () => {
    if(open.popupKey=== '1'){
      return;
    }
    open({ onComplete: handleComplete, popupKey: '1' });
  };

  return (
    <div onClick={handleClick} style={style}>
      {inputForm}
    </div>
  );
}

export default PostCode;