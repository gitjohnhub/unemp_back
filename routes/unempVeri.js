const router = require('koa-router')()
const UnempVeriController = require("../controller/UnempVeriController");
router.get('/unempVeriAll',UnempVeriController.getUnempVeriData )
module.exports = router
