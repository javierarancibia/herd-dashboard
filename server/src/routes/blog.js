const express = require('express')
const router = express.Router()

const { createPost, getPost, getAllPosts } = require("../controllers/blog") 

router.route("/create-post").post(createPost)
router.route("/all-posts").get(getAllPosts)
router.route("/get-post/:slug").get(getPost)

module.exports = router