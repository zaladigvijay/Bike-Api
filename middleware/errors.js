const ErrorHandler=require('../utils/errorHandeler')
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            success: false,
            error:err,
            message: err.message,
            stack:err.stack
        })
    }
    if (process.env.NODE_ENV === 'production') {
        let error = { ...err }
        error.message = err.message;

        //Handeling mongoose id error
        if (err.name === 'CastError') {
            const message = `Resource not found. Invalid :${err.path}`
            error=new ErrorHandler(message,404)
        }

        //Handeling validation error
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(value => value.message)
            error=new ErrorHandler(message,404)
        }

        //Handeling mongoose duplicate key error
        if (err.code === 11000) {
            error=new ErrorHandler("Duplicate Email address",400)
        }


        //handeling invalid jwt token error
        if (err.name === 'JsonWebTokenError') {
            error=new ErrorHandler("Invalid JSON web token",500)
        }

        //Json web token expire error
        if (err.name === "TokenExpiredError") {
            error=new ErrorHandler("Expired JSON web token",500)
        }
        
        res.status(error.statusCode).json({
            success: false,
            message:error.message || "Internal Server Error"
        })
    }
}