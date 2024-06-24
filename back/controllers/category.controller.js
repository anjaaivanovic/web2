const express = require("express")
const router = express.Router()
const Category = require("../services/category.service")
const passport = require("./config/passport-config")

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Operations related to categories
 */


/**
 * @swagger
 * /category:
 *   post:
 *     tags: [Category]
 *     summary: Add a category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Successfully added the category
 *       501:
 *         description: Internal server error
 */
router.post("/", passport.authenticate('jwt', {session: false}),
 async (req, res) => {
    try{
        var result = await Category.saveCategory(req.body)
        if (result) res.send({result: result})
        else res.status(501).send()
    }
    catch (err) {
        console.log(err)
        res.status(501).send({err: err})
    }
})

/**
 * @swagger
 * /category:
 *   delete:
 *     tags: [Category]
 *     summary: Delete a category
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: ID of the category to delete.
 *     responses:
 *       200:
 *         description: Successfully deleted the category
 *       501:
 *         description: Internal server error
 */
router.delete("/", passport.authenticate('jwt', {session: false}),
async (req, res) => {
    try{
        var succes = await Category.deleteCategory(req.query.categoryId)
        res.send({success: succes})
    }
    catch (err){
        console.log(err)
        res.status(501).send({err: err})
    }
})

/**
 * @swagger
 * /category/all:
 *   get:
 *     tags: [Category]
 *     summary: Get all categories
 *     responses:
 *       200:
 *         description: Successfully retrieved all recipes
 *       501:
 *         description: Internal server error
 */
router.get("/all", async (req, res) => {
    try{
        var categories = await Category.getCategories()
        res.send({categories: categories})
    }
    catch (err){
        console.log(err)
        res.status(501).send({err: err})
    }
})


module.exports = router
