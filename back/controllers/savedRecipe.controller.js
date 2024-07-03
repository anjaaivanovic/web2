const express = require("express")
const router = express.Router()
const SavedRecipe = require("../services/savedRecipe.service")
const passport = require("./config/passport-config")

/**
 * @swagger
 * tags:
 *   name: SavedRecipe
 *   description: Operations related to saved recipes
 */

/**
 * @swagger
 * /savedRecipe/{userId}:
 *   get:
 *     tags: [SavedRecipe]
 *     summary: Get user's saved recipes
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         description: id of the user to retrieve saved recipes for.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination.
 *       - in: query
 *         name: categories
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Array of categories to filter saved recipes.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sorting criteria for saved recipes.
 *     responses:
 *       200:
 *         description: Successfully retrieved saved recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recipes:
 *                   type: array
 *                   items:
 *                     type: object
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
router.get("/:userId", passport.authenticate('jwt', {session: false}),
async (req, res) => {
    try{
        var categories = req.query.categories ? req.query.categories.split(',') : [];
        var recipes = await SavedRecipe.findSavedRecipes(req.params.userId, req.query.page, categories, req.query.prepTime, req.query.cookTime, req.query.servingSize, req.query.sort, req.query.order)
        res.send({recipes: recipes})
    }
    catch (err){
        console.log(err)
        res.status(501).send({err: err})
    }
})

/**
 * @swagger
 * /savedRecipe:
 *   post:
 *     tags: [SavedRecipe]
 *     summary: Save a recipe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Successfully saved the recipe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
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
router.post("/", passport.authenticate('jwt', {session: false}),
async (req, res) => {
    try{
        var result = await SavedRecipe.save(req.body)
        if (result) res.send({success: result})
        else res.status(501).send()
    }
    catch (err) {
        console.log(err)
        if (err instanceof Error && err.code === 11000) res.status(501).send({err: "Recipe already saved!"}) 
        else res.status(501).send({err: "Other error: " + err})
    }
})

/**
 * @swagger
 * /savedRecipe:
 *   delete:
 *     tags: [SavedRecipe]
 *     summary: Unsave a recipe
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: ID of the user who saved the recipe.
 *       - in: query
 *         name: recipeId
 *         schema:
 *           type: string
 *         description: ID of the recipe to unsave.
 *     responses:
 *       200:
 *         description: Successfully unsaved the recipe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
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
router.delete("/", passport.authenticate('jwt', {session: false}),
async (req, res) => {
    try{
        var success = await SavedRecipe.unsave(req.query.userId, req.query.recipeId)
        res.send({success: success})
    }
    catch (err){
        console.log(err)
        res.status(501).send({err: err})
    }
})

router.get("/saved/try", passport.authenticate('jwt', {session: false}),
async (req, res) => {
    try{
        console.log('AAA')
        var saved = await SavedRecipe.checkSaved(req.query.userId, req.query.recipeId)
        console.log(saved)
        res.send({saved: saved})
    }
    catch (err){
        console.log(err)
        res.status(501).send({err: err})
    }
})

module.exports = router