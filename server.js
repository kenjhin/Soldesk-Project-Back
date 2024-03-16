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
// (Icon 저장을 위한 서버사이드 스토리지)
const multer = require('multer'); // 멀터 모듈을 불러옵니다.
const path = require('path'); // path 모듈을 불러옵니다.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // 이미지 파일이 저장될 서버 내 경로
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) // 파일 이름 설정
  }
});


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

// 아이콘 저장 스토리지
const upload = multer({ storage: storage });
app.use('/uploads', express.static('uploads'));







// <초기세팅> 서버 실행시 메인 페이지 라우팅
app.get('/',  (req,res) => {
  res.sendFile(__dirname + '/index.html')
});




// <POST> 회원가입 API
app.post('/signup', (req, res) => {
  // 요청 본문에서 데이터 추출
  const { username, password, confirmPassword, nickname, address, authority } = req.body;
  const addressString = JSON.stringify(address);
  // 입력값 유효성 검사
  if (!username || !password || !confirmPassword || password !== confirmPassword) {
    return res.status(400).json({ error: '입력값이 올바르지 않습니다.' });
  }

  // 기본 보유 아이콘목록
  const default_ownedIcon = [0];

  // MySQL 회원가입 쿼리
  const query = `
  INSERT INTO user (username, password, nickname, address, authority)
  VALUES (?, ?, ?, ?, ?)
`;
  connection.query(query, 
    [username, password, nickname, addressString, authority], // 여기에서 address 대신 addressString 사용
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
    if (!req.session.username) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }
  
    const username = req.session.username;
  
    // 유저 친구 정보 조회
    const selectQuery = 'SELECT group_name, friend_id FROM user_friends WHERE user_id = ?';
    connection.query(selectQuery, [username], (error, friendResults) => {
      if (error) {
        console.error('DB 조회 오류:', error);
        return res.status(500).json({ message: 'user_friends를 조회할 수 없습니다.' });
      }
  
      // 친구 목록의 프로필 메시지 조회
      const friendIds = friendResults.map(result => result.friend_id); // 여기가 수정된 부분입니다.
      const profileQuery = 'SELECT username, nickname, profile_message, current_icon FROM user WHERE username IN (?)';
      connection.query(profileQuery, [friendIds], (error, profileResults) => {
        if (error) {
          console.error('프로필 조회 오류:', error);
          return res.status(500).json({ success: false, error: '프로필을 조회할 수 없습니다.' });
        }
  
        // 프로필 메시지를 결과에 추가
        const resultsWithProfile = friendResults.map(friendResult => {
          const profile = profileResults.find(profile => profile.username === friendResult.friend_id);
          return {
            ...friendResult,
            profile_message: profile ? profile.profile_message : null,
            nickname: profile ? profile.nickname : null,
            current_icon: profile ? profile.current_icon : null,
          };
        });
  
        res.json(resultsWithProfile);
      });
    });
  });

