const router = require('express').Router();
const util = require('./utils');
const db = require('../lib/db');

router.get('/', (req, res) => {
    
    
    let html = " <h1>메인</h1>"
    if(!util.isLogined(req, res)){
        console.log(`req.user => ${req.user}`);
        html += "<div><a href='/auth/login'>로그인</a> | <a href='/auth/register'>회원가입</a></div>";
        html += "<div>로그인을 하세요</div>";
    }else{
        html += `<div>환영합니다. ${req.user.name} <div>`;
        html += '<a href="/auth/logout">로그아웃 </a>';
    }

    html += "<h2>토픽 목록</h2>";
    let ul = "<ul>";
    const topics = db.get('topics').value();
    console.log('topics => ', topics );
    topics.forEach(topic => {
        let li = `<li id=${topic.id}> `;
        li += `<a href="/topics/${topic.id}"> ${topic.title} </a>`
        li += '</li>';
        ul += li;
    });
    ul += "</ul>";
    html += ul;

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