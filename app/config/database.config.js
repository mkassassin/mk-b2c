const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
    url: 'mongodb://kathiravan:kathir143@ds111568.mlab.com:11568/crypto',
    secret : crypto
}