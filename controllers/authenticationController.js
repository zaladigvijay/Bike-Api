const User = require('../models/users')
const ErrorHandler = require('../utils/errorHandeler');
const catchAsyncError = require('../middleware/catchAsyncError');



//register new user  /user/register
exports.registerNewUser = catchAsyncError(async (req, res, next) => {
    const user = new User(req.body);
    await user.save();
    const token = await user.getJsonWebToken();
    res.status(200).json({
        success: true,
        message: "Registration Success",
        data: user,
        token
    })
})



//Login User /user/login
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler("Please Enter email and password", 400))
    }
    const user = await User.finByCredintial(email, password);
    const token = await user.getJsonWebToken();
    res.status(200).json({
        success: true,
        message: "User Suucessfully login",
        user,
        token
    });

})

//logout user/logout
exports.logOut = catchAsyncError(async (req, res, next) => {
    req.user.tokens = req.user.tokens.filter((value) => { return value.token !== req.token })
    await req.user.save();
    res.status(200).json({
        success: true,
        message: "Logout successfull"
    });

})


//logout from all endpoints /user/logoutall
exports.logOutAll=catchAsyncError(async (req, res,next) => {
        req.user.tokens = []
        await req.user.save();
        res.status(200).json({
            success: true,
            message: "Logout successfull"
        });

})

