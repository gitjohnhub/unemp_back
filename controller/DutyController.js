const BaseController = require('./BaseController');
const DutyModel = require('../model/DutyData');
const log4js = require('../utils/log4js');
const util = require('../utils/util');
const { Op, Sequelize } = require('sequelize');
const {getFirstAndLastDayOfMonth} = require('../utils/tools')
class DutyController extends BaseController {
  static async getDutyData(ctx) {
    const {
      dutyPerson,
      dutyDay,
    } = ctx.request.body;
    const where = {};
    if (dutyPerson) {
      where.dutyPerson = dutyPerson;
    }
    if(dutyDay){
      // pageOptions = {};
      where.dutyDay = dutyDay
    }
    console.log('where==>',where)
    try {
      const { count, rows } = await DutyModel.findAndCountAll({
        where,
        order: [['dutyDay', 'DESC']],
      });
      ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, '查询成功', {
        count,
        rows,
      });
    } catch (err) {
      ctx.body = BaseController.renderJsonFail(util.CODE.BUSINESS_ERROR, `查询异常:${err}`);
    }
  }
  /**
   * add data
   * @param {*} ctx
   */
  static async addDutyData(ctx) {
    console.log('add====>', ctx.request.body);
    try {
      if (Array.isArray(ctx.request.body)){
        console.log('add multi====>', ctx.request.body);

        await DutyModel.bulkCreate(ctx.request.body);
      }else{
        console.log('add single====>', ctx.request.body);
        await DutyModel.create(ctx.request.body);
      }
      ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, '添加成功');
    } catch (err) {
      ctx.body = BaseController.renderJsonFail(util.CODE.BUSINESS_ERROR, `添加数据异常:${err}`);
    }
  }


  // update
  static async updateDutyData(ctx) {
    const {
      id,
      dutyPerson,
      dutyDay,
    } = ctx.request.body;
    const params = {};
    if (dutyPerson) {
      params.dutyPerson = dutyPerson;
    }
    if (dutyDay) {
      params.dutyDay = dutyDay;
    }
    try {
      await DutyModel.update(params, {
        where: {
          id: id,
        },
      });
    } catch (err) {
      ctx.body = BaseController.renderJsonFail(util.CODE.BUSINESS_ERROR, `更新数据异常:${err}`);
    }
    ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, `ID:${id},更新成功`);
  }
}
module.exports = DutyController;
