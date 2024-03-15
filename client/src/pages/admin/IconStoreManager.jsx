import React, { useState } from 'react';
import axios from 'axios';

function IconStoreManager() {
  const [iconName, setIconName] = useState('');
  const [iconPrice, setIconPrice] = useState('');
  const [iconFile, setIconFile] = useState(null);

  const handleIconUpload = (e) => {
    setIconFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('iconName', iconName);
    formData.append('iconPrice', iconPrice);
    formData.append('iconFile', iconFile);

    try {
      const response = await axios.post('http://localhost:3001/upload-icon', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
      });
      console.log(response.data);
      alert('아이콘 업로드 성공!');
    } catch (error) {
      console.error('아이콘 업로드 실패:', error);
      alert('아이콘 업로드 실패');
    }
  };

  return (
    <div>
      <h2>아이콘 샵 관리</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            아이콘 이름:
            <input type="text" value={iconName} onChange={(e) => setIconName(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            아이콘 가격:
            <input type="number" value={iconPrice} onChange={(e) => setIconPrice(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            아이콘 파일:
            <input type="file" onChange={handleIconUpload} />
          </label>
        </div>
        <button type="submit">업로드</button>
      </form>
    </div>
  );
}

export default IconStoreManager;

// ?