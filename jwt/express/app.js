/**
 * 演示jwt黑名单
 *  前端将jwt 存在header X-TOKEN 中
 */
const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const users = require('./src/libs/users')
const redis = require('./src/libs/redis')
const jwtBlacklist = require('./src/middleware/jwt-blacklist')
const app = express()
const md5 = require('md5')
app.use(bodyParser.json())
const secretKey = 'awdtagud81g28ge8dg12d1dasfg'
app.post('/auth/login', function (req, res) {
    const {username, password} = req.body;
    const user = users.login(username, password)
    if (!user) {
        res.send(401, '登录失败,检查用户名是否正确!')
        return;
    }
    // 过期时间为30天后。不宜太长
    const jwtStr = jwt.sign({...user, exp: Math.floor(Date.now() / 1000) + (60 * (60 * 24 * 30))}, secretKey)
    // 签名时还可以指定签发人，等等字段 详细： https://github.com/auth0/node-jsonwebtoken
    res.send(jwtStr)
})
app.post('/auth/logout', (req, res) => {
    const {exp, username} = jwt.decode(req.headers['x-token'])
    // redis 中指定过期时间，同jwt一起过期。及时释放内存
    redis.set(`blackList:${md5(req.headers['x-token'])}`, username, {EX: exp - Math.floor(Date.now() / 1000)})
    res.send('注销成功')
})
app.get('/user', jwtBlacklist(), function (req, res) {
    res.send(req.user)
})

app.listen(3001)
