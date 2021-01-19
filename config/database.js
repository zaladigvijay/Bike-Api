const mongoose = require("mongoose");

const connectToDatabase = () => {
    mongoose.connect(process.env.DB_LOCAL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
    }).then(con => {
        console.log("Database connection successful")
    }).catch(error => {
      console.error(error)  
    })
}
module.exports=connectToDatabase

