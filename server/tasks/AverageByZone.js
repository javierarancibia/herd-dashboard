const Apartment = require("../src/models/Apartment")
const AreaAverage = require("../src/models/AreaAverage")
const connectDB = require("../src/db/connect")
const AREAS = require("../src/utils/Constants")
const dateFormat = require("../src/utils/DateFormat")
require("dotenv").config()

const getAverageByZone = async (queryCity) => {

    try {
        // First: get All apartments by city from 2 days ago
        connectDB(process.env.MONGO_URI)
        const apartments = await Apartment.find({ date: dateFormat(), city: queryCity })
        const dataArrays = apartments.map(apt => apt.data)
        const allData = dataArrays.flat() // All data array
        const filteredData = allData.filter(apt => apt.squareMPrice > 30 && apt.squareMPrice < 110) // Filter to avoid wrong value data
        
        // Second: Get City areas array
        const cityData = AREAS.find(x => x.city === queryCity)
        const cityAreas = cityData.areas

        // Third: Group all samples by zone and get average price for report data charts
        const zone = []
        cityAreas.forEach(area => {
            const apts = filteredData.filter(apt => apt.street && apt.street.toLowerCase().indexOf(area.value) !== -1 )
            const aptsAverages = averagePrice(apts, "squareMPrice")
            const obj = { area: area.title, samplesLength: apts.length, avg: aptsAverages}
            zone.push(obj)
        })
        const today = new Date()
        const nowString = today.toISOString()
        const slicedDate = nowString.slice(0, 10)
        storeDataDB({date: slicedDate, city: queryCity, data: zone})
    } catch (error) {
        console.error("Error querying Apartments:", error);
        throw error;
    }

}

module.exports = getAverageByZone


// Function to store Data in DB
const storeDataDB = async data => {
    AreaAverage.create(data) // Method to store object in MONGODB
    await connectDB(process.env.MONGO_URI)
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