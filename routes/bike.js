const express = require('express')
const router = express.Router();
const { addNewBike, getAllBikes, updateBike, deleteBike,likeBike,dislikeBike,commentOnBike,sortBylike,uploadBikeImage} = require('../controllers/bikeController')
const { auth, authRole } = require('../middleware/auth')
const ErrorHandler = require('../utils/errorHandeler');
const catchAsyncError = require('../middleware/catchAsyncError')
const multer = require('multer')



const upload = multer({  
    limits: {
        fieldSize:1000000
    },
    fileFilter(req, file, cb){
        if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
            cb(new ErrorHandler("File must be image") )           
        }
        cb(undefined,true)
        
    }
})



//add new bike
router.post('/bike/new', auth, addNewBike);

router.post('/bike/image/:id', auth, upload.single('bike'), uploadBikeImage)

//get all bikes data
router.get('/bike', getAllBikes);

//get all bikes data
router.get('/bike/mostliked', sortBylike);

//update bike details
router.patch('/bike/:id', auth, updateBike)

//delete bike
router.delete('/bike/:id',auth, deleteBike);

//like bike
router.post('/bike/like/:id', auth, likeBike)

//dislike bike
router.delete('/bike/like/:id', auth, dislikeBike)


//comment on bike
router.post('/bike/comment/:id',auth,commentOnBike)


//404
router.all('/bike/*', (req, res, next) => {
    next(new ErrorHandler(`${req.originalUrl} route not found`),404)
})
module.exports = router;
