const express = require("express")
const router = express.Router()
const Recipe = require("../services/recipe.service")
const passport = require("./config/passport-config")

/**
 * @swagger
 * tags:
 *   name: Recipe
 *   description: Operations related to recipes
 */

/**
 * @swagger
 * /recipe:
 *   post:
 *     tags: [Recipe]
 *     summary: Save recipe
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
        var result = await Recipe.saveRecipe(req.body)
        if (result) res.send({result: result})
        else res.status(501).send()
    }
    catch (err){
        console.log(err)
        res.status(501).send({err: err})
    }
})

/**
 * @swagger
 * /recipe:
 *   get:
 *     tags: [Recipe]
 *     summary: Get recipe by id
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: ID of the recipe to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the recipe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recipe:
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
router.get("/", async (req, res) => {
    try{
        var recipe = await Recipe.findRecipeById(req.query.id, req.query.commentPage)
        res.send({recipe: recipe})
    }
    catch (err){
        console.log(err)
        res.status(501).send({err: err})
    }
})

/**
 * @swagger
 * /recipe/all:
 *   get:
 *     tags: [Recipe]
 *     summary: Get all recipes
 *     parameters:
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
 *         description: Array of categories to filter recipes.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sorting criteria for recipes.
 *     responses:
 *       200:
 *         description: Successfully retrieved all recipes
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
router.get("/all", async (req, res) => {
    try{
        var categories = req.query.categories ? req.query.categories.split(',') : [];
        var recipes = await Recipe.findRecipes(req.query.page, categories, req.query.search, req.query.prepTime, req.query.cookTime, req.query.servingSize, req.query.sort, req.query.order)
        res.send({recipes: recipes})
    }
    catch (err){
        console.log(err)
        res.status(501).send({err: err})
    }
})

/**
 * @swagger
 * /recipe/{userId}:
 *   get:
 *     tags: [Recipe]
 *     summary: Get recipes by user id
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         description: ID of the user to retrieve recipes for.
 *     responses:
 *       200:
 *         description: Successfully retrieved recipes by userId
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
router.get("/:userId", async (req, res) => {
    try{
        var recipes = await Recipe.findRecipesByUserId(req.params.userId, req.query.page, req.query.categories, req.query.prepTime, req.query.cookTime, req.query.servingSize, req.query.search, req.query.sort, req.query.order)
        res.send({recipes: recipes})
    }
    catch (err){
        console.log(err)
        res.status(501).send({err: err})
    }
})

/**
 * @swagger
 * /recipe/:
 *   delete:
 *     tags: [Recipe]
 *     summary: Delete a recipe
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: ID of the recipe to delete.
 *     responses:
 *       200:
 *         description: Successfully deleted the recipe
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
        var success = await Recipe.deleteRecipe(req.query.id)
        res.send({success: success})
    }
    catch (err){
        console.log(err)
        res.status(501).send({err: err})
    }
})

router.put("/", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        var result = await Recipe.updateRecipe(req.body.id, req.body);
        if (result) res.send({ recipe: result });
        else res.status(501).send();
    } catch (err) {
        console.log(err);
        res.status(501).send({ err: err });
    }
});

module.exports = router