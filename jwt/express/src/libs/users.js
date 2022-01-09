const users = [
    {"username": "test1", password: '123456', age: 11},
    {"username": "test2", password: '123456', age: 23}
]
users.login = function (username, password) {
    return users.find(i => {
        return i.username === username && i.password === password
    });
}
module.exports = users
