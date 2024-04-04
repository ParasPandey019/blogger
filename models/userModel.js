const {createHmac , randomBytes} = require('node:crypto');
const {Schema, model} = require('mongoose');
const { createToken } = require('../services/auth');


const userSchema = new Schema ({ 
    fullName :{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    secret:{
        type: String,
    },
    profileImageUrl:{
        type: String,
        default: '/images/avatar.png',
    },
    role:{
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }
}, {timestamps: true})


userSchema.statics.checkPassword = async function(email,password){
    const user = await this.findOne({email: email});
    if(!user) return false;
    const secret = user.secret;
    const hashed = user.password;
    const checkedHash = createHmac('sha256', secret).update(password).digest("hex");

    if(checkedHash === hashed){
        const token = createToken(user);
        return token;
    }else{
        throw new Error('Incorrect email/password');
    }
};

userSchema.pre("save", function (next){
    const user = this;
    if(!user.isModified("password")) return;

    const secret = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', secret).update(user.password).digest("hex");
    this.secret = secret;
    this.password = hashedPassword;

    next();
})

const User = model('userModel', userSchema);

module.exports = User;