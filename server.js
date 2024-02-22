const express = require('express');
const app = express();
const ejs = require('ejs');

const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'soldesk',
  password : '1234',
  database : 'soldesk'
});

app.set('view engine', 'ejs');

connection.connect();

// connection.query('SELECT * from user', (error, rows, fields) => {
//   if (error) throw error;
//   console.log('Mysql DB연결 성공');
//   console.log('DB rows :  ', rows);
// });




//  메인페이지

app.get('/',  (req,res) => {

  res.sendFile(__dirname + '/index.html')
});


// users 페이지

app.get('/users', (req, res) => {
    connection.query('SELECT * FROM user', (error, rows, fields) => {
    if (error) throw error;
    // EJS 템플릿을 이용하여 데이터를 HTML로 렌더링
    res.render('users', { users: rows });
    });
});




// 서버실행 : http://localhost:3000
app.listen(3000, () => {
        console.log('node.js 서버 실행 성공');

        process.on('SIGINT', () => {
          console.log('Server is shutting down');
          connection.end();
          process.exit();
        });
     });
    