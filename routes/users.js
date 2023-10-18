const router = require('koa-router')()
const UserController = require('../controller/UserController')
router.prefix('/users')

router.post('/login', UserController.login)
router.post('/addUser', UserController.addUser)

module.exports = router
