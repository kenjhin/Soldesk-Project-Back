const formatDate = (isoDate, type) => {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false, // 24시간 형식
    timeZone: 'Asia/Seoul', // 한국 시간대
  };

  const formattedDate = new Date(isoDate).toLocaleString('en-US', options);

  // MM.DD 형식 또는 YYYY.MM.DD HH.mm 형식에 맞게 가공
  const [date, time] = formattedDate.split(', ');
  const [month, day, year] = date.split('/');
  const today = new Date().toLocaleString(['en-US'], { year: 'numeric', month: '2-digit', day: '2-digit' });

  var formattedDateString1;
  var formattedDateString2 = `${year}.${month}.${day}. ${time}`;

  if(today===date){
    const hour = new Date(isoDate).getHours();
    const formattedHour = hour >= 24 ? '00' : String(hour).padStart(2, '0'); // 시간값이 24를 넘어가면 00으로 변경
    const minutes = new Date(isoDate).getMinutes();
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes; // 분이 한 자리 수일 경우 앞에 0 추가
    formattedDateString1 = `${formattedHour}:${formattedMinutes}`;
  } else{
    formattedDateString1 = `${year}.${month}.${day}.`
  }
  return type === 'postList' ? formattedDateString1 : formattedDateString2;
};

export default formatDate;