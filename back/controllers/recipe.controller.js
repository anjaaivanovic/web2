const express = require("express")
const router = express.Router()
const Recipe = require("../services/recipe.service")

router.post("/", async (req, res) => {
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

router.get("/", async (req, res) => {
    try{
        var recipe = await Recipe.findRecipeById(req.query.id)
        res.send({recipe: recipe})
    }
    catch (err){
        console.log(err)
        res.status(501).send({err: err})
    }
})

router.get("/all", async (req, res) => {
    try{
        var recipes = await Recipe.findRecipes(req.query.page)
        res.send({recipes: recipes})
    }
    catch (err){
        console.log(err)
        res.status(501).send({err: err})
    }
})

router.get("/:userId", async (req, res) => {
    try{
        var recipes = await Recipe.findRecipesByUserId(req.params.userId)
        res.send({recipes: recipes})
    }
    catch (err){
        console.log(err)
        res.status(501).send({err: err})
    }
})

module.exports = router