const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
    url: 'mongodb://kathiravan:kathir143@ds111568.mlab.com:11568/crypto',
    // url: 'mongodb://kathiravan:kathir143@ds229438.mlab.com:29438/b2c',
    secret : crypto
}