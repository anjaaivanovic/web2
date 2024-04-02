const express = require("express")
const router = express.Router()
const User = require("../services/user.service")

router.post("/register", async (req, res) => {
    try
    {
        var token = await User.register(req.body.email, req.body.firstName, req.body.lastName, req.body.password)  
        if (token) res.send({token: token})
        else res.status(501).send()  
    }
    catch(err) { 
        if (err instanceof Error && err.code === 11000) res.status(501).send({err: "Email already in use!"}) 
        else res.status(501).send({err: "Other error: " + err})
    }
})

router.post("/login", async (req, res) => {
    
})

module.exports = router