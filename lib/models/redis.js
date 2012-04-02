/**
 * redis storage implementation
 */

var
    Storage = require('./abstract')
  , client = require('redis').createClient()

client.on('error', function(err) {
    console.log(err)
})

/**
 * Constructor
 */

function Redis() {}

/**
 * inherit from Storage
 */

Redis.prototype.__proto__ = Storage

/**
 * add new item
 */

Redis.prototype.add = function(obj, fn) {
    client.HINCRBY('posts', 'id', 1)
    client.HGET('posts', 'id', function(err, id) {
        obj.id = id
        client.HSET('posts', obj.id, JSON.stringify(obj), fn)
    })
}

/**
 * find all items
 */

Redis.prototype.find = function(fn) {
    client.HKEYS('posts', function(err, obj) {
        var
            posts = []
          , ln = obj.length-2

        if(ln === -1) {
            fn()
        }

        obj.forEach(function (id, i) {
            if(id !== 'id') {
                client.HGET('posts', id, function(err, data) {
                    posts.push(JSON.parse(data))
                    if(i >= ln) {
                        fn(err, posts)
                    }
                })
            }
        })
    })
}

/**
 * remove a item
 */

Redis.prototype.remove = function(id, fn) {
    client.HDEL('posts', id)
    fn()
}

/**
 * search item
 */

Redis.prototype.lookup = function(id, fn) {
    client.HGET('posts', id, function(err, obj) {
        fn(err, JSON.parse(obj))
    })
}

/**
 * export constructor
 */

exports = module.exports = Redis
