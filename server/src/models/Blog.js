const mongoose = require("mongoose")

const BlogSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    image: { alt: String, src: String },
    title: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String, required: true },
    categories: [String],
    content: { type: String, required: true },
})

module.exports = mongoose.model("Blog", BlogSchema)