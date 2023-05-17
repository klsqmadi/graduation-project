const { User } = require('../model/User');
const USER_CODE = {
  REGISTER_SUC: 1,
  EXIT: 2,
  HAV_REGISTER: 3,
  FAIL: 4,
  NO_USER: 5,
  LOGIN_SUC: 6,
  PASSWORD_MATCH_FAIL: 7,
  NO_EXIT: 8,
  LOGIN_FAIL: 9,
  EDIT_SUC: 10,
  EDIT_FAIL: 11,
};
class UserManager {
  async register(phone, name, password) {
    try {
      const exitResult = await this.exit(phone);
      if (exitResult === USER_CODE.EXIT) {
        return USER_CODE.HAV_REGISTER;
      }
      const registerUser = new RegisterUser(name, phone, password);
      await User.create(registerUser);
      return USER_CODE.REGISTER_SUC;
    } catch (error) {
      console.log(error);
      return USER_CODE.FAIL;
    }
  }
  async login(phone, password) {
    try {
      const findUser = await this.findUser(phone);
      if (!findUser) {
        return {
          code: USER_CODE.NO_USER,
          data: null,
        };
      }
      console.log('findUser', findUser, 'id', findUser.id);
      const passwordMatch = password === findUser.password;
      return passwordMatch
        ? { code: USER_CODE.LOGIN_SUC, data: findUser }
        : { code: USER_CODE.PASSWORD_MATCH_FAIL, data: null };
    } catch (error) {
      console.log(error);
      return {
        code: USER_CODE.LOGIN_FAIL,
        data: null,
      };
    }
  }
  async edit(originPhone, name, password) {
    try {
      const findUser = await User.findOne({ where: { phone: originPhone } });
      if (!findUser) {
        return USER_CODE.EDIT_FAIL;
      }
      await findUser.update({
        name,
        password,
      });
      return USER_CODE.EDIT_SUC;
    } catch (error) {
      console.log(error);
      return USER_CODE.EDIT_FAIL;
    }
  }
  async exit(phone) {
    const findUser = await User.findOne({ where: { phone } });
    console.log(findUser, '----------');
    return findUser ? USER_CODE.EXIT : USER_CODE.NO_EXIT;
  }
  async findUser(phone) {
    const findUser = await User.findOne({ where: { phone } });
    return findUser;
  }
}
class RegisterUser {
  constructor(name, phone, password) {
    this.name = name;
    this.phone = phone;
    this.password = password;
  }
}

module.exports = {
  UserManager,
  USER_CODE,
};
