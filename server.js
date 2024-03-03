// express 모듈 및 관련 모듈 코드 (서버 구축을 좀더 편의하게 사용하는 라이브러리)
const express = require('express');
const app = express();
const ejs = require('ejs');
const cors = require('cors'); 

// 0227 로그인 세션추가 
const session = require('express-session');

// Mysql 연결 초기설정
const mysql      = require('mysql');
const bodyParser = require('body-parser');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'soldesk',
  password : '1234',
  database : 'soldesk'
});

// CORS 허용 : 리액트포트3000, 서버포트 3001일때 일반적으로 브라우저에서 모든 요청을 보안상으로 차단함.
// 이 코드를 이용하면 3000포트와 3001포트의 상호 요청을 허용해준다.
app.use(cors()); 

// bodyParser.json : 서버에서 json하고 url인코드 형식의 요청 데이터를 파싱하기 위해 사용
// 이것도 뭐 미들웨어라는데 body에서 데이터를 추출하고 이걸 JavaScript객체로 변환 하는 역할
// 데이터를 받아오려면 기본적으로 세팅이 필요한 부분임. 그래야 서버에서 입력값이 인식하니까.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true}));

// [0227] 로그인 관리 세션 > 암호화 등등 세션을 저장할지 않할지 결정하는 역할. 
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true })); // 추가



// EJS 사용하려는 미들웨어
app.set('view engine', 'ejs');


// #MySQL 초기설정 코드를 직접적으로 연결하는 메서드 (선언후 DB 사용 가능)
connection.connect();





// 메인 페이지 라우팅
app.get('/',  (req,res) => {
  res.sendFile(__dirname + '/index.html')
});



// 게시판 페이지 라우팅
app.get('/board', (req, res) => {
  connection.query('SELECT * FROM user', (error, rows, fields) => {
    if (error) throw error;
    // JSON 형식으로 데이터를 클라이언트에 전달
    res.json(rows);
  });
});

// [0226] 회원가입 API
app.post('/signup', (req,res) => {
  // 데이터를 받아올 그릇의 변수들
        const {
          username,
          password,
          pwCheck,
          name,
          address,
          authority,
          icon,
        } = req.body;
                //  리액트에서 받아온 post data의 유효성 검사.
                if (!username || !password || !pwCheck || password !== pwCheck) {
                  return res.status(400).json({ error: '입력값이 올바르지 않습니다.' });
                }
                // mysql 회원가입 쿼리
                const query = `
                    INSERT INTO user (username, password, name, address, authority, icon)
                    VALUES (?, ?, ?, ?, ?, ?)
                  `;
                    //my sql 쿼리 실행문
                  connection.query(query, 
                    [username, password, name, JSON.stringify(address), authority, icon], 
                    (error, results) => {
                    if (error) {
                      console.error('DB확인 요망 post요청 회원가입 기능오류:', error);
                      return res.status(500).json({ error: '회원가입 중 오류가 발생했습니다.' });
                    }

     // 위 코드 실행시 회원가입이 성공하면 세션 설정
                    // isLoggedIn : express-session의 미들웨어로 세션을 
                    // 다룰 때 자동으로 생성되는 변수 라이브러리 세션전용 미들웨어임 그냥.
     req.session.isLoggedIn = true;
     req.session.username = username;

    return res.status(201).json({ success: true });
  });


})


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




// [0229] 로그아웃 API
app.post('/logout', (req, res) => {
  // 세션 파기하고 로그아웃 처리
  req.session.destroy((err) => {
    if (err) {
      console.error('세션 파기 오류:', err);
      return res.status(500).json({ error: '로그아웃 중 오류가 발생했습니다.' });
    }

    // 클라이언트에게 로그아웃 성공 및 리다이렉트를 응답
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
