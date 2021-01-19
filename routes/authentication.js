const experess = require('express');
const { auth } = require('../middleware/auth')
const ErrorHandler=require('../utils/errorHandeler')

const router = experess.Router();
const { registerNewUser,loginUser,logOut,logOutAll } = require('../controllers/authenticationController')

//User Registration endpoint
router.post('/user/register', registerNewUser)

//login route
router.post('/user/login', loginUser)

//logout 
router.post('/user/logout', auth, logOut);

//logout all
router.post('/user/logoutall', auth, logOutAll);

//404
router.all('/user/*', (req, res, next) => {
    next(new ErrorHandler(`${req.originalUrl} route not found`),404)
})

module.exports=router


