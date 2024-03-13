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
  const today = new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

  var formattedDateString1;
  var formattedDateString2 = `${year}.${month}.${day}. ${time}`;

  if(today===date){
    formattedDateString1 = `${new Date(isoDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false})}`
  } else{
    formattedDateString1 = `${year}.${month}.${day}.`
  }
  return type === 'postList' ? formattedDateString1 : formattedDateString2;
};

export default formatDate;