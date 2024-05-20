const Apartment = require("../src/models/Apartment")
const connectDB = require("../src/db/connect")
require("dotenv").config()

const deleteApartmentsByDate = async () => {
    const now = new Date();
    const XDaysAgoDate =  new Date(now.getFullYear(), now.getMonth(), now.getDate() - 4); // + 1 para hoy y descomentar el llamado a la function
    const isoString = XDaysAgoDate.toISOString()
    const XDaysAgoDateString = isoString.slice(0, 10)
    connectDB(process.env.MONGO_URI)
    Apartment.deleteMany({ date: XDaysAgoDateString  }).then(res => console.log("success", res)).catch(error => console.log(error))
}

// deleteApartmentsByDate()

module.exports = deleteApartmentsByDate


