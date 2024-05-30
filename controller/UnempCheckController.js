const BaseController = require('./BaseController');
const UnempCheckModel = require('../model/UnempCheckData');
const log4js = require('../utils/log4js');
const util = require('../utils/util');
const { Op, Sequelize } = require('sequelize');
class UnempCheckController extends BaseController {
  static async getUnempCheckData(ctx) {
    const { personID, personName, jiezhen } = ctx.request.body;
    console.log('unempInfo====>',ctx.request.body)
    const where = {};
    if (personID) {
      where.personID = personID;
    }
    try {
      const unempData= await UnempCheckModel.findOne({
        where,
      });
      ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, '查询成功', unempData);
    } catch (err) {
      ctx.body = BaseController.renderJsonFail(util.CODE.BUSINESS_ERROR, `查询异常:${err}`);
    }
  }
  static async addUnempCheckArrayData(ctx) {
    const { unempToPush } = ctx.request.body;
    console.log('unempToPush===>', unempToPush);
    const existingUsers = [];
    const newUsers = [];
    const unsuccessfulUsers = [];

    try {
      for (const person of unempToPush) {
        const [existingUser, created] = await UnempCheckModel.findOrCreate({
          where: {
            personID: person.personID,
          },
          defaults: {
            personName: person.personName,
            personID: person.personID,
            jiezhen: person.jiezhen,
            createtime: person.createtime,
          },
        });
        if (created) {
          newUsers.push(existingUser);
        } else {
          existingUsers.push(existingUser);
        }
      }
    } catch (err) {
      ctx.body = BaseController.renderJsonFail(util.CODE.BUSINESS_ERROR, `添加数据异常:${err}`);
    }
    ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, '添加成功', {
      existingUsers,
      newUsers,
      unsuccessfulUsers,
    });
  }



}
module.exports = UnempCheckController;
