const express = require('express')
const router = express.Router()

const { citiesAverages, areasAverages } = require("../controllers/properties") 

router.route("/averages/cities").get(citiesAverages)
router.route("/averages/areas").get(areasAverages)

module.exports = router