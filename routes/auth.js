module.exports = (passport, db) => {
    //console.log(passport);
    const router = require('express').Router();
    const shortId = require('shortid');

    router.get('/login', (req, res) => {
      //  console.log('/login in');
        let html = ' <h1>로그인</h1>';

        const flashMsg = req.flash();
        const error = '';
        if(flashMsg.error){
            html += `<div style="color:red;">${flashMsg.error}</div>`
        }
        html += `
           
        <form action="/auth/login" method="post">
            <label for="name">이메일</label>
            <input type="email" id="email" name="email" value="a@email.com" />
            <label for="password">비밀번호</label>
            <input type="password" id="password" name="password" value="1230" />
            <button type="submit">로그인</button>
        </form>
        <div><a href="/auth/register">회원가입</a></div>
    `
      
        res.send(html);
    });
    router.post('/login', //(req, res) => {
        //console.log(req.body);

        passport.authenticate('local', {
            successRedirect : '/',
            failureRedirect : '/auth/login',
            failureFlash : true,

        }));
    

    router.get('/logout', (req, res) => {
        req.logOut();
        /*req.session.destroy((err) => {
            if(err) console.log(err);
            res.redirect('/');
        })*/;
        req.session.save(()=> res.redirect('/'));
        //res.redirect('/');
        
    });

    router.get('/register', (req, res) => {
        let html = '<h1>회원가입</h1>';

        const flashMsg = req.flash();
         if(flashMsg.error){
            html += `<div style="color:red;">${flashMsg.error}</div>`
        }

        html += `
        <form action="/auth/register" method="post">
            <div>
                <label for="name">이름</label>
                <input type="text" id="name" name="name"  />
            </div>
            <div>
                <label for="email">이메일</label>
                <input type="email" id="email" name="email" />
            </div>
            <div>
                <label for="password">비밀번호</label>
                <input type="password" id="password" name="password" />
            </div>
            <div>
                <label for="password2">비밀번호확인</label>
                <input type="password" id="password2" name="password2" />
            </div>
            <button type="submit">가입하기</button>
        </form>
        `

        res.send(html);

    })
    router.post('/register', (req, res) => {
        const { name, email, password, password2 } = req.body;

        if(!name || !email || !password || !password2){
            req.flash("error", "입력필드 오류입니다. 체크해주세요!!!");
          
            return res.redirect('/auth/register');
        }
        if( password  !== password2) {
            req.flash("error", "비밀번호 검증 오류입니다. 체크해주세요!!!")
            return res.redirect('/auth/register');
        }

        const newUser ={
            id : shortId.generate(),
            name,
            email,
            password
        };
        db.get('users').push(newUser).write();
        req.login(newUser, (err) => {
            if(err) console.log(err);
            res.redirect('/')
        })

        
    })


    return router;
};