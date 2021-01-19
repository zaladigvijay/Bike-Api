const mongoose = require("mongoose");
const validator=require("validator")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const EroorHandler = require("../utils/errorHandeler");



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        requires: [true, "Please Enter Name"],
        
    },
    email: {
        type: String,
        required: [true, "Please Enter email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter valid email"]
    },
    role: {
        type: String,
        enum: {
            values: ['admin','user'],
            message:"Please Select Correct Role"
        },
        default:'user'
    },
    password: {
        type: String,
        required: [true, "Please Enter correct password"],
        select:false
    },
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
    tokens: [{
        token: {
            type: String,
            required:true
        }
        
    }]
}, { timestamps: true })


//Generate jsonwebtoken for authentication
userSchema.methods.getJsonWebToken = async function () {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_TOKEN)
    this.tokens.push({ token })
    await this.save();
    return token
}

userSchema.methods.toJSON= function () {
    const user = this.toObject();
    delete user.password;
    delete user.tokens;
    return user
    
}

//Encrypt user password before save object
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password= await bcrypt.hash(this.password,8)
    }
    next();
})

//Verify User Credentials
userSchema.statics.finByCredintial = async (email, password) => {
    
    const user = await User.findOne({ email }).select('+password')   
    
    if (! user) {
        throw new EroorHandler("Username or Password incorrect",401);       
    }
    const isMatch = await bcrypt.compare(password, user.password)
    
    if (! isMatch) {
        throw new EroorHandler("Username or Password incorrect",401)
    }        
    return user    
}

const User = mongoose.model('User', userSchema);

//Export module
module.exports =User
    
