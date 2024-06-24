var passport = require("passport")
var LocalStrategy = require("passport-local").Strategy
var passportJwt = require("passport-jwt")
var UserModel = require("../../models/user.model")
const config = require("../../config/config")

var localOptions ={
    usernameField: "email"
}

passport.use(new LocalStrategy(localOptions, async function(email, password, done){

    var user = await UserModel.findOne({email:email})

    if (!user)
    {
        done(null, null, {
            message: "Incorrect email"
        })
    }
    else
    {
        var validation = user.validatePassword(password)

        if (validation)
        {
            done(null, user)
        }
        else
        {
            done(null, null, {
                message: "Incorrect password"
            })
        }
    }
}))

var jwtOptions = {
    secretOrKey: config.secret,
    jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken()
}


passport.use(new passportJwt.Strategy(jwtOptions, async function(jwt_payload,done){
    var user = await UserModel.findById(jwt_payload._id)
    console.log(jwt_payload)
    if (!user)
    {
        done(null, null, {
            message: "Credentials not valid!"
        })
    }
    else
    {
        done(null, user)
    }

}))

passport.authorizeRoles = (...roles) => (req,res,next) => {
    
    var valid = roles.find(role=> role === req.user.getRole())

    if (valid)
    {
        req.role = req.user.getRole()
        next()
    }
    else{
        res.status(403)
        res.send("Not Authorized")
    }

}


passport.log = () => (req,res,next) =>{
    req.logged = true
    console.log("User: "+req.user.email)

    next()
}

module.exports = passport