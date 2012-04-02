
var
    fs = require('fs')
  , configPath = './config.json'

/**
 * storage constructor
 */

var Storage = function() {
  var
      json_string = fs.readFileSync(configPath, 'UTF-8')

  this.config = JSON.parse(json_string)
}

/**
 * call Function
 *
 * @param reference
 * @param settings
 */

Storage.prototype.call = function(obj, options) {
    this.options = obj.options = options;
}

/**
 * export object
 */

exports = module.exports = new Storage();
