const express = require('express')
const router = express.Router()

const { storeSantiagoProvidencia, storeVitacuraMaipu, storeAreasDB, storeCitiesDB, reportsDB } = require("../controllers/dbTasks") 

//Apartments
router.route("/apartments/santiago-providencia").post(storeSantiagoProvidencia)
router.route("/apartments/vitacura-maipu").post(storeVitacuraMaipu)


// Main Data
router.route("/areas").post(storeAreasDB)
router.route("/cities").post(storeCitiesDB)
router.route("/reports").post(reportsDB)

module.exports = router