const mongoose = require("mongoose")

const DataArraySchema = mongoose.Schema(
    {
        area: String,
        samplesLength: Number,
        avg: Number,
    }
)

const AreaAverageSchema = new mongoose.Schema({
    date: Date,
    city: String,
    data: [ DataArraySchema ]
})

module.exports = mongoose.model("AreaAverage", AreaAverageSchema)