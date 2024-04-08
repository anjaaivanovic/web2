const express = require("express")
const router = express.Router()
const User = require("../services/user.service")

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       501:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
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

router.post("/login", async (req, res) => {
    
})

module.exports = router