app.get('/Users/Nickname', (req, res) => {
  // DB에서 user_friends 테이블값 중에 user_id가 나인 것만
  const selectQuery = 'SELECT nickname FROM user';
  connection.query(selectQuery, (error, results) => {
    if (error) {
      console.error('DB 조회 오류:', error);
      return res.status(500).json({ success: false, error: 'Users.Nickname을 조회할 수 없습니다.' });
    }

    res.json(results);
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
  const query = 'SELECT id, title, user_id, content, writer, created_at, views, likes FROM post WHERE board_id = ? ORDER BY created_at ASC';
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
  const { title, content, likes, views } = req.body; // 수정시 본문에서 제목과 내용 추출 / 좋아요 눌렀을 때 / 게시물열릴때

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
    
    // 좋아요눌렀으면
    if(likes){
      const updateQuery = 'UPDATE post SET likes = ? WHERE id = ?';
      connection.query(updateQuery, [likes, id], (updateError, updateResults) => {
        if (updateError) {
          console.error('좋아요 수정 에러:', updateError);
          return res.status(500).json({ message: '좋아요 수정에 실패 했습니다.' });
        }
        
        if (updateResults.affectedRows === 0) {
          // 이 경우는 실제로 발생하지 않을 것이지만, 쿼리가 실행되었으나 업데이트되지 않은 경우를 처리
          return res.status(404).json({ message: '게시물이 업데이트되지 않았습니다.' });
        }
        res.json();
      });
    }

    // 게시물 새로고침될때
    if(views){
      const updateQuery = 'UPDATE post SET views = ? WHERE id = ?';
      connection.query(updateQuery, [views, id], (updateError, updateResults) => {
        if (updateError) {
          console.error('조회수 수정 에러:', updateError);
          return res.status(500).json({ message: '조회수 수정에 실패 했습니다.' });
        }
        
        if (updateResults.affectedRows === 0) {
          // 이 경우는 실제로 발생하지 않을 것이지만, 쿼리가 실행되었으나 업데이트되지 않은 경우를 처리
          return res.status(404).json({ message: '게시물이 업데이트되지 않았습니다.' });
        }
        res.json();
      });
    }

    // 수정경로로 들어갔으면
    if(title){
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
    }
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


  const userQuery = 'SELECT username FROM user WHERE username = ?';
  connection.query(userQuery, [receiverId], (error, results) => {
    if (error || results.length === 0) {
      console.error('(Chat)User fetch error:', error);
      return res.status(500).json({ message: '(Chat)User fetch error' });
    }

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

// 친추 받아오기
app.get('/friendRequest/receive', (req, res) => {
  const username = req.session.username;

  const selectQuery = `
    SELECT fr.id, fr.sender_id, fr.receiver_id, fr.status, u.nickname 
    FROM friend_requests fr 
    INNER JOIN user u ON fr.sender_id = u.username 
    WHERE fr.receiver_id = ? AND fr.status = 'awaiting'
  `;
  connection.query(selectQuery, [username], (error, results) => {
    if (error) {
      console.error('Fetch friend-requests error:', error);
      return res.status(500).json({ message: 'Error fetching friend-requests' });
    }

    res.json(results);
  });
});

// 친추 보내기
app.post('/friendRequest/send', (req, res) => {
  const { senderId, receiverNickname } = req.body;

  const userQuery = 'SELECT username FROM user WHERE nickname = ?';
  connection.query(userQuery, [receiverNickname], (error, results) => {
    if (error || results.length === 0) {
      console.error('(Chat)User fetch error:', error);
      return res.status(500).json({ message: '(Chat)User fetch error' });
    }

    const receiverId = results[0].username;

    // 채팅 Insert Query
    const insertQuery = 'INSERT INTO friend_requests (sender_id, receiver_id) VALUES (?, ?)';
    connection.query(insertQuery, [senderId, receiverId ], (insertError, insertResults) => {
      if (insertError) {
        console.error('Insert friend-request error:', insertError);
        return res.status(500).json({ message: 'Insert friend-request error' });
      }
      
      res.status(201).json({ message: 'friend-request created successfully' });
    });
  });
});

app.put('/friendRequest/accept', (req, res) => {
  const { requestId } = req.body;

  const getRequestQuery = 'SELECT * FROM friend_requests WHERE id = ?';
  connection.query(getRequestQuery, [requestId], (error, results) => {
    if (error) {
      console.error('Friend request fetch error:', error);
      return res.status(500).json({ message: 'Friend request fetch error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    const request = results[0];
    
    // user_friend 테이블에 새로운 친구 관계 추가
    const addFriendQuery = 'INSERT INTO user_friends (user_id, friend_id) VALUES (?, ?), (?, ?)';
    connection.query(addFriendQuery, [request.sender_id, request.receiver_id, request.receiver_id, request.sender_id], (addFriendError) => {
      if (addFriendError) {
        console.error('Add friend error:', addFriendError);
        return res.status(500).json({ message: 'Add friend error' });
      }

      const updateRequestQuery = 'UPDATE friend_requests SET status = "accepted" WHERE id = ?';
      connection.query(updateRequestQuery, [requestId], (error, results) => {
        if (error) {
          console.error('Friend request update error:', error);
          return res.status(500).json({ message: 'Friend request update error' });
        }

        // 요청이 성공적으로 업데이트되었음을 클라이언트에 응답
        res.status(200).json({ message: 'Friend request accepted successfully' });
      });
    });
  });
});

app.put('/friendRequest/reject', (req, res) => {
  const { requestId } = req.body;

  // friend_request 테이블에서 해당 요청을 업데이트
  const updateRequestQuery = 'UPDATE friend_requests SET status = "rejected" WHERE id = ?';
  connection.query(updateRequestQuery, [requestId], (error, results) => {
    if (error) {
      console.error('Friend request update error:', error);
      return res.status(500).json({ message: 'Friend request update error' });
    }

    // 요청이 성공적으로 업데이트되었음을 클라이언트에 응답
    res.status(200).json({ message: 'Friend request rejected successfully' });
  });
});

// 아이콘 Update
app.put('/icon/set', (req, res) => {
  const { currentIcon, username } = req.body;

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

// Admin 아이콘 업로드 API
app.post('/upload-icon', upload.single('iconFile'), (req, res) => {
  const { iconName, iconPrice } = req.body;
  const iconFile = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  try {
    // 데이터베이스에 아이콘 정보 저장
    connection.query('INSERT INTO icon_shop (IconName, IconFile, IconPrice) VALUES (?, ?, ?)', [iconName, iconFile, iconPrice], (error, results, fields) => {
      if (error) {
        console.error('데이터 베이스 에러입니다!:', error);
        res.status(500).send('운영자님! DB에 아이콘을 업로드 하지 못했어요.');
      } else {
        console.log('Inserted Icon ID:', results.insertId); // 삽입된 아이콘의 ID 출력
        res.send('운영자님! 아이콘을 성공적으로 등록하였읍니다.');
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal server error');
  }
});

// 아이콘 스토어 LIST
app.get('/api/icons', (req, res) => {
  try {
    // 데이터베이스에서 아이콘 목록을 조회
    connection.query('SELECT * FROM icon_shop', (error, results, fields) => {
      if (error) {
        console.error('Icon_shop테이블 데이터 에러:', error);
        res.status(500).send('아이콘샵의 데이터베이스를 잃지 못했읍니당.');
      } else {
        res.json(results); // 조회된 아이콘 목록을 JSON 형태로 응답
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal server error');
  }
});

// 아이콘스토어 구매요청
app.post('/api/purchase', (req, res) => {
  const { userId, iconId } = req.body;

  connection.beginTransaction(err => {
    if (err) {
      console.error('트랜잭션 시작 오류:', err);
      return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }

    connection.query('SELECT point FROM user WHERE id = ?', [userId], (error, results) => {
      if (error || results.length === 0) {
        console.error('유저 포인트 조회 오류:', error);
        return connection.rollback(() => {
          return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        });
      }

      const userPoint = results[0].point;
      connection.query('SELECT IconPrice, IconFile FROM icon_shop WHERE IconID = ?', [iconId], (error, results) => {
        if (error || results.length === 0) {
          console.error('아이콘 조회 오류:', error);
          return connection.rollback(() => {
            return res.status(404).json({ success: false, message: '아이콘을 찾을 수 없습니다.' });
          });
        }

        const iconPrice = results[0].IconPrice;
        const iconFileURL = results[0].IconFile; // 여기서 IconFile URL을 추출

        if (userPoint < iconPrice) {
          return connection.rollback(() => {
            return res.status(400).json({ success: false, message: '포인트가 부족합니다.' });
          });
        }

        const newPoint = userPoint - iconPrice;
        connection.query('UPDATE user SET point = ? WHERE id = ?', [newPoint, userId], (error, results) => {
          if (error) {
            console.error('포인트 업데이트 오류:', error);
            return connection.rollback(() => {
              return res.status(500).json({ success: false, message: '포인트 업데이트 중 오류가 발생했습니다.' });
            });
          }

          connection.query('UPDATE user_icons SET isCurrent = 0 WHERE UserID = ?', [userId], (error, results) => {
            if (error) {
              console.error('isCurrent 업데이트 오류:', error);
              return connection.rollback(() => {
                return res.status(500).json({ success: false, message: 'isCurrent 업데이트 중 오류가 발생했습니다.' });
              });
            }

            const acquisitionDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
            connection.query('INSERT INTO user_icons (UserID, IconID, isCurrent, acquisitionDate) VALUES (?, ?, 1, ?)',
              [userId, iconId, acquisitionDate], (error, results) => {
                if (error) {
                  console.error('아이콘 구매 정보 추가 오류:', error);
                  return connection.rollback(() => {
                    return res.status(500).json({ success: false, message: '아이콘 구매 정보 추가 중 오류가 발생했습니다.' });
                  });
                }

                connection.commit(err => {
                  if (err) {
                    console.error('트랜잭션 커밋 오류:', err);
                    return connection.rollback(() => {
                      return res.status(500).json({ success: false, message: '트랜잭션 커밋 중 오류가 발생했습니다.' });
                    });
                  }

                  // 구매 성공 응답, 이전에 추출한 iconFileURL을 사용하여 응답
                  res.json({ success: true, message: '아이콘 구매가 완료되었습니다.', iconFileURL: iconFileURL });
                });
              });
          });
        });
      });
    });
  });
});




// 사용자의 아이콘 목록 조회 API
app.get('/api/user-icons/:userId', (req, res) => {
  // URL 경로로부터 userId를 추출하기.
  const { userId } = req.params;

  // user_icons 테이블과 icon_shop 테이블을 조인하여 사용자가 보유한 아이콘과 해당 URL 정보를 조회
  const query = `
    SELECT user_icons.UserIconID, 
    user_icons.UserID, user_icons.IconID, 
    user_icons.isCurrent, 
    user_icons.AcquisitionDate, 
    icon_shop.IconFile AS IconURL FROM user_icons JOIN icon_shop ON user_icons.IconID = icon_shop.IconID
    WHERE user_icons.UserID = ?
  `;

  connection.query(query, [userId], (error, results) => {
    if (error) {
      console.error("Error fetching user icons:", error);
      return res.status(500).send({ success: false, message: "Error fetching user icons" });
    }

    res.send(results);
  });
});



// 현재 아이콘 선택 함수.
app.post('/api/user-icons/set-current/:userId', (req, res) => {
  const userId = req.params.userId; // URL에서 사용자 ID를 가져옵니다.
  const { iconId } = req.body; // 요청 본문에서 아이콘 ID를 가져옵니다.

  // 먼저 모든 아이콘의 isCurrent를 false로 설정합니다.
  const resetQuery = 'UPDATE user_icons SET isCurrent = false WHERE UserID = ?';
  connection.query(resetQuery, [userId], (error, results) => {
    if (error) {
      console.error("Error resetting user icons:", error);
      return res.status(500).send("Failed to reset user icons.");
    }

    // 그 다음 선택된 아이콘의 isCurrent를 true로 설정합니다.
    const updateQuery = 'UPDATE user_icons SET isCurrent = true WHERE UserID = ? AND IconID = ?';
    connection.query(updateQuery, [userId, iconId], (error, results) => {
      if (error) {
        console.error("Error setting current icon:", error);
        return res.status(500).send("Failed to set current icon.");
      }

      if (results.affectedRows > 0) {
        res.send("Current icon updated successfully.");
      } else {
        // 이 경우는 일반적으로 발생하지 않지만, 만약 업데이트할 아이콘이 없으면 클라이언트에게 알립니다.
        res.status(404).send("Icon not found.");
      }
    });
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
