const mongoose = require('mongoose');

const bikeSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Bike Name"],
        unique: true,
        maxlength: [200, "Title length must less then 100"]
    },
    brand: {
        type: String,
        required: [true, "Please Enter Bike Brand Name"],
        maxlength: [200, "Title length must less then 100"]
    },
    displacement: {
        type: Number,
        required:[true,"Please Enter Bike displacement value"]
    },
    max_power: {
        type: Number,
        required:[true,"Please enter max power value"]
    },
    colors: {
        type: [String],
        required:[true,"Please enter available color names"]
    },
    on_road_price: {
        type: Number
    },
    tank_capacity: {
        type: Number,
        required:[true,"Please enter "]
    },
    description: {
        type: String,
        required:[true,"please enter description"]
    },
    posted_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    bike_type: {
        type: mongoose.Schema.Types.ObjectId,
        required:[true,"Please enter bike type"]
    },
    liked_by: {
        type: [{ type : mongoose.Schema.Types.ObjectId, ref:"User" }],
        required:false
    },
    comments: [{
        text: String,
        posted_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        comment_date: {
            type: Date,
            default:new Date(Date.now())
        }
    }],
    image: {
        type:Buffer
    }


}, { timestamps: true });

bikeSchema.methods.toJSON= function () {
    const bike = this.toObject();
    delete bike.image
    return bike
    
}

const Bike=mongoose.model('Bike', bikeSchema);

module.exports = Bike