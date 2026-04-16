const express = require('express')
const router = express.Router()
const { resolveStudentByCode } = require('../controllers/iotController')

router.post('/resolve-student', resolveStudentByCode)

module.exports = router