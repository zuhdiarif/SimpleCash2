const crypto = require('react-native-quick-crypto');

module.exports = {
  createCipheriv: (algorithm, password, iv) => {
    return crypto.createCipheriv(algorithm, password, iv);
  },
  createDecipheriv: (algorithm, password, iv) => {
    return crypto.createDecipheriv(algorithm, password, iv);
  },
  randomBytes: (size) => {
    return crypto.randomBytes(size);
  },
};