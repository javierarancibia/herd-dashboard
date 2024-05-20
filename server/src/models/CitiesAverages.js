const mongoose = require("mongoose")

const DataArraySchema = mongoose.Schema(
    {
        city: String,
        avgPrice: Number,
        samplesLength: Number,
    }
)

const CitiesAveragesSchema = new mongoose.Schema({
    date: Date,
    city: String,
    data: [ DataArraySchema ]
})

module.exports = mongoose.model("CitiesAverages", CitiesAveragesSchema)