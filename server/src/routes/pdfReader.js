const express = require('express')
const router = express.Router()

const { getFiles, getFile, removeFile, postPdf, chatPdf, sendFile } = require("../controllers/pdfReader") 

router.route("/files").get(getFiles)
router.route("/file/:databaseId").get(getFile)
router.route("/delete-file").post(removeFile)
router.route("/post").post(postPdf)
router.route("/chat").post(chatPdf)
router.route("/get-file/:filename").get(sendFile)

module.exports = router