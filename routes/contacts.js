const router = require('koa-router')()
const ContactsController = require('../controller/ContactsController')
router.prefix('/api/Contacts')

router.post('/updateContactData', ContactsController.updateContactData)
router.post('/addContactData', ContactsController.addContactData)
router.post('/getContactData', ContactsController.getContactData)

module.exports = router
