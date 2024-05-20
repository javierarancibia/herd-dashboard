const mongoose = require("mongoose")

const DataArraySchema = mongoose.Schema(
    {
        date: String,
        street: String,
        city: String,
        surface: Number,
        rooms: Number,
        price: Number,
        squareMPrice: Number,
        currency: String,
        url: String,
    }
)

const CitiesAveragesDataSchema = mongoose.Schema(
    {
        city: String,
        avgPrice: Number,
        samplesLength: Number
    }
)

const AreasAveragesDataSchema = mongoose.Schema(
    {
        area: String,
        avg: Number,
        samplesLength: Number
    }
)

const ReportSchema = new mongoose.Schema({
    date: Date,
    purchased: Boolean,
    avgPriceData: Number, 
    avgPriceDataByRooms: Number, 
    avgPriceDataByArea: Number, 
    avgPriceDataByAreaAndRooms: Number,
    finalPrice: Number,
    interiorPrice: Number,
    balconyPrice: Number,
    totalPrice: Number,
    parkingPrice: Number,
    storagePrice: Number, 
    dataLength: Number,
    dataByRoomsLength: Number, 
    dataByAreaLength: Number, 
    dataByAreaAndRoomsLength: Number,
    data: [ DataArraySchema ],
    locationData: { address: String, area: { value: String, text: String }, city: String, coordinates: { lat: Number, lng: Number } },
    apartmentData: { interiorSurface: Number, balconySurface: Number, room: Number, bathroom: Number, parking: Number, storage: Number },
    personalData: { email: String, name: String, phoneNumber: String, rut: String },
    citiesAverages: { date: Date, data: [ CitiesAveragesDataSchema ] },
    areasAverages: { date: Date, data: [ AreasAveragesDataSchema ] }
})

module.exports = mongoose.model("Report", ReportSchema)