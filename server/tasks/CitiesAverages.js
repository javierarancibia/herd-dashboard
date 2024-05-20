const Apartment = require("../src/models/Apartment")
const CitiesAverages = require("../src/models/CitiesAverages")
const CITIES = require("../src/utils/Cities")
const connectDB = require("../src/db/connect")
const dateFormat = require("../src/utils/DateFormat")
require("dotenv").config()

const getCitiesAverage = async () => {
    // First: get Apartments by Date and City
    const citiesArray = await Promise.all(CITIES.map(async city => {
        connectDB(process.env.MONGO_URI)
        const apartments = await Apartment.find({ date: dateFormat(), city: city })
        const dataArrays = apartments.map(apt => apt.data)
        const allData = dataArrays.flat() // All data array
        const filteredData = allData.filter(apt => apt.squareMPrice > 30 && apt.squareMPrice < 110) // Filter to avoid wrong value data
        return {city: city, data: filteredData}
    }))
    
    
    // Second: Get Average price for each City
    const averagePricesByCity = citiesArray.map(city => {
        const averagePrices = averagePrice(city.data, "squareMPrice")
        const obj = { city: city.city, avgPrice: averagePrices, samplesLength: city.data.length}
        return obj
    })

    // Third: Store in MongoDB
    const today = new Date()
    const nowString = today.toISOString()
    const slicedDate = nowString.slice(0, 10)
    storeDataDB({date: slicedDate, data: averagePricesByCity})
}

module.exports = getCitiesAverage


// Function to store Data in DB
const storeDataDB = async data => {
    CitiesAverages.create(data) // Method to store object in MONGODB
    connectDB(process.env.MONGO_URI)
}

// Function to get averages
const averagePrice = (objs, prop) => {  // Function to get table summaries or total
    if (objs && objs.length > 0) {
        const sum = objs.reduce((prev, acc) => prev + acc[prop], 0 )
        const arrayLength = objs.length
        const averagePrice = sum / arrayLength  
        return Number(averagePrice.toFixed(2))
    } else {
        return 0
    }
}