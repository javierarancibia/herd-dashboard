const connectDB = require("../db/connect")
require("dotenv").config()
const Report = require("../models/Report")
const Apartment = require("../models/Apartment")
const CitiesAverages = require("../models/CitiesAverages")
const AreaAverage = require("../models/AreaAverage")
const dateFormat = require("../utils/DateFormat")

// Query to get the Report Data 
const getReport = async (req, res) => {
    const { id } = req.params
    try {
        connectDB(process.env.MONGO_URI)
        const reportData = await Report.find({ _id: id })
        res.status(200).json(reportData)    
    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, errorMessage: error })
    } 
}

const createReport = async (req, res) => {
    const { city, rooms, area } = req.params
    const fullReportData = req.body

    try {
        const apartments = await Apartment.find({city: city, date: dateFormat() }) 
        const citiesAverages = await CitiesAverages.find({date: dateFormat()})
        const areasAverages = await AreaAverage.find({city: city, date: dateFormat()})
        const dataArrays = apartments.map(apt => apt.data)
        // Data for Tables 
        const allData = dataArrays.flat() // All data array
        const filteredData = allData.filter(apt => apt.squareMPrice > 30 && apt.squareMPrice < 110) // Filter to avoid wrong value data
        const finalDataArray = filteredData.filter(apt => apt.currency === "UF") // Filter to get only prices in UF Currency
        const dataByRooms = finalDataArray.filter(apt => apt.rooms === Number(rooms)) // Array with data filtered by number of rooms
        const dataByArea = finalDataArray.filter(apt => apt.street.toLowerCase().indexOf(area) !== -1 ) // Array with data filtered by number area
        const dataByAreaAndRooms = dataByArea.filter(apt => apt.rooms === Number(rooms)) // Array with data filtered by Area and Number of Rooms
        
        // Get array of averages by area
        const avgPriceData = averagePrice(finalDataArray, "squareMPrice")
        const avgPriceDataByRooms = averagePrice(dataByRooms, "squareMPrice")
        const avgPriceDataByArea = averagePrice(dataByArea, "squareMPrice")
        const avgPriceDataByAreaAndRooms = averagePrice(dataByAreaAndRooms, "squareMPrice")
        // Apartment Price Structure
        const finalPrice = finalAvgPrice([avgPriceData, avgPriceDataByRooms, avgPriceDataByArea, avgPriceDataByAreaAndRooms])
        const interiorPrice = Number(fullReportData.apartmentData.interiorSurface) * finalPrice
        const balconyPrice = Number(fullReportData.apartmentData.balconySurface) * (finalPrice / 2)
        const totalInteriorBalconyPrice = interiorPrice + balconyPrice
        const parkingPrice = Number(fullReportData.apartmentData.parking) === 0 ? 0 : totalInteriorBalconyPrice * 0.04 
        const storagePrice = Number(fullReportData.apartmentData.storage) === 0 ? 0 : totalInteriorBalconyPrice * 0.02 
        const totalPrice = interiorPrice + balconyPrice + parkingPrice + storagePrice
        const now = new Date()

        // Check if email exists in Database for free first report
        const mailCheck = await Report.findOne({'personalData.email': fullReportData.personalData.email })

        const data = { 
            // count: 0,
            date: now,
            purchased: mailCheck === null ? true : false,
            avgPriceData: Number(avgPriceData), 
            avgPriceDataByRooms: Number(avgPriceDataByRooms), 
            avgPriceDataByArea: Number(avgPriceDataByArea), 
            avgPriceDataByAreaAndRooms: Number(avgPriceDataByAreaAndRooms),
            finalPrice: Number(finalPrice),
            interiorPrice: Number(interiorPrice),
            balconyPrice: Number(balconyPrice),
            totalPrice: Number(totalPrice),
            parkingPrice: Number(parkingPrice),
            storagePrice: Number(storagePrice), 
            dataLength: Number(finalDataArray.length),
            dataByRoomsLength: Number(dataByRooms.length), 
            dataByAreaLength: Number(dataByArea.length), 
            dataByAreaAndRoomsLength: Number(dataByAreaAndRooms.length),
            data: finalDataArray.slice(0, 21),
            citiesAverages: citiesAverages[0],
            areasAverages: areasAverages[0],
            locationData: fullReportData.locationData,
            apartmentData: fullReportData.apartmentData,
            personalData: fullReportData.personalData
        }
        const reportStored = await Report.create(data) // TODO Save all data in MongoDB and only respond with DB id to fetch data

        //RESPONSE
        res.status(200).json({ 
            dataBaseID: reportStored._id, 
            email: fullReportData.personalData.email,
            success: true, 
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, errorMessage: error })
    }
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

// Function to get final M2 price with the average of all averages
const finalAvgPrice = array => {
    const filteredArray = array.filter(x => x !== 0)
    const sum = filteredArray.reduce((prev, acc) => prev + acc, 0)
    const average = sum / filteredArray.length
    if (isNaN(average)) {
        return 0
    }
    return Number(average)
}

module.exports = { getReport, createReport }