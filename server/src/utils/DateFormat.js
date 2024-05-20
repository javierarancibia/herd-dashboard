// Function to get date from 1 or more days ago to query in MongoDB, not to Store anything!
const dateFormat = () => {
    const now = new Date()
    const XDaysAgoDate =  new Date(now.getFullYear(), now.getMonth(), now.getDate() ); // TODO Important: Change value to now.getDate + 1 or other value
    const isoString = XDaysAgoDate.toISOString()
    const XDaysAgoDateString = isoString.slice(0, 10)
    return XDaysAgoDateString
}

module.exports = dateFormat