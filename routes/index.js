const router = require('express').Router();
const util = require('./utils');

router.get('/', (req, res) => {
    console.log(`req.user => ${req.user}`);
    
    let html = " <h1>메인</h1>"
    if(!util.isLogined(req, res)){
        html += "<div>로그인을 하세요</div>";
        html += "<div><a href='/auth/login'>로그인 </a></div>";
        html += "<div><a href='/auth/register'>회원가입</a></div>";
    }else{
        html += `<div>환영합니다. ${req.user.name} <div>`;
        html += '<a href="/auth/logout">로그아웃 </a>';
    }

    html +=  `
        <h2>토픽</h2>
        <div>
            <a href="/topics/create">토픽생성</a>
        </div>
    `

    
    res.send(
        html
    );
})

module.exports = router;