const express = require("express")
const router = express.Router()
const SavedRecipe = require("../services/savedRecipe.service")

router.get("/:userId", async (req, res) => {
    try{
        var recipes = await SavedRecipe.findSavedRecipes(req.params.userId, req.query.page, req.query.categories, req.query.sort)
        res.send({recipes: recipes})
    }
    catch (err){
        console.log(err)
        res.status(501).send({err: err})
    }
})

router.post("/", async (req, res) => {
    try{
        var result = await SavedRecipe.save(req.body)
        if (result) res.send({result: result})
        else res.status(501).send()
    }
    catch (err) {
        console.log(err)
        if (err instanceof Error && err.code === 11000) res.status(501).send({err: "Recipe already saved!"}) 
        else res.status(501).send({err: "Other error: " + err})
    }
})

router.delete("/", async (req, res) => {
    try{
        var succes = await SavedRecipe.unsave(req.query.userId, req.query.recipeId)
        res.send({success: succes})
    }
    catch (err){
        console.log(err)
        res.status(501).send({err: err})
    }
})

module.exports = router