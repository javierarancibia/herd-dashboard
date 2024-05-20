const fetchApartments = require("../../tasks/RequestStoreFunction")
const deleteApartmentsByDate = require("../../tasks/DeleteStoreApts")
const getAverageByZone = require("../../tasks/AverageByZone")
const getCitiesAverages = require("../../tasks/CitiesAverages")
const CitiesAverages = require("../models/CitiesAverages")
const AreaAverages = require("../models/AreaAverage")
const dateFormat = require("../utils/DateFormat")
const connectDB = require("../db/connect")
const nodemailer = require("nodemailer")
const dailyDBReportEmail = require("../utils/dailyDBReportEmail")
require("dotenv").config()

// Query to get store Apartments in DB
const storeSantiagoProvidencia = async (req, res) => {
    try {
        // Fetch Daily Apartments
        fetchApartments("https://www.portalinmobiliario.com/venta/departamento/propiedades-usadas/providencia-metropolitana/", "Providencia");

        setTimeout(() => {
            fetchApartments("https://www.portalinmobiliario.com/venta/departamento/propiedades-usadas/providencia-metropolitana/_Desde_51_NoIndex_True", "Providencia");
        }, [5000])

        setTimeout(() => {
            fetchApartments("https://www.portalinmobiliario.com/venta/departamento/propiedades-usadas/providencia-metropolitana/_Desde_101_NoIndex_True", "Providencia");
        }, [13000])

        setTimeout(() => {
            fetchApartments("https://www.portalinmobiliario.com/venta/departamento/propiedades-usadas/providencia-metropolitana/_Desde_151_NoIndex_True", "Providencia");
        }, [27000])

        setTimeout(() => {
            fetchApartments("https://www.portalinmobiliario.com/venta/departamento/propiedades-usadas/santiago-metropolitana", "Santiago");
        }, [35000])

        setTimeout(() => {
            fetchApartments("https://www.portalinmobiliario.com/venta/departamento/propiedades-usadas/santiago-metropolitana/_Desde_51_NoIndex_True", "Santiago");
        }, [43000])

        setTimeout(() => {
            fetchApartments("https://www.portalinmobiliario.com/venta/departamento/propiedades-usadas/santiago-metropolitana/_Desde_101_NoIndex_True", "Santiago");
        }, [49000])

        setTimeout(() => {
            fetchApartments("https://www.portalinmobiliario.com/venta/departamento/propiedades-usadas/santiago-metropolitana/_Desde_151_NoIndex_True", "Santiago");
        }, [57000])

        // Remove Daily storage
        deleteApartmentsByDate()

        res.status(200).json({success: true}) 
    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, errorMessage: error })
    }   
}

const storeVitacuraMaipu = async (req, res) => {
    try {
        fetchApartments("https://www.portalinmobiliario.com/venta/departamento/propiedades-usadas/vitacura-metropolitana", "Vitacura");

        setTimeout(() => {
            fetchApartments("https://www.portalinmobiliario.com/venta/departamento/propiedades-usadas/vitacura-metropolitana/_Desde_51_NoIndex_True", "Vitacura");
        }, [6000])

        setTimeout(() => {
            fetchApartments("https://www.portalinmobiliario.com/venta/departamento/propiedades-usadas/vitacura-metropolitana/_Desde_101_NoIndex_True", "Vitacura");
        }, [14000])

        setTimeout(() => {
            fetchApartments("https://www.portalinmobiliario.com/venta/departamento/propiedades-usadas/vitacura-metropolitana/_Desde_151_NoIndex_True", "Vitacura");
        }, [25000])

        setTimeout(() => {
            fetchApartments("https://www.portalinmobiliario.com/venta/departamento/propiedades-usadas/maipu-metropolitana", "Maipú");
        }, [36000])

        setTimeout(() => {
            fetchApartments("https://www.portalinmobiliario.com/venta/departamento/propiedades-usadas/maipu-metropolitana/_Desde_51_NoIndex_True", "Maipú");
        }, [48000])

        setTimeout(() => {
            fetchApartments("https://www.portalinmobiliario.com/venta/departamento/propiedades-usadas/maipu-metropolitana/_Desde_101_NoIndex_True", "Maipú");
        }, [57000])

        setTimeout(() => {
            fetchApartments("https://www.portalinmobiliario.com/venta/departamento/propiedades-usadas/maipu-metropolitana/_Desde_151_NoIndex_True", "Maipú");
            console.log("Last Task")
        }, [69000])

        res.status(200).json({success: true}) 
    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, errorMessage: error })
    }   
}

// Query to store Area Averages by City in DB
const storeAreasDB = async (req, res) => {
    try {
        getAverageByZone("santiago")
        getAverageByZone("providencia")
        getAverageByZone("vitacura")
        getAverageByZone("maipú")
        res.status(200).json({success: true}) 
    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, errorMessage: error })
    }   
}

// Query to store Cities Averages in DB
const storeCitiesDB = async (req, res) => {
    try {
        getCitiesAverages()
        res.status(200).json({success: true}) 
    } catch (error) {
        res.status(400).json({ success: false, errorMessage: error })
    }   
}

// Query to get a report to commercial email daily of all entities stored today
const reportsDB = async (req, res) => {
    try {
        connectDB(process.env.MONGO_URI)
        const citiesAveragePrices = await CitiesAverages.find({ date: dateFormat() })
        const areasAverages = await AreaAverages.find({ date: dateFormat() })
        const transporter = nodemailer.createTransport({
            host: "smtp.zoho.eu",
            port: 465,
            secure: true, 
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASSWORD, 
            },
        });

        const mailData = {
            from: process.env.EMAIL_USER,  
            to: process.env.EMAIL_USER,   
            subject: 'Reporte Diario DB',
            html: dailyDBReportEmail(citiesAveragePrices[0], areasAverages)
        };  

        transporter.sendMail(mailData, function (err, info) {
            if(err) console.log(err)
            else res.status(200).json({message: "Reporte enviado al correo"})
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error})
    }
}

module.exports = { storeSantiagoProvidencia, storeVitacuraMaipu, storeAreasDB, storeCitiesDB, reportsDB }
