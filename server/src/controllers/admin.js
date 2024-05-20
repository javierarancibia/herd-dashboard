const connectDB = require("../db/connect")
require("dotenv").config()
const Report = require("../models/Report")

const purchases = async (req, res) => {
    try {
        connectDB(process.env.MONGO_URI)
        const allPurchases = await Report.find({});
        return res.status(200).json(allPurchases)
    } catch (error) {
        return res.status(400).json(error)
    }
}

module.exports = { purchases }
