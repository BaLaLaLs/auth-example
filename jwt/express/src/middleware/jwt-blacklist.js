const jwt = require("jsonwebtoken");
const redis = require("../libs/redis");
const md5 = require('md5')
/**
 * 验证黑名单中间件
 * @returns {(function(*, *, *): Promise<void>)|*}
 */
module.exports = function () {
    return async (req, res, next) => {
        const token = req.headers['x-token'];
        if (!token) {
            throw new Error('未携带token')
        }
        req.user = jwt.decode(token)
        const isBlack = await redis.get(`blackList:${md5(token)}`)
        if (isBlack) {
            res.status(401).send('token 失效')
            return;
        }
        next()
    }
}
