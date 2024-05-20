const connectDB = require("../db/connect")
require("dotenv").config()
const AreaAverage = require("../models/AreaAverage")
const CitiesAverages = require("../models/CitiesAverages")
const dateFormat = require("../utils/DateFormat")


// Query to get Cities Averages by City
const citiesAverages = async (req, res) => {
    connectDB(process.env.MONGO_URI)
    const citiesAveragePrices = await CitiesAverages.find({ date: dateFormat() })
    res.status(200).json(citiesAveragePrices)    
}

// Query to get Area Averages by City
const areasAverages = async (req, res) => {
    const { city } = req.params
    connectDB(process.env.MONGO_URI)
    const averages = await AreaAverage.find({ date: dateFormat(), city: city })
    res.status(200).json(averages)    
}

module.exports = { citiesAverages, areasAverages }