const express = require("express")
const router = express.Router()
const User = require("../services/user.service")
const passport = require("./config/passport-config")
const upload = require('./config/multer-config'); 

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Operations related to authorization
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: User registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - username
 *              - email
 *              - password
 *             properties:
 *               email:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully registered the user
 *       501:
 *         description: Internal server error
 */
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

router.post("/login", (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: info.message });
        }
        res.json({ token: user.generateJwt() });
    })(req, res, next);
});

router.get("/:id", async (req, res) => {
    try{
        var profile = await User.getProfile(req.params.id);
        res.send(profile)
    }
    catch (err){
        console.log(err)
        res.status(501).send({err: err})
    }
})

router.delete("/", async (req, res) => {
    try{
        var success = await User.deleteUser(req.query.id);
        res.send(success)
    }
    catch (err){
        res.status(501).send({err: err})
    }
})

router.put("/", passport.authenticate('jwt', { session: false }), upload.single('image'),
async (req, res) => {
    try {
        if (!req.body.image) req.body.image = "default.png"
        if (req.file) req.body.image = req.file.filename
        var result = await User.updateUser(req.user._id, req.body, req.body.password);
        if (result) res.send({ user: result });
        else res.status(501).send();
    } catch (err) {
        res.status(400).send({ err: err.message });
    }
});

router.get("/validate-jwt", passport.authenticate('jwt', {session: false}),
(req, res)=> {
    res.send({ isValid: true});
})

module.exports = router