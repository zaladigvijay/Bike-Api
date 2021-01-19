const Bike = require('../models/bike');
const ErrorHandler = require('../utils/errorHandeler');
const catchAsyncError = require('../middleware/catchAsyncError')
const ApiFilters=require('../utils/apiFilters')
const sharp=require('sharp')


//add new bike POST /bike/new

exports.addNewBike = catchAsyncError(async (req, res, next) => {
   
    const bike = new Bike({ ...req.body, posted_by: req.user._id })
    console.log(bike);

    await bike.save();

    res.status(200).json({
        success: true,
        message: "New bike created",
        data:bike
    })
});

//get all bikes GET /bike
exports.getAllBikes = catchAsyncError(async (req, res, next) => {
    const apiFilters = new ApiFilters(Bike.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .searchByQuery()
        .pagination();

    
    const bikes = await apiFilters.query
    if (!bikes || bikes.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Bike not found",
            
        })
    }
    
    res.status(200).json({
        success: true,
        results: bikes.length,
        data:bikes
    })
});



//Update bike PATCH /bike/:id
exports.updateBike=catchAsyncError( async (req, res,next) => {
    const keys = Object.keys(req.body);
    const updateallow = ['name', 'brand','displacement','max_power','colors','on_road_price','tank_capacity','description','bike_type']
    
    const allowtoupdate = keys.every((key) => updateallow.includes(key))
    if (!allowtoupdate) {
        return next(new ErrorHandler("Update Not allowed", 400))
    }
    const bike = await Bike.findById(req.params.id); 
    if (!bike) {
        return next(new ErrorHandler("Bike Not Found", 404))
    }    
    if ( ! bike.posted_by.equals (req.user._id)) {
        console.log(bike.posted_by,req.user._id)
        return next(new ErrorHandler("Authorization Fail",401))
    }    
    keys.forEach((key) => bike[key] = req.body[key])
    await bike.save();
    res.status(200).json({
        success: true,
        message: "Bike Updated",
        data:bike
    })
    
});

//delete bike DELETE /bike/:id
exports.deleteBike = catchAsyncError(async (req, res, next) => {

    const bike = await Bike.findById(req.params.id); 
    if (!bike) {
        return next(new ErrorHandler("Bike Not Found", 404))
    }    
    if ( ! bike.posted_by.equals (req.user._id)) {
        console.log(bike.posted_by,req.user._id)
        return next(new ErrorHandler("Authorization Fail",401))
    }
    await bike.remove();
    res.status(200).json({
        success: true,
        message: "Bike deleted",
        data: bike
    }
    )
})

//like bike POST bike/like/:id
exports.likeBike = catchAsyncError(async (req, res, next) => {
    const bike = await Bike.findById(req.params.id); 
    if (!bike) {
        return next(new ErrorHandler("Bike Not Found", 404))
    }    
    var isInArray = bike.liked_by.some((userid) => userid.equals(req.user._id))
    
    if (isInArray) {
        return res.status(200).json({
            success: true,
        message:"Already Liked"})
    }
    bike.liked_by.push(req.user._id);
    await bike.save();
    res.status(200).json({
        status: true,
        message:"Bike liked"
    })

});


exports.dislikeBike = catchAsyncError(async (req, res, next) => {
    const bike = await Bike.findById(req.params.id); 
    if (!bike) {
        return next(new ErrorHandler("Bike Not Found", 404))
    }    
    var isInArray = bike.liked_by.some((userid) => userid.equals(req.user._id))
    
    if (!isInArray) {
        return res.status(200).json({
            success: true,
            message: "Not liked this bike"
        })
    }
    bike.liked_by=bike.liked_by.filter((userid) => ! userid.equals(req.user._id))
    await bike.save();
    res.status(200).json({
        status: true,
        message:"Bike Disliked"
    })

});

exports.commentOnBike = catchAsyncError(async (req, res, next) => {
    const bike = await Bike.findById(req.params.id); 
    if (!bike) {
        return next(new ErrorHandler("Bike Not Found", 404))
    } 
    if (!req.body.text) {
        return next(new ErrorHandler("Comment text required",4000))
    }
    bike.comments.push({
        text: req.body.text,
        posted_by:req.user._id
    })
    await bike.save();
    res.status(200).json({
        success: true,
        message:"Commented Successfully"
    })
    
})


exports.sortBylike = catchAsyncError(async (req, res, next) => {
    const bikes = await Bike.find().sort({"liked_by":-1})
    if (!bikes || bikes.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Bike not found",
            
        })
    }    
    res.status(200).json({
        success: true,
        results: bikes.length,
        data:bikes
    })
    
})


exports.uploadBikeImage = catchAsyncError(async (req, res, next) => {    

    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    const bike = await Bike.findById(req.params.id); 
    if (!bike) {
        return next(new ErrorHandler("Bike Not Found", 404))
    }    
    if ( ! bike.posted_by.equals (req.user._id)) {
        console.log(bike.posted_by,req.user._id)
        return next(new ErrorHandler("Authorization Fail",401))
    }

    bike.image = buffer;
    await bike.save();
    res.status(200).json({
        success: true,
        message:"Image uploded"
    })

})
