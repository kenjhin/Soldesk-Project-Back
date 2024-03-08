// express 모듈 및 관련 모듈 코드 (서버 구축을 좀더 편의하게 사용하는 라이브러리)
const express = require('express');
const app = express();
const ejs = require('ejs');
const cors = require('cors');

const cookieParser = require('cookie-parser'); 

// 0227 로그인 세션추가 
const session = require('express-session');
const MemoryStore = require('memorystore')(session); // 메모리에 세션 정보 저장을 위한 모듈 추가


// Mysql 연결 초기설정
const mysql      = require('mysql2');
const bodyParser = require('body-parser');
const connection = mysql.createConnection({
  host     : '211.52.60.107',
  user     : 'rikeizin',
  password : '1234',
  database : 'soldesk'
});

// CORS 허용 : 리액트포트3000, 서버포트 3001일때 일반적으로 브라우저에서 모든 요청을 보안상으로 차단함.
// 이 코드를 이용하면 3000포트와 3001포트의 상호 요청을 허용해준다.
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));

// 쿠키 미들웨어 추가
app.use(bodyParser.json());
app.use(cookieParser());

// bodyParser.json : 서버에서 json하고 url인코드 형식의 요청 데이터를 파싱하기 위해 사용
// 이것도 뭐 미들웨어라는데 body에서 데이터를 추출하고 이걸 JavaScript객체로 변환 하는 역할
// 데이터를 받아오려면 기본적으로 세팅이 필요한 부분임. 그래야 서버에서 입력값이 인식하니까.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true}));

// [0227] 로그인 관리 세션 > 암호화 등등 세션을 저장할지 않할지 결정하는 역할. 
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store: new MemoryStore({
    checkPeriod: 86400000, // 세션의 유효성을 체크하는 주기 (24시간)
  }),
}));


// EJS 사용하려는 미들웨어
app.set('view engine', 'ejs');


// #MySQL 초기설정 코드를 직접적으로 연결하는 메서드 (선언후 DB 사용 가능)
connection.connect();





// 메인 페이지 라우팅
app.get('/',  (req,res) => {
  res.sendFile(__dirname + '/index.html')
});





app.post('/signup', (req, res) => {
  // 요청 본문에서 데이터 추출
  const { username, password, confirmPassword, name, address, authority, icon } = req.body;
  const addressString = JSON.stringify(address);
  // 입력값 유효성 검사
  if (!username || !password || !confirmPassword || password !== confirmPassword) {
    return res.status(400).json({ error: '입력값이 올바르지 않습니다.' });
  }

  // MySQL 회원가입 쿼리
  const query = `
  INSERT INTO user (username, password, name, address, authority, icon)
  VALUES (?, ?, ?, ?, ?, ?)
`;

// MySQL 쿼리 실행, addressString을 쿼리 파라미터로 전달
connection.query(query, 
  [username, password, name, addressString, authority, icon], // 여기에서 address 대신 addressString 사용
  (error, results) => {

      if (error) {
        console.error('DB확인 요망 post요청 회원가입 기능오류:', error);
        return res.status(500).json({ error: '회원가입 중 오류가 발생했습니다.' });
      }

      // 회원가입 성공 시 세션 설정
      req.session.isLoggedIn = true;
      req.session.username = username;

      return res.status(201).json({ success: true });
    }
  );
});


// [0227] 로그인 API
app.post('/login', (req, res) => {
  // 역시 받아올 그릇들을 변수로 담는다.
  const { username, password } = req.body;

  // Mysql에서 사용자 이릅과 비밀번호를 확인하는 쿼리문.
  connection.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], (error, results) => {
    if (error) {
      console.error('DB 확인 요망 로그인 기능 오류:', error);
      return res.status(500).json({ error: '로그인 중 오류가 발생했습니다.' });
    }

    if (results.length > 0) {

       // 로그인 성공 시 쿠키 설정
      res.cookie('isLoggedIn', true, { httpOnly: true });
      res.cookie('username', username, { httpOnly: true });

      // DB와 데이터가 일치하면 세션을 부여(true)
      req.session.isLoggedIn = true;
      req.session.username = username;

      // 리다이렉트와 세션 정보를 클라이언트에 응답
      return res.status(200).json({ success: true, userInfo: results[0], message: '로그인 성공', redirectPath: '/' });
    } else {
      // 유효하지 않은 자격 증명일시의 세션설정 오류의 에러 메세지
      return res.status(401).json({ success: false, message: '유효하지 않은 자격 증명' });
    }
  });
});


app.get('/getUserInfo', (req, res) => {
  if (req.session && req.session.isLoggedIn) {
    const username = req.session.username;
    console.log(`Fetching user info for: ${username}`); // 로깅 추가
    connection.query('SELECT * FROM user WHERE username = ?', [username], (error, results) => {
      if (error) {
        console.error('사용자 정보 가져오기 실패:', error);
        return res.status(500).json({ success: false, message: '사용자 정보를 가져오는 중 오류가 발생했습니다.' });
      }

      if (results.length > 0) {
        console.log(`User info found for: ${username}`); // 로깅 추가
        // 주소 필드를 객체로 변환하여 응답에 추가
        results[0].address = JSON.parse(results[0].address || '{}');
        return res.status(200).json({ success: true, userInfo: results[0] });
      } else {
        return res.status(404).json({ success: false, message: '사용자 정보를 찾을 수 없습니다.' });
      }
    });
  } else {
    console.log('No session or user is not logged in'); // 로깅 추가
    return res.status(401).json({ success: false, message: '세션이 없습니다.' });
  }
});
















// 로그아웃 API
app.post('/logout', (req, res) => {
  // 쿠키 삭제
  res.clearCookie('isLoggedIn');
  res.clearCookie('username');

  // 세션 파기
  req.session.destroy(function(err) {
    if(err) {
      console.error('Session destroy error:', err);
      return res.status(500).json({ success: false, message: '로그아웃 처리 중 오류 발생' });
    }

    // 세션 파기 후, 클라이언트에 성공 응답 전송
    res.status(200).json({ success: true, message: '로그아웃 성공', redirectPath: '/login' });
  });
});








// 초기세팅 서버실행 : http://localhost:3001
app.listen(3001, () => {
        console.log('[Soldesk Node Server + React]');
  // process.on : 프로세스가 종료되기 전에 인터럽트 신호를 수신할때 실행할 작업들
  // connection.end or process.exit는 서버와 데이터의 종료 메서드 즉 엔드포인트.
        process.on('SIGINT', () => {
          console.log('Server is shutting down');
          connection.end();
          process.exit();
        });
     });
