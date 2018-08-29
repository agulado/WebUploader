var config = require('./config');

exports.log = (function(msg) {
    if (config.debug !== true)
        return;
    console.log(msg);
});