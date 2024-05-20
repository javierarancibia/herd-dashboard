const express = require('express')
const router = express.Router()

const { purchases } = require("../controllers/admin") 

router.route("/purchases").get(purchases)

module.exports = router