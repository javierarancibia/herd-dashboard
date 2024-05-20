const express = require('express')
const router = express.Router()

const { getReport, createReport } = require("../controllers/reports") 

router.route("/:id").get(getReport)
router.route("/:city/:rooms?/:area?").post(createReport)

module.exports = router