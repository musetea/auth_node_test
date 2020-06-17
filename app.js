const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const redisStore = require('connect-redis')(session);  // 레디스를 섹션 저장소 사용 
const redis = require('redis');


const app = express();
const logger = require('./lib/logs');
const lowDb = require('./lib/db');

//console.log(lowDb);


app.use(bodyParser.urlencoded({ extended : false }));
const redisCfg  = require('./config/redis.json');
const redisClient = redis.createClient({
    host:redisCfg.host,
    port:redisCfg.port,
    password:redisCfg.password
});
app.use(session({
    secret:"secret",
    resave:false,
    saveUninitialized: true,
    client : redisClient,
    ttl : 86400
}));
app.use(flash());   // 세션다음에 설치함 




const passport = require('./lib/passport')(app, lowDb);

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth')(passport, lowDb);
const topicRouter = require('./routes/topics');


app.use(logger);
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/topics', topicRouter);


app.listen(3000, () => console.log('http://localhost:3000 구동중...'));
