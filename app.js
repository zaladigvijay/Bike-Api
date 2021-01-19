const express = require('express')
const dotenv = require('dotenv')

const rateLimit = require('express-rate-limit')
const helmet = require('helmet')


const eroorMiddleware = require('./middleware/errors')
const ErrorHandler = require("./utils/errorHandeler")
const connectToDatabase = require('./config/database')


const app = express()


//configure environment variables
dotenv.config({ path: './config/config.env' })
//Handeling Uncaught exception
process.on('uncaughtException', err => {
    console.log('Error', err.message);
    process.exit(1)
})


//connect to database
connectToDatabase();

//setup security header
app.use(helmet())

const port = process.env.PORT

app.use(express.json())


//apply rate limit
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max:1000
})
app.use(limiter)

const authentication = require('./routes/authentication')
const biketype = require('./routes/biketype')
const bike = require('./routes/bike')

app.use(authentication)
app.use(biketype)
app.use(bike)


//handle unhadled routes
app.all('*', (req, res, next) => {
    next(new ErrorHandler(`${req.originalUrl} route not found`),404)
})

//use errorMiddleware
app.use(eroorMiddleware)

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))

process.on('unhandledRejection', err => {
    console.log("Err", err.message);
    server.close(() => {
        process.exit(1)
    })
})