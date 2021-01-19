const express = require('express')
const router = express.Router();
const { getBikeTypes, addBikeType } = require('../controllers/bikeTypeController')
const { auth, authRole } = require('../middleware/auth')
const ErrorHandler=require('../utils/errorHandeler')

//get all bike types
router.get('/biketypes',getBikeTypes);

//create new bike type
router.post('/biketypes/new',auth,authRole('admin'),addBikeType)

//404
router.all('/biketypes/*', (req, res, next) => {
    next(new ErrorHandler(`${req.originalUrl} route not found`),404)
})

module.exports=router