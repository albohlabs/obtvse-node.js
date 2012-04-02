
// var storage = new (require('../lib/storage/fs'))({ dir: __dirname + '/../data'})
// var storage = new (require('../lib/storage/redis'))()
var
    storageClient = require('../models/mysql')
  , storage = new (storageClient.MySql)()
  , abstractModel = require('../models/abstract')
  , flow = require('../externals/flow')
  , marked = require('marked')
  , abstractController = require('./abstract')
  , date = require('../helpers/date')

/**
 * source: https://github.com/chjj/marked
 */

marked.setOptions({
    gfm: true
  , pedantic: false
  , sanitize: true
})


/**
 * GET home page.
 */

this.index = function(req, res, next) {
    abstractController.getAll(function(posts) {
        var
            pagingLeft = false
          , pagingRight = false
          , page = parseInt(req.param('count'), 10) || 1
          , ppp = parseInt(abstractModel.config.postPerPage, 10)
          , articleCount = posts.publish.length
          , postsTmp = posts.publish

        // paging
        if(ppp < articleCount) {
            postsTmp = postsTmp.splice((page - 1) * ppp)
            postsTmp.splice(ppp)
        }

        if(page * ppp < articleCount) {
            pagingRight = true
        }

        if(page > 1) {
            pagingLeft = true
        }

        res.render('post-index', {
            posts:  postsTmp
          , isAuth: req.session.authenthicated
          , paging: {
                l: pagingLeft
              , r: pagingRight
            }
          , page: {
                next: page+1
              , prev: page-1
            }
          , layout: 'post-layout'
          , date: date.getDate()
        })
    })
}

/**
 * GET post page
 */

this.single = function(req, res, next) {
    storage.lookup(req.param('id'), function(err, post) {
        if(err) return next(err)
        if(post.post_id === null) {
            res.redirect('/')
        }else{
            res.render('post-single', {
                post:  post
              , isAuth: req.session.authenticated
              , layout: 'post-layout'
            })
        }
    })
}

/**
 * GET preview of a page
 */

this.preview = function(req, res, next) {
    storage.lookup(req.param('id'), function(err, post) {
        if(err) return next(err)
        res.render('post-single', {
            post:   post
          , isAuth: true
          , layout: 'post-layout'
        })
    })
}

/**
 * remove post
 */

this.remove = function(req, res, next) {
    storage.remove(req.param('id'), function(err) {
        if(err) return next(err)
        res.redirect('back')
    })
}

/**
 * GET form to create new post
 */

this.create = function(req, res, next) {
    res.render('post-create', {
        layout: 'admin-layout'
      , title:  req.param('title') || ''
    })
}

/**
 * GET form to create new post
 */

this.edit = function(req, res, next) {
    storage.lookup(req.param('id'), function(err, post) {
        res.render('post-edit', {
            layout: 'admin-layout'
          , post: post
        })
    })
}

/**
 * POST update to a psot
 */

this.update = function(req, res, next) {
    var
        id = req.param('id')
      , isDraft = req.param('draft') === '1'
            ? true
            : false

    flow.exec(
        function() {
            if(isDraft) {
                storage.unpublishPost(id)
            }else{
                storage.publishPost(id)
            }

            storage.update({
                id:             id
              , titleMarkup:    req.param('title')
              , titleHtml:      marked(req.param('title'))
              , contentMarkup:  req.param('markup')
              , contentHtml:    marked(req.param('markup'))
              , created:        'POSTED ' + date.getDate()
            }, this)
        }, function() {
            if(isDraft) {
                res.redirect('/post/preview/' + id)
            }else{
                res.redirect('/post/single/' + id)
            }
        }
    )
}

/**
 * POST new
 */

this.save = function(req, res, next) {
    storage.add({
        titleMarkup: req.param('title')
      , titleHtml: marked(req.param('title'))
      , contentMarkup: req.param('markup')
      , contentHtml: marked(req.param('markup'))
      , created: 'POSTED ' + date.getDate()
    }, function(err) {
        if(err) return next(err)
        storage.getLast(function(err, data) {
            if(err) return next(err)
                if(!req.param('draft')) {
                    storage.publishPost(data.id)
                    res.redirect('/post/single/' + data.id)
                }else{
                    res.redirect('/post/preview/' + data.id)
                }
        })
    })
}
