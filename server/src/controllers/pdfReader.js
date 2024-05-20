const axios = require("axios"); 
const FormData = require("form-data");
const fs = require("fs");
require("dotenv").config()
const path = require('path');
const FileMetadata = require("../models/FileMetadata")
const connectDB = require("../db/connect")

const getFiles = async (req, res) => {
    try {
        connectDB(process.env.MONGO_URI)
        const allFiles = await FileMetadata.find({ });
        return res.status(200).json(allFiles)
    } catch (error) {
        return res.status(400).json(error)
    }
}

const getFile = async (req, res) => {
    try {
        connectDB(process.env.MONGO_URI)
        const file = await FileMetadata.find({_id: req.params.databaseId});
        return res.status(200).json(file)
    } catch (error) {
        return res.status(400).json(error)
    }
}

const removeFile = async (req, res) => {
    const fileData = req.body
    const config = { headers: { "x-api-key": process.env.CHATPDF_API_KEY, "Content-Type": "application/json" }};
    axios.post("https://api.chatpdf.com/v1/sources/delete", { sources: [fileData.sourceId]}, config).then(async response => {
        console.log("Succesfully stored in ChatPDF CODE 200", response)
        connectDB(process.env.MONGO_URI)
        const removedFile = await FileMetadata.deleteOne({_id: fileData._id})
        const filePath = path.join(__dirname, `../../uploads/${fileData.metadata[0].filename}`);
        fs.unlink(filePath, (err) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log('File deleted successfully');
        });
        res.status(200).json({message: removedFile})
    }).catch(error => console.log("error", error))
}

const postPdf = async (req, res) => {
    const formData = new FormData();
    const config = { headers: { "x-api-key": process.env.CHATPDF_API_KEY, ...formData.getHeaders() }};
    const filePath = path.join(__dirname, `../../uploads/${req.body.metadata.filename}`);
    formData.append( "file", fs.createReadStream(filePath) );
    axios.post("https://api.chatpdf.com/v1/sources/add-file", formData, config).then(async response => {
        const fileStore = await FileMetadata.create({ date: new Date(), sourceId: response.data.sourceId, metadata: req.body.metadata }) 
        res.status(200).json({ dataBaseID: fileStore._id, })
    }).catch((error) => {
        console.log("Error:", error.message);
        console.log("Response:", error.response.data);
        res.status(400).json(error.response.data)
    });
}

const chatPdf = async (req, res) => {
    const { sourceId, content } = req.body
    const config = { headers: { "x-api-key": process.env.CHATPDF_API_KEY, "Content-Type": "application/json" }};
    const data = { sourceId: sourceId, messages: [{ role: "user",  content: content } ]};
    axios.post("https://api.chatpdf.com/v1/chats/message", data, config).then(response => {
        res.status(200).json({ chatResponse: response.data.content });   
    }).catch((error) => {
        console.error("Error:", error.message);
        console.log("Response:", error.response.data);
    });
}

const sendFile = (req, res) => {
    const filePath = path.join(__dirname, `../../uploads/${req.params.filename}`);
    res.sendFile(filePath);
};
 
module.exports = { getFiles, getFile, removeFile, postPdf, chatPdf, sendFile }


