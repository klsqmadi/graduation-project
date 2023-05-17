const jwt = require('jsonwebtoken');
const secretKey = 'jwt';
class AuthenticateManager {
  static authToken(token) {
    try {
      const decoded = jwt.verify(token, secretKey);
      return decoded;
    } catch (error) {
      // Token 验证失败
      return null;
    }
  }
  static createToken(phone, password, id, name) {
    const token = jwt.sign({ phone, password, id, name }, secretKey, { expiresIn: '1h' });
    return token;
  }
}

module.exports = {
  AuthenticateManager,
};
