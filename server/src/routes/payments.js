const express = require('express')
const router = express.Router()

const { succesfullPayment, createOrder } = require("../controllers/payments") 

router.route("/purchase").post(succesfullPayment)
router.route("/create-order").post(createOrder)

module.exports = router