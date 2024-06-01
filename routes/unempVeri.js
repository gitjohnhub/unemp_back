const router = require('koa-router')();
const UnempVeriController = require('../controller/UnempVeriController');
const UnempCheckController = require('../controller/UnempCheckController');
const XiechaController = require('../controller/XiechaController');
const ZhuanyiController = require('../controller/ZhuanyiController');
const ProvinceController = require('../controller/ProvinceController');
const handleTersseractController = require('../controller/HandleTesseractController');
const YanchangController = require('../controller/YanchangController');
const NongbuController = require('../controller/NongbuController');
const DutyController = require('../controller/DutyController');
const BlackController = require('../controller/BlackController');
const wengangController = require('../controller/wengangController');

router.prefix('/api');

// 失业金
router.post('/unempVeriAll', UnempVeriController.getUnempVeriData);
router.post('/addUnempVeriData', UnempVeriController.addUnempVeriData);
router.post('/updateUnempVeriData', UnempVeriController.updateUnempVeriData);
router.post('/getUnempVeriAllDate', UnempVeriController.getUnempVeriAllDate);
router.post('/getUnempByJiezhen', UnempVeriController.getUnempByJiezhen);
router.post('/getUnempDataCal', UnempVeriController.getUnempDataCal);
router.post('/addUnempArrayData', UnempVeriController.addUnempArrayData);
router.post('/getUnempCheckData', UnempCheckController.getUnempCheckData);
router.post('/addUnempCheckArrayData', UnempCheckController.addUnempCheckArrayData);

// 外省市协查
router.post('/getXiechaData', XiechaController.getXiechaData);
router.post('/addXiechaData', XiechaController.addXiechaData);
router.post('/updateXiechaData', XiechaController.updateXiechaData);

// 转移
router.post('/getZhuanyiData', ZhuanyiController.getZhuanyiData);
router.post('/addZhuanyiData', ZhuanyiController.addZhuanyiData);
router.post('/updateZhuanyiData', ZhuanyiController.updateZhuanyiData);
router.post('/getZhuanyiDataCal', ZhuanyiController.getZhuanyiDataCal);
router.post('/getZhuanyiAllDate', ZhuanyiController.getZhuanyiAllDate);
router.post('/getZhuanyiAllPayDate', ZhuanyiController.getZhuanyiAllPayDate);
router.post('/payAllDataInPayProgress', ZhuanyiController.payAllDataInPayProgress);
router.post('/updateZhuanyiArrayData', ZhuanyiController.updateZhuanyiArrayData);

// 延长
router.post('/getYanchangData', YanchangController.getYanchangData);
router.post('/addYanchangData', YanchangController.addYanchangData);
router.post('/updateYanchangData', YanchangController.updateYanchangData);
router.post('/getYanchangDataCal', YanchangController.getYanchangDataCal);
router.post('/getYanchangByJiezhen', YanchangController.getYanchangByJiezhen);
router.post('/getYanchangAllDate', YanchangController.getYanchangAllDate);
router.post('/getYanchangCalByMonthAndJiezhen', YanchangController.getYanchangCalByMonthAndJiezhen);
// 农民
router.post('/getNongbuData', NongbuController.getNongbuData);
router.post('/addNongbuData', NongbuController.addNongbuData);
router.post('/updateNongbuData', NongbuController.updateNongbuData);
router.post('/getNongbuDataCal', NongbuController.getNongbuDataCal);
router.post('/getNongbuByJiezhen', NongbuController.getNongbuByJiezhen);
router.post('/getNongbuCalByMonthAndJiezhen', NongbuController.getNongbuCalByMonthAndJiezhen);
router.post('/getNongbuAllDate', NongbuController.getNongbuAllDate);
//地区数据
router.post('/getProvinceData', ProvinceController.getProvinceData);
router.post('/handleTesseract', handleTersseractController.handleTersseract);
// 黑名单
router.post('/getBlackData', BlackController.getBlackData);
// 稳岗
router.post('/getwengangData', wengangController.getwengangData);
router.post('/updatewengangData', wengangController.updatewengangData);
router.post('/getwengangAllDate', wengangController.getwengangAllDate);
router.post('/getwengangDataCal', wengangController.getwengangDataCal);
router.post('/getwengangDateCal', wengangController.getwengangDateCal);

//值班
router.post('/getDutyData', DutyController.getDutyData);
router.post('/addDutyData', DutyController.addDutyData);
router.post('/updateDutyData', DutyController.updateDutyData);

module.exports = router;
