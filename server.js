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
    user     : 'root',
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
  const { username, password, confirmPassword, nickname, address, authority, icon } = req.body;
  const addressString = JSON.stringify(address);
  // 입력값 유효성 검사
  if (!username || !password || !confirmPassword || password !== confirmPassword) {
    return res.status(400).json({ error: '입력값이 올바르지 않습니다.' });
  }

    // MySQL 회원가입 쿼리
  const query = `
  INSERT INTO user (username, password, nickname, address, authority, current_icon)
  VALUES (?, ?, ?, ?, ?, ?)
`;

  // MySQL 쿼리 실행, addressString을 쿼리 파라미터로 전달

  connection.query(query, 
    [username, password, nickname, addressString, authority, icon], // 여기에서 address 대신 addressString 사용
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
    connection.query('SELECT * FROM user WHERE username = ?', [username], (error, results) => {
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

app.get('/userFriends', (req, res) => {
  const username = req.session.username;

  // DB에서 user_friends 테이블값 중에 user_id가 나인 것만
  const selectQuery = 'SELECT group_name, friend_id FROM user_friends WHERE user_id = ?';
  connection.query(selectQuery, [username], (error, results) => {
    if (error) {
      console.error('DB 조회 오류:', error);
      return res.status(500).json({ success: false, error: 'user_friends를 조회할 수 없습니다.' });
    }

    // 친구 목록의 프로필 메시지 조회
    const friendIds = results.map(result => result.friend_id);
    const profileQuery = 'SELECT username, nickname, profile_message, current_icon FROM user WHERE username IN (?)';
    connection.query(profileQuery, [friendIds], (error, profileResults) => {
      if (error) {
        console.error('프로필 조회 오류:', error);
        return res.status(500).json({ success: false, error: '프로필을 조회할 수 없습니다.' });
      }

      // 프로필 메시지를 결과에 추가
      for (const result of results) {
        const profile = profileResults.find(profile => profile.username === result.friend_id);
        if (profile) {
          result.profile_message = profile.profile_message;
          result.nickname = profile.nickname;
          result.current_icon = profile.current_icon;
        }
      }

      // 최종 결과 반환 
      res.json(results);
    });
  });
});

app.put('/profileMessage', (req, res) => {
  const { profileMessage, username } = req.body;

  const updateQuery = 'UPDATE user SET profile_message = ? WHERE username = ?';
  connection.query(updateQuery, [profileMessage, username], (updateError, results) => {
    if (updateError) {
      console.error('Update profileMessage error:', updateError);
      return res.status(500).json({ message: 'Update profileMessage error' });
    }

    // 최종 결과 반환
    res.json(results);
  });
});


// 게시물 작성 POST
app.post('/api/posts', (req, res) => {
  const { title, content, boardId, writerId } = req.body;

  const userQuery = 'SELECT nickname FROM user WHERE username = ?';
  connection.query(userQuery, [writerId], (error, results) => {
    if (error || results.length === 0) {
      console.error('User fetch error:', error);
      return res.status(500).json({ message: 'User fetch error' });
    }

    const writerNickname = results[0].nickname;

    const insertQuery = 'INSERT INTO post (title, content, user_id, board_id, writer) VALUES (?, ?, ?, ?, ?)';
    connection.query(insertQuery, [title, content, writerId, boardId, writerNickname], (insertError, insertResults) => {
      if (insertError) {
        console.error('Insert post error:', insertError);
        return res.status(500).json({ message: 'Insert post error' });
      }

      res.status(201).json({ message: 'Post created successfully' });
    });
  });
});


// 게시물 리스트 가져오기 GET
app.get('/api/posts/list', (req, res) => {
  const { boardId } = req.query;
  // board_id에 해당하는 게시물 쿼리 전부 조회하기
  const query = 'SELECT id, title, user_id, content, board_id, writer, created_at, views, likes FROM post WHERE board_id = ? ORDER BY created_at ASC';
  connection.query(query, [boardId], (error, results) => {
    if (error) {
      console.error('Fetch posts error:', error);
      return res.status(500).json({ message: 'Error fetching posts' });
    }

    res.json(results);
  });
});

// 게시물 홈화면에 좋아요 순으로 표시
app.get('/api/posts/likes', (req, res) => {
  const query = 'SELECT * FROM post ORDER BY likes DESC';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('게시글 가져오기 실패:', error);
      return res.status(500).json({ message: '서버 오류로 인해 게시글을 가져올 수 없습니다.' });
    }
    res.status(200).json(results);
  });
});


// <PUT> 게시판 수정 API
app.put('/api/posts/:id', (req, res) => {
  const { id } = req.params; // URL에서 게시물 ID 추출
  const { title, content } = req.body; // 요청 본문에서 제목과 내용 추출

  // 게시물이 존재하는지 확인하는 쿼리
  const checkQuery = 'SELECT * FROM post WHERE id = ?';
  connection.query(checkQuery, [id], (checkError, checkResults) => {
    if (checkError) {
      console.error('게시물-DB 체크 오류:', checkError);
      return res.status(500).json({ message: '게시물 찾기에 실패했음.' });
    }

    if (checkResults.length === 0) {
      return res.status(404).json({ message: '게시물이 존재하지 않습니다.' });
    }

    // 게시물 업데이트 쿼리
    const updateQuery = 'UPDATE post SET title = ?, content = ? WHERE id = ?';
    connection.query(updateQuery, [title, content, id], (updateError, updateResults) => {
      if (updateError) {
        console.error('게시물 수정 에러:', updateError);
        return res.status(500).json({ message: '게시물 수정에 실패 했습니다.' });
      }

      if (updateResults.affectedRows === 0) {
        // 이 경우는 실제로 발생하지 않을 것이지만, 쿼리가 실행되었으나 업데이트되지 않은 경우를 처리
        return res.status(404).json({ message: '게시물이 업데이트되지 않았습니다.' });
      }

      res.json({ message: '게시물이 성공적으로 수정되었습니다.' });
    });
  });
});






