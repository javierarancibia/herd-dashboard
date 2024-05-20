const fetchApartments = require("./RequestStoreFunction")
const connectDB = require("../src/db/connect")
require("dotenv").config()


try {
    connectDB(process.env.MONGO_URI)
    fetchApartments("https://www.portalinmobiliario.com/venta/departamento/propiedades-usadas/maipu-metropolitana/_Desde_151_NoIndex_True", "Maipú");
} catch (error) {
    console.log(error);
}