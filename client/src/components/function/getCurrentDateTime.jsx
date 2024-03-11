const getCurrentDateTime = () => {
    const now = new Date();
    const year = String(now.getFullYear()).slice(2);
    
    // 한 자리 숫자는 앞에 0을 붙임
    // 월은 0부터 시작하므로 1을 더함
    const month = String(now.getMonth() + 1).padStart(2, '0'); 
    const day = String(now.getDate()).padStart(2, '0'); 
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
  
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  export default getCurrentDateTime;