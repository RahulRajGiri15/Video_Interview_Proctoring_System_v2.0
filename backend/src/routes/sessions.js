const express = require('express')
const router = express.Router()
const sessionController = require('../controllers/sessionController')

router.post('/', sessionController.createSession)
router.post('/:sessionId/events', sessionController.logEvent)
router.put('/:sessionId/end', sessionController.endSession)
router.get('/:sessionId', sessionController.getSession)

module.exports = router