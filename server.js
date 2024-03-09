// (Express)
const express = require('express'); // 익스프레스 미들웨어1
const app = express(); // 익스프레스 미들웨어2, app 문법으로 사용하기 위해서
// (ejs) 
const ejs = require('ejs'); // 노드JS 자체 라우팅 -> 지금은 리액트에서 라우팅하니 사용안할듯.
// (cors)
const cors = require('cors');
// (Cookie or Session)
const cookieParser = require('cookie-parser'); 
const session = require('express-session');
const MemoryStore = require('memorystore')(session); // 메모리에 세션 정보 저장을 위한 모듈 추가


  // [MYSQL-1] DB연결 초기설정
  const mysql      = require('mysql2');
  const bodyParser = require('body-parser');
  const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'soldesk',
    password : '1234',
    database : 'soldesk'
  });

  // [MySQL-2] mysql 커넥션
  connection.connect();

  // [바디파서] JSON 미들웨어
  app.use(bodyParser.json()); // 서버에서 DB DATA를 받아오려면 기본적으로 세팅이 필요한 부분임.
  app.use(bodyParser.urlencoded({ extended:true}));

  // [Cors-미들웨어] 3000포트의 리액트와 상호연결
  const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
  };
  app.use(cors(corsOptions));

  // [쿠기] 미들웨어
  app.use(bodyParser.json());
  app.use(cookieParser());

  // [세션] Express-미들웨어
  app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    store: new MemoryStore({
      checkPeriod: 86400000, // 세션의 유효성을 체크하는 주기 (24시간)
    }),
  }));

  // [EJS] 미들웨어
  app.set('view engine', 'ejs');








// <초기세팅> 서버 실행시 메인 페이지 라우팅
app.get('/',  (req,res) => {
  res.sendFile(__dirname + '/index.html')
});




// <POST> 회원가입 API
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


// <Post> 로그인 API
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

      // 로그인 성공시 쿠키설정 => ##세션 기능만 사용하려고 주석처리 했습니다.
      // res.cookie('isLoggedIn', true, { httpOnly: true });
      // res.cookie('username', username, { httpOnly: true });

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

// <GET> 로그인/비로그인 체크 API
app.get('/checkSession', (req, res) => {
  if (req.session && req.session.isLoggedIn) {
    // 세션 존재: 로그인 상태
    res.json({ success: true, message: '사용자가 로그인 상태입니다.' });
  } else {
    // 세션 미존재: 비로그인 상태
    res.json({ success: false, message: '사용자가 로그인 상태가 아닙니다.' });
  }
});




app.post('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.status(500).send({ success: false, message: '로그아웃 실패' });
      } else {
        res.send({ success: true, message: '로그아웃 성공' });
      }
    });
  } else {
    res.status(200).send({ success: true, message: '이미 로그아웃 상태' });
  }
});


app.get('/userData', (req, res) => {
  if (req.session && req.session.isLoggedIn) {
    // 세션 확인: 로그인 상태
    const username = req.session.username;

    // MySQL에서 사용자 정보 조회 쿼리 실행
    connection.query('SELECT username,password, name, address FROM user WHERE username = ?', [username], (error, results) => {
      if (error) {
        console.error('DB 조회 오류:', error);
        return res.status(500).json({ success: false, error: '서버 오류로 유저 데이터를 조회할 수 없습니다.' });
      }

      if (results.length > 0) {
        const user = results[0];

        return res.json({ success: true, user });
      } else {
        return res.status(404).json({ success: false, message: '유저 정보를 찾을 수 없습니다.' });
      }
    });
  } else {
    // 세션 미존재: 비로그인 상태
    res.status(401).json({ success: false, message: '로그인이 필요합니다.' });
  }
});






// <초기세팅> 서버실행 및 서버 종료(엔드포인트 코드이므로 항상 맨 마지막에 배치하기.)
// 서버 Port 3001 : http://localhost:3001
app.listen(3001, () => {
        console.log('[Soldesk Node Server + React]');
        process.on('SIGINT', () => {
          console.log('Server is shutting down');
          connection.end();
          process.exit();
        });
     });