// <DELETE> 게시물 삭제하기 
app.delete('/api/posts/:id', (req, res) => {
  const { id } = req.params; // URL에서 게시물 ID 추출

  const deleteQuery = 'DELETE FROM post WHERE id = ?';
  connection.query(deleteQuery, [id], (deleteError, deleteResults) => {
    if (deleteError) {
      console.error('게시물 삭제 에러:', deleteError);
      return res.status(500).json({ message: '게시물 삭제에 실패 했습니다.' });
    }

    if (deleteResults.affectedRows === 0) {
      return res.status(404).json({ message: '게시물이 존재하지 않거나 이미 삭제되었습니다.' });
    }

    res.json({ message: '게시물이 성공적으로 삭제되었습니다.' });
  });
});

// 댓글 목록 불러오기
app.get('/api/posts/:postId/comments', (req, res) => {
  const { postId } = req.params;

  const query = 'SELECT * FROM comment WHERE post_id = ?';
  connection.query(query, [postId], (error, results) => {
      if (error) {
          console.error('댓글 불러오기 실패 :', error);
          return res.status(500).json({ message: '댓글 불러오기 실패 ' });
      }
      res.json(results);
  });
});

// 댓글 추가
app.post('/api/posts/:postId/comments', (req, res) => {
  const { postId } = req.params;
  const { writer, content, board_id } = req.body;

  const query = 'INSERT INTO comment (post_id, writer, content, board_id) VALUES (?, ?, ?, ?)';
  connection.query(query, [postId, writer, content, board_id], (error, results) => { 
      if (error) {
          console.error('댓글 추가 중 에러:', error);
          return res.status(500).json({ message: '댓글 추가 실패' });
      }
      res.status(201).json({ message: '댓글 추가 성공', commentId: results.insertId });
  }); 
});

// 댓글 삭제하기
app.delete('/api/comments/:commentId', (req, res) => {
  
  const { commentId } = req.params;
  
  const query = 'DELETE FROM comment WHERE comment_id = ?';
  connection.query(query, [commentId], (error, results) => {
    if (error) {
      console.error("댓글 삭제 중 오류 발생:", error);
      res.status(500).json({ message: "댓글 삭제에 실패했습니다." });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ message: "해당 댓글을 찾을 수 없습니다." });
    } else {
      res.status(200).json({ message: "댓글이 성공적으로 삭제되었습니다." });
    }
  });
});

// 댓글 수정
app.put('/api/comments/:commentId', (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "댓글 내용을 입력해주세요." });
  }

  const query = 'UPDATE comment SET content = ? WHERE comment_id = ?';
  connection.query(query, [content, commentId], (error, results) => {
    if (error) {
      console.error("댓글 수정 중 오류 발생:", error);
      return res.status(500).json({ message: "댓글 수정에 실패했습니다." });
    } else if (results.affectedRows === 0) {
      return res.status(404).json({ message: "해당 댓글을 찾을 수 없습니다." });
    } else {
      return res.status(200).json({ message: "댓글이 성공적으로 수정되었습니다." });
    }
  });
});


// 채팅 가져오기 GET
app.get('/chatData', (req, res) => {
  const username = req.session.username;

  const selectQuery = `SELECT created_at, sender_id, receiver_id, content FROM chat WHERE sender_id = ? or receiver_id = ?`;
  connection.query(selectQuery, [username, username], (error, results) => {
  if (error) {
    console.error('Fetch posts error:', error);
    return res.status(500).json({ message: 'Error fetching posts' });
  }

    res.json(results);
  });
});

// 채팅 DB로 보내기
app.post('/chat/send', (req, res) => {
  const { senderId, receiverId, content } = req.body;
  // console.log([senderId, receiverId, content])

  const userQuery = 'SELECT username FROM user WHERE username = ?';
  connection.query(userQuery, [receiverId], (error, results) => {
    if (error || results.length === 0) {
      console.error('User fetch error:', error);
      return res.status(500).json({ message: 'User fetch error' });
    }
    // console.log(`chat send : ${results}`);

    // 채팅 Insert Query
    const insertQuery = 'INSERT INTO chat (sender_id, receiver_id, content) VALUES (?, ?, ?)';
    connection.query(insertQuery, [senderId, receiverId, content], (insertError, insertResults) => {
      if (insertError) {
        console.error('Insert chat error:', insertError);
        return res.status(500).json({ message: 'Insert chat error' });
      }
      
      res.status(201).json({ message: 'Chat created successfully' });
    });
  });
});

// 아이콘 Update
app.put('/icon/set', (req, res) => {
  const { currentIcon, username } = req.body;
  console.log([currentIcon, username]);

  const updateQuery = 'UPDATE user SET current_icon = ? WHERE username = ?';
  connection.query(updateQuery, [currentIcon, username], (updateError, results) => {
    if (updateError) {
      console.error('Update currentIcon error:', updateError);
      return res.status(500).json({ message: 'Update currentIcon error' });
    }

    // 최종 결과 반환
    res.json(results);
  });
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
