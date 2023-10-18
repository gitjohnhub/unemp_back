const BaseController = require("./BaseController");
const jwt = require('jsonwebtoken');
const md5 = require('md5');

class UserController extends BaseController {
    static async getUser(ctx) {
        ctx.body = BaseController.renderJsonSuccess(200, '这是用户页')
    }

    static async addUser(ctx) {
        const id = ctx.params.id
        let msg = '输入错误'
        let code = 200
        if (parseInt(id) === 666) {
            msg = '输入正确'
        }
        ctx.body = BaseController.renderJsonSuccess(code, msg, id)
    }
}
module.exports = UserController
