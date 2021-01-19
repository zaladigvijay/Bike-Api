const mongoose = require('mongoose');

const bikeTypeSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please Enter Bike Type"],
        trim: true,
        maxlength: [100, "Title length must less then 100"],
        unique:[true,"Bike Type Already Existes"]
    }
}, { timestamps: true });



module.exports = mongoose.model('BikeType', bikeTypeSchema);