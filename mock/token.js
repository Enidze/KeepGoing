// 引入模块依赖
// const md5 = require("md5-node")
const redis = require("redis");
const uuid = require('node-uuid');

const config = {
    host: '127.0.0.1',
    port: '6379',
    // password: '123456',
};
const RedisClient = redis.createClient(config);

// 创建 token 类
class token {
    constructor(data) {
        this.data = data;
        this.token = uuid.v1(); // 时间戳和随机数字生成
    }
    //生成token
    createToken() {
        // console.log('enter func createToken');
        let key = this.data.id;
        let token = this.token;
        // 存入缓存
        // redis.setex(token, 24 * 60 * 60 * 7, obj.id); // 缓存7天
        RedisClient.set(key,token);
        RedisClient.expire(key,24 * 60 * 60 * 7);// 缓存10分钟
        return token
    }

    // 校验token
    async verifyToken() {
        let key = this.data.id;
        let token = this.data.token;
        let flag = '';
        let value = await new Promise((resolve => {
            RedisClient.get(key, function (err, res) {
                return resolve(res);
            });
        }));
        if (value === token){
            // console.log('verityToken success--->:'+ value);
            return 'success'
        }else {
            // console.log('verityToken error');
            return 'error'
        }
    }

    // 退出登陆，删除redis缓存
    async clearToken() {
        let key = this.data.id;
        let value = await new Promise((resolve => {
            RedisClient.get(key, function (err, res) {
                return resolve(res);
            });
        }));
        if (value) {
            RedisClient.del(key);
            // console.log('clearToken success--->:'+value);
            return 'success';
        } else {
            // console.log('clearToken error');
            return 'error';
        }
    }
}

module.exports = token;