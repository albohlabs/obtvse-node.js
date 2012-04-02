
var
    storageClient = require('../models/mysql')
  , storage = new (storageClient.MySql)()
  , abstractController = require('./abstract')
  , abstractModel = require('../models/abstract')

/**
 * GET login page
 */

this.index = function(req, res, next) {
    abstractController.getAll(function(posts) {
        res.render('admin-backend', {
            drafts:   posts.drafts
          , publish:  posts.publish
          , layout:   'admin-layout'
        })
    })
}

/**
 * GET login form
 */

this.login = function(req, res) {
    res.render('admin-login', {
        layout: 'admin-layout'
    })
}

/**
 * GET logout page and redirect
 */

this.logout = function(req, res) {
    req.logout()
    res.redirect('/admin')
}

/**
 * POST login
 */

this.postLoginData = function(req, res) {
    var
        usr = abstractModel.config.login.user
      , pw = abstractModel.config.login.password

    if(req.param('username') === usr && req.param('password') === pw){
        req.login()
        res.redirect('/admin')
    }else{
        res.render('admin-login', {
            error: 'Bad login'
        })
    }
}
