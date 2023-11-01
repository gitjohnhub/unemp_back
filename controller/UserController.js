const BaseController = require('./BaseController');
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const User = require('../model/User');
const util = require('../utils/util')
class UserController extends BaseController {
  static async login(ctx) {
    try {
      const { account, password } = ctx.request.body;
      const md5_userPwd = md5(password);
      const user = await User.findOne({ where: { account: account,password:md5_userPwd } });
      if (user) {
        const token = jwt.sign({ data: user.dataValues }, 'jiading', { expiresIn: '7 days' });
        const {id,username,account,role_id,status,checkObject} = user
        const data = {id,username,account,role_id,status,checkObject}
        data.token = token;
        ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS,'登陆成功',data);
      } else {
        ctx.body = BaseController.renderJsonFail(util.CODE.USER_ACCOUNT_ERROR,'帐号或密码不正确');
      }
    } catch (error) {
      ctx.body = BaseController.renderJsonFail(util.CODE.BUSINESS_ERROR,'服务器内部错误',error);
    }
  }
  static async getUsers(ctx){
    const {username}  = ctx.request.query
    const where = {}
    if (username){
        where.username = username;
    }
    try{
        const {count,rows} = await User.findAndCountAll({
            where,
            attributes: ['id', 'userName','account','role_id','status','checkObject'],
            order: [['id', 'DESC']],
        })
        ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS,'查询成功', {
            count,
            rows
        })
    }catch(err){
        ctx.body = BaseController.renderJsonFail(util.CODE.BUSINESS_ERROR,`查询异常:${err}`)
    }


  };

  static async addUser(ctx) {
    try {
      const { username, account, password ,checkObject} = ctx.request.body;
      const md5_userPwd = md5(password);
      const existUser = await User.findOne({ where: { username: username } });
      if (existUser === null) {
        const newUser = await User.create({
          account,
          password: md5_userPwd,
          username,
          checkObject
        });
        await newUser
          .save()
          .then(() => {
            ctx.body = BaseController.renderJsonSuccess(200, '添加成功', account);
          })
          .catch((err) => {
            ctx.body = BaseController.renderJsonFail(40001, '服务器内部错误，请联系管理员');
          });
      } else {
        ctx.body = BaseController.renderJsonFail(40001, '账号已被注册，请重新注册');
      }
    } catch (error) {
      ctx.body = BaseController.renderJsonFail(40001, error);
    }
  }
}
module.exports = UserController;
