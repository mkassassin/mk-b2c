var crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
    // url: 'mongodb://localhost/b2c',
    url: 'mongodb://kathiravan:kathir143@ds111568.mlab.com:11568/crypto',
    // url: 'mongoimport -h ds111568.mlab.com:56789 -d crypto -u kathiravan -p kathir143 --file filename.json',
    // url: 'mongodb://kathiravan:kathir143@ds229438.mlab.com:29438/b2c',
    secret : crypto
};
