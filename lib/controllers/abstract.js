
/**
 * abstract functions
 */

var
    flow = require('../externals/flow')
  , storageClient = require('../models/mysql')
  , storage = new (storageClient.MySql)()

/**
 * return all posts
 */

this.getAll = function(next) {

    flow.exec(
        function() {
            storage.getAll(this.MULTI('posts'))
            storage.getPubPostIds(this.MULTI('publishIds'))

        }, function(results) {
            var
                draftIds = []
              , publish = []
              , drafts = []

            // extract ids of post objects
            results['publishIds'] && results['publishIds'].forEach(function(value) {
                draftIds.push(value.post_id)
            })

            // sorting posts by publish list
            results['posts'] && results['posts'].forEach(function(sglPost) {
                if(draftIds.indexOf(sglPost.id) === -1) {
                    drafts.push(sglPost)
                }else{
                    publish.push(sglPost)
                }
            })

            next({
                drafts: drafts
              , publish: publish
            })
        }
    )
}
