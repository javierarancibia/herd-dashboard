require("dotenv").config()

const apiKeyChecker = (req, res, next) => {
    if (!req.headers.commercial_city_api_key) {
        return res.status(401).json({ success: false, error: "Missing Api Key" })
    }
    if (req.headers.commercial_city_api_key !== process.env.COMMERCIAL_CITY_API_KEY) {
        return res.status(401).json({ success: false, error: "Api Key incorrect" })
    } else {
        next()
    }
}

module.exports = apiKeyChecker