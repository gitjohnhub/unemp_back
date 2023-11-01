const BaseController = require('./BaseController');
const contactModel = require('../model/Contact');
const util = require('../utils/util');
class ContactController extends BaseController {
  static async getContactData(ctx) {
    const { title, isPublic,contactPerson } = ctx.request.body;
    const where = {};
    if (title) {
      where.title = title;
    }
    if (isPublic) {
        where.isPublic = isPublic;
      }
      if (contactPerson) {
        where.contactPerson = contactPerson;
      }
    const { page, skipIndex } = util.pager(ctx.request.body);
    try {
      const { count, rows } = await contactModel.findAndCountAll({
        where,
        order: [['id', 'DESC']],
        offset: skipIndex,
        limit: page.pageSize,
      });
      ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, '查询成功', {
        page: {
          ...page,
          total: count,
        },
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
  static async addContactData(ctx) {
    try {
      await contactModel.create(ctx.request.body);
    } catch (err) {
      ctx.body = BaseController.renderJsonFail(util.CODE.BUSINESS_ERROR, `添加数据异常:${err}`);
    }
    ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, '添加成功');
  }
  // TODO
  static async deleteContactData(ctx) {
    const { id } = ctx.request.body;
    try {
      await ContactModel.update(
        { title: 2 },
        {
          where: {
            id: id,
          },
        }
      );
    } catch (err) {
      ctx.body = BaseController.renderJsonFail(util.CODE.BUSINESS_ERROR, `添加数据异常:${err}`);
    }
    ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, '添加成功');
  }
  // update
  static async updateContactData(ctx) {
    const { id, title,contactPerson,phoneNum, address, mobileNum ,isPublic,belong} = ctx.request.body;
    const params = {};
    if (title) {
      params.title = title;
    }
    if (contactPerson) {
        params.contactPerson = contactPerson;
      }
      if (belong) {
        params.belong = belong;
      }
    if (phoneNum) {
        params.phoneNum = phoneNum;
    }
    if (address) {
        params.address = address;
    }
    if (mobileNum) {
        params.mobileNum = mobileNum;
    }
    if (isPublic) {
        params.isPublic = isPublic;
    }
    try {
      await ContactModel.update(
        params,
        {
          where: {
            id: id,
          },
        }
      );
    } catch (err) {
      ctx.body = BaseController.renderJsonFail(util.CODE.BUSINESS_ERROR, `更新数据异常:${err}`);
    }
    ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, `ID:${id},更新成功`);
  }
}
module.exports = ContactController;
