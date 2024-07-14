const express = require("express")
const router = express.Router()
const Recipe = require("../services/recipe.service")
const Rating = require("../services/recipe.service")
const passport = require("./config/passport-config")
const upload = require('./config/multer-config'); 

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
router.post("/", passport.authenticate('jwt', {session: false}), upload.single('image'),
async (req, res) => {
    try{
        req.body.image = "defaultRecipe.png"
        if (req.file) req.body.image = req.file.filename

        req.body.ingredients = JSON.parse(req.body.ingredients);
        req.body.steps = JSON.parse(req.body.steps);

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
        res.send(recipe)
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
        var recipes = await Recipe.findRecipes(req.query.userId, req.query.page, categories, req.query.search, req.query.prepTime, req.query.cookTime, req.query.servingSize, req.query.sort, req.query.order, req.query.home)
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

router.put("/", passport.authenticate('jwt', { session: false }), upload.single('image'), async (req, res) => {
    try {
        if (!req.body.image) req.body.image = "defaultRecipe.png"
        if (req.file) req.body.image = req.file.filename

        req.body.ingredients = JSON.parse(req.body.ingredients);
        req.body.steps = JSON.parse(req.body.steps);

        var result = await Recipe.updateRecipe(req.body._id, req.body);
        console.log(result)
        if (result) res.send({ recipe: result });
        else res.status(501).send();
    } catch (err) {
        console.log(err);
        res.status(501).send({ err: err });
    }
});

router.post("/rate", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try{
        var result = await Recipe.rateRecipe(req.body);
        if (result) res.send( { recipe: result });
        else res.status(501).send()
    }
    catch (err){
        console.log(err);
        res.status(501).send({ err: err });
    }
})

router.get("/rated/try", passport.authenticate('jwt', {session: false}),
async (req, res) => {
    try{
        var rated = await Recipe.checkRated(req.user._id, req.query.recipeId)
        res.send({rated: rated})
    }
    catch (err){
        console.log(err)
        res.status(501).send({err: err})
    }
})

module.exports = router