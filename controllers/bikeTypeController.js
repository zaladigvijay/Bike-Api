const BikeType = require('../models/biketypes');
const ErrorHandler = require('../utils/errorHandeler');
const catchAsyncError = require('../middleware/catchAsyncError')



//get all biketypes => /biketypes
exports.getBikeTypes = catchAsyncError(async (req, res, next) => {
    const biketypes = await BikeType.find({});
    if (!biketypes || biketypes.length == 0) {
        return res.status(200).json({
            success: true,
            message: "Bike Types Not available",
            result:biketypes.length
        })
    }
    res.status(200).json({
        status: true,
        result: biketypes.length,
         message:  "All Bike Types",
         data:biketypes
    })
});

    //add new job /biketypes/new
exports.addBikeType = catchAsyncError(async (req, res, next) => {
        const biketype = await BikeType.create(req.body);
    
        res.status(200).json({
            success: true,
            message: "Bike Type Created",
            data: biketype
        })
});

