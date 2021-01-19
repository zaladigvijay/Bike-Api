const jwt = require('jsonwebtoken')
const User = require('../models/users')
const catchAsyncError = require('./catchAsyncError')
const ErrorHandler = require('../utils/errorHandeler');


exports.auth=catchAsyncError(async (req, res, next) => {
    let token;
    if (req.header('Authorization') && req.header('Authorization').startsWith('Bearer')){
        token = req.header('Authorization').replace('Bearer ', '');
    }
    if (!token) {
        return next(new ErrorHandler("Authentication Fail",401));
    }
    const isValidToken = jwt.verify(token, process.env.JWT_TOKEN);
    const user = await User.findOne({ _id: isValidToken._id, 'tokens.token': token })
    if (!user) {
        return next(new ErrorHandler("Authentication Fail",401))
    }
    req.token = token
    req.user = user;
    next()   
});


exports.authRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler("Authentication Fail",403))
        }
        next();
    }
}