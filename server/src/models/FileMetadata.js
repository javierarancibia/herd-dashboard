const mongoose = require("mongoose")

const DataArraySchema = mongoose.Schema(
    {
        fieldname: String,
        originalname: String,
        encoding: String,
        mimetype: String,
        filename: String,
        size: Number,
    }
)

const FileSchema = new mongoose.Schema({
    date: Date,
    sourceId: String,
    metadata: [ DataArraySchema ]
})

module.exports = mongoose.model("FileMetadata", FileSchema)