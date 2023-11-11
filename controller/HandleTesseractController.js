const BaseController = require('./BaseController');
const { createWorker } = require('tesseract.js');
const util = require('../utils/util');

class handleTersseractController extends BaseController {
  static async handleTersseract(ctx) {
    console.log(ctx)
    if (!ctx.request.files || !ctx.request.files.image) {
      ctx.status = 400;
      ctx.body = BaseController.renderJsonFail(util.CODE.BUSINESS_ERROR, `no image`);
      return;
    }

    // 创建Tesseract工作器
    const worker = createWorker();

    try {
      // 加载图像并进行识别
      await worker.load();
      await worker.loadLanguage('chi_sim');
      await worker.initialize('chi_sim');
      const {
        data: { text },
      } = await worker.recognize(ctx.request.files.image.path);

      // 返回识别结果
     ctx.body = BaseController.renderJsonSuccess(util.CODE.SUCCESS, '查询成功', text);
    } catch (error) {
      ctx.status = 500;
      ctx.body = BaseController.renderJsonFail(util.CODE.BUSINESS_ERROR, `查询异常:${error}`);

    } finally {
      // 终止Tesseract工作器
      await worker.terminate();
    }
  }
}
module.exports = handleTersseractController;
