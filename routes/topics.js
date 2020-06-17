const router = require('express').Router();
const util = require('./utils');
const rowDb = require('../lib/db');
const db = require('../lib/db');
const shortId = require('shortid');




router.get('/create', (req, res) => {
    if(!util.isLogined(req, res)){
        console.log('로그인필요 !!!')
        return res.redirect('/');
    }
    else{
        let html = ' <h1>토픽 작성</h1>';
        let form = `
        <form action="/topics/create" method="post">
        <div>
            <p><label for="title" >제목 </label></p>
            <p><input type="text" id="title" name="title" /></p>
        </div>
        <div>
            <p><label for="description">상세내용 </label></p>
            <p><textarea cols="50" rows="10" id="description" name="description"></textarea></p>
        </div>
        <div>
            <button type="submit">작성하기</button>
        </div>
        </form>
        `
        html += form;


        return res.send(
            html
        );

    }
    
});

router.post('/create', (req, res) => {
    if(!util.isLogined(req, res)){
        console.log('로그인필요 !!!')
        return res.redirect('/');
    }
    else{
        console.log(req.user.id);

        const { title, description} = req.body;
        const userId = req.user.id;
        const newTopic = {
            id : shortId.generate(),
            title : title,
            description : description,
            userId : userId
        }
        const result = db.get('topics').push(newTopic).write();
        console.log(result);

        res.redirect(`/topics/${newTopic.id}`);

    }
});

router.get('/:topicId', (req, res) => {
    if(!util.isLogined(req, res)){
        console.log('로그인필요 !!!')
        return res.redirect('/auth/login');
    }
    else{
        console.log(req.user);
        
        const userName = req.user.userName;
        const reqId = req.params.topicId;
        const topic = db.get('topics').find({id:reqId}).value();
        console.log(topic);

        if(!topic){
            return res.redirect('/');
        }
        console.log(reqId, userName,topic);
        const title = topic.title;
        const description = topic.description;
        const user = topic.user;

        let html =`<div> ${userName} | <a href="/auth/logout">로그아웃</a></div>`;

        html += "<h2>토픽 목록</h2>";
        let lists = "<ul>";
        
        const topics = db.get('topics').value();
        for(let i=0; i<topics.lengths; i++){
            const topic = topics[i];
            let li = `<li id=${topic.id}> `;
                li += `<a href="/topics/${topic.id}"> ${topic.title} </a>`
                li += '</li>';
            lists += li;
        }
        lists += "</ul>";
        html += lists;

        html += "</br>"
        html += "<h2>상세내역</h2>";




        res.send(
            html
        )


    }
})

module.exports = router;