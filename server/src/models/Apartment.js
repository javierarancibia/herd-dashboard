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


const ApartmentSchema = new mongoose.Schema({
    date: Date,
    city: String,
    data: [ DataArraySchema ]
})

module.exports = mongoose.model("Apartment", ApartmentSchema)