const express = require('express')
    const app = express()

// http://localhost:3030   

app.listen(3030, () => {
        console.log('솔데스크 팀 프로젝트 Node.js 서버실행')
        console.log('" 서버 실행이 성공하였습니다~! ^_^ "')
     })

     app.get('/',  (요청,응답) => {

        응답.sendFile(__dirname + '/index.html')
    })
