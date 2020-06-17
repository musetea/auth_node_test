


module.exports = (app, db) => {
    const passport = require('passport');
    const LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());  // 패스포트(설치,초기화)
    app.use(passport.session());     // 패스포트가 세션을 사용함 

    passport.use( new LocalStrategy(
        {
            usernameField : 'email',
            passwordField: 'password'
        },
        function(email, password, done){
            if(!email || !password) {
                return done(null, false, {message : "입력필드 오류입니다. 확인!!!."});
            }
            const user = db.get('users').find({email : email}).value();
            if(!user ){
                return done(null, false, {message : "등록된 사용자가 아닙니다."});
            }
            if(email != user.email){
                return done(null, false, {message : "이메일이 다릅니다."});
            }else{
                if(password != user.password){
                    return done(null, false, {message : "비밀번호가  다릅니다."});
                }
            }
            return done(null,  user);
        }
    ));

    /**
     * 로그인시 한번 호출하고 식별자를 세션에 저장함
     */
    passport.serializeUser((user, done) => {
        console.log(user);
        console.log("serializeUser : " , user.name);
        done(null, user.id);
    });

    /**
     * 사용자검색해서, 사용자 정보 전달 
     * request.user 에 넘겨줌 (정보전달)
     */
    passport.deserializeUser((id, done) => {
        
        const user = db.get('users').find({id:id}).value();
        console.log(`deserializeUser => ${id}, ${user}`);
        done(null, user);
    })
    

    return passport;
};