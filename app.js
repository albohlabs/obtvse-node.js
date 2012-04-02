
/**
 * Module dependencies.
 */

var express = require('express')
  , secure = require('./lib/helpers/secure')
  , posts = require('./lib/controllers/posts')
  , admin = require('./lib/controllers/admin')
  , h5bp = require('./lib/externals/h5bp-node')

  , abstractModel = require('./lib/models/abstract')

/**
 * console trace by Guillermo Rauch
 * source: https://github.com/LearnBoost/console-trace
 */

require('./lib/externals/console-trace')

/**
 * Webserver configuration
 * source: https://github.com/h5bp/server-configs
 */

var app = module.exports = h5bp.server(express, {
    'root': './public'
})

// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views')
    app.set('view engine', 'jade')
    app.use(express.bodyParser())
    app.use(express.methodOverride())
    app.use(express.cookieParser())
    app.use(express.session({ secret: '#Thij`YVv2OEz8UcqX' }))
    app.use(app.router)
    app.use(express.static(__dirname + '/public'))
})

// set env
app.settings.env = abstractModel.config.env

app.configure('dev', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))
})

app.configure('prod', function(){
    app.use(express.errorHandler())
})

// Routes :: controller :: posts

app.get('/', posts.index)
app.get('/page/:count', posts.index)

app.get('/post/single/:id', posts.single)
app.get('/post/preview/:id', secure, posts.preview)
app.get('/post/remove/:id', secure, posts.remove)
app.get('/post/edit/:id', secure, posts.edit)

app.get('/post/create', secure, posts.create)
app.post('/post/create', secure, posts.create)

app.post('/post/save', secure, posts.save)
app.post('/post/update/:id', secure, posts.update)

// Routes :: controller :: admin

app.get('/admin', secure, admin.index)
app.get('/admin/login', admin.login)
app.get('/admin/logout', admin.logout)

app.post('/admin/login', admin.postLoginData)


app.listen(abstractModel.config.PORT)
console.t.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env)
