const connectDB = require("../db/connect")
require("dotenv").config()
const Blog = require("../models/Blog")

const createPost = async (req, res) => {
    const post = req.body
    try {
        const postStored = await Blog.create({ ...post, date: new Date(), slug: slugify(post.title) }) // TODO Save all data in MongoDB and only respond with DB id to fetch data
        //RESPONSE
        res.status(200).json({ 
            dataBaseID: postStored._id, 
            slug: postStored.slug,
            success: true, 
        })
    } catch (error) {
        
    }
}

const getAllPosts = async (req, res) => {
    try {
        connectDB(process.env.MONGO_URI)
        const allPosts = await Blog.find({ });
        return res.status(200).json(allPosts)
    } catch (error) {
        return res.status(400).json(error)
    }
}

const getPost = async (req, res) => {
    const { slug } = req.params
    try {
        connectDB(process.env.MONGO_URI)
        const post = await Blog.findOne({ slug: slug });
        return res.status(200).json(post)
    } catch (error) {
        return res.status(400).json(error)
    }
}

module.exports = { getPost, createPost, getAllPosts }

const slugify = (str) => {
    return String(str)
      .normalize('NFKD') // split accented characters into their base characters and diacritical marks
      .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
      .trim() // trim leading or trailing whitespace
      .toLowerCase() // convert to lowercase
      .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
      .replace(/\s+/g, '-') // replace spaces with hyphens
      .replace(/-+/g, '-'); // remove consecutive hyphens
}

