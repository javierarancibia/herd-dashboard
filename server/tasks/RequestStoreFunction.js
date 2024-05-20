const connectDB = require("../src/db/connect")
const got = require("got");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const Apartment = require("../src/models/Apartment")
require("dotenv").config()

const fetchApartments = (argUrl, argCity) => {
    const listings = []
    const url = argUrl;

    got(url)
    .then((response) => {
        // Scraping of DOM to retrieve needed data
        const dom = new JSDOM(response.body);
        dom.window.document.querySelectorAll(".ui-search-result__wrapper").forEach((name, i) => {
            const href = name.querySelector('a').href
            let street = name.querySelector(".ui-search-item__location") ? name.querySelector(".ui-search-item__location").textContent : "Calle"

            let surface = name.querySelector(".ui-search-card-attributes__attribute") ? name.querySelector(".ui-search-card-attributes__attribute").textContent : null
            let rooms;
            if (surface && surface.includes("tiles")) {
                surface = surface.replace(/\D/g, '') // Regext to remove text and leave only number
                rooms = name.querySelector(".ui-search-card-attributes__attribute:nth-of-type(even)") ? name.querySelector(".ui-search-card-attributes__attribute:nth-of-type(even)").textContent.replace(/\D/g, '') : 2
            } 
            if (surface && surface.includes("dorm")) {
                rooms = surface.replace(/\D/g, '')
                surface = 65
            }

            let price = name.querySelector(".andes-money-amount__fraction") ? name.querySelector(".andes-money-amount__fraction").textContent.replace(".", "") : null
            price = Number(price)
            let currency = name.querySelector(".andes-money-amount__currency-symbol") ? name.querySelector(".andes-money-amount__currency-symbol").textContent : null
            let squareMPrice = price / surface 
            const now = new Date()
            // Constructor of each apartment object is pushed to the array
            const apartment = { 
                date: now.toISOString(), 
                street: street, 
                city: argCity, 
                surface: Number(surface), 
                rooms: Number(rooms), 
                price: price, 
                squareMPrice: Number(squareMPrice.toFixed(1)), 
                currency: currency, 
                url: href 
            }
            if (    
                    typeof apartment.street === "string" &&
                    typeof apartment.city === "string" &&
                    isNaN(apartment.surface) === false && 
                    isNaN(apartment.rooms) === false && 
                    isNaN(apartment.price) === false && 
                    isNaN(apartment.squareMPrice) === false &&
                    typeof apartment.currency === "string" &&
                    typeof apartment.url === "string" 
                ) {
                listings.push(apartment)
            }
        });
        return listings

    }).then(listings => {
        // Object constructor to post in MongoDB
        const now = new Date()
        const nowString = now.toISOString()
        const slicedDate = nowString.slice(0, 10)
        const data = { date: slicedDate, city: argCity.toLowerCase(), data: listings }
        storeDataDB(data)
    })
    .catch((err) => {
        console.log(err);
        console.log("Error in Url", argUrl);
    });
}


const storeDataDB = async data => {
    Apartment.create(data) // Method to store object in MONGODB
    await connectDB(process.env.MONGO_URI)
} 


module.exports = fetchApartments