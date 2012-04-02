/**
 * Module Requirements
 */

var Storage = require('./abstract.js')
  , fs = require('fs')

/**
 * Constructor
 *
 * @api public
 */

function FS(options) {
    Storage.call(this, options)
    var
        self = this
    fs.readdir(self.options.dir, function(err, files) {
        if(!files) return false
        self.count = files.length
    })
}

/**
 * Inherit from Storage
 */

FS.prototype.__proto__ = Storage

/**
 * Add a new Item
 */

FS.prototype.add = function(obj, fn) {
    var
        filenames = fs.readdirSync(this.options.dir + '/')
      , lastIndex = filenames.length
      , id = parseInt(filenames[--lastIndex], 10)

    obj.id = ++id
    fs.writeFile(this.options.dir + '/' + obj.id, JSON.stringify(obj), fn)
    return this
}

/**
 * Find all Items
 *
 * @return object items
 * @param object callback
 */

FS.prototype.find = function(fn) {
    var
        that = this
      , buffer = []
      , fileContent = {}
      , filenames = fs.readdirSync(this.options.dir + '/')

    if(!filenames.length) return fn('No Post!')

    filenames.forEach(function(el, index, arr) {
        fileContent = fs.readFileSync(that.options.dir + '/' + el, 'utf-8')
        buffer.push(JSON.parse(fileContent))
    })

    return fn('', buffer)
}

/**
 * Remove a Item
 * TODO increment all counter couse when new file is written ... last one is overwritten
 */

FS.prototype.remove = function(id, fn) {
    var
        that = this
    fs.unlink(that.options.dir + '/' + id, function(err){
        if(err) throw err
    })
}

/**
 * search for id
 */

FS.prototype.lookup = function(id, fn) {
    var
        that = this
      , file = {}

    file = fs.readFileSync(that.options.dir + '/' + id)
    fn('', JSON.parse(file))
}

/**
 * export constructor
 */

exports = module.exports = FS
