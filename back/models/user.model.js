const mongoose = require("mongoose")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")

var UserSchema = mongoose.Schema({
    email: {type: String, unique: true},
    firstName: {type: String},
    lastName: {type: String},
    hash: {type: String},
    salt: {type: String},
    role: {type: Number},
    image: {type: String}
})

UserSchema.methods.savePassword = function(password)
{
    this.salt = crypto.randomBytes(16).toString("hex")
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000,64, "sha512").toString("hex")
}

UserSchema.methods.validatePassword = function(password)
{
    hash = crypto.pbkdf2Sync(password, this.salt, 1000,64, "sha512").toString("hex")
    return hash === this.hash
}

UserSchema.methods.generateJwt = function()
{
    var expire = new Date()
    expire.setDate(expire.getDate()+7)

    return jwt.sign({
        _id:this._id,
        _expire: parseInt(expire.getTime()/1000)
    }, config.secret)
}

UserSchema.methods.getRole = function()
{
    if (this.role == 1) return "ADMIN";
    else return "USER"
}

var UserModel = mongoose.model("user", UserSchema)

UserModel.register = async function(email, firstName, lastName, password)
{
    try
    {
        var user = new UserModel({
            email:email,
            firstName:firstName,
            lastName:lastName,
            admin: false,
            image: "../data/images/default.png"
        })

        user.savePassword(password)
    
        var result = await user.save()
        if (result)
            return user.generateJwt()
        else return undefined
    }
    catch(err){ throw err; }
}

module.exports = UserModel