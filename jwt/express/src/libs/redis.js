const {createClient} = require("redis");
const redis = createClient(); // 使用默认配置
redis.connect().then(() => {
    console.log('redis 连接成功');
})
module.exports = redis
