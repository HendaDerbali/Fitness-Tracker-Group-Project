const mongoose = require("mongoose")

const dbName = process.env.DB


mongoose.connect(`mongodb://127.0.0.1:27017/${dbName}`)
    .then(() => { console.log(`Established a connection to the database ${dbName}`) })
    .catch(err => console.log("Something Went wrong when connecting to the DB ", err))