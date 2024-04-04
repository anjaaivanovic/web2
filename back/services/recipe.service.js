const RecipeModel = require("../models/recipe.model")
var ObjectId = require('mongoose').Types.ObjectId;

const recipesPerPage = 3

var saveRecipe = async function(recipe)
{
    try{
        return await RecipeModel.saveRecipe(recipe)
    }
    catch (err) { throw err }
}

var findRecipeById = async function(id)
{
    try{
        if (ObjectId.isValid(id))
        return RecipeModel.findOne({_id: id}).populate('owner').populate('comments').populate('categories');
    else
        return undefined;

    }
    catch (err) { throw err }
}

var findRecipesByUserId = async function(userId)
{
    try{
        if (ObjectId.isValid(userId))
        return RecipeModel.find({owner: userId}).populate('owner').populate('comments').populate('categories');
    else
        return undefined;

    }
    catch (err) { throw err }
}

//add sorting
var findRecipes = async function(page, categories, sort)
{
    try{
        var query = {};
        if (categories && categories.length > 0) {
            query.categories = { $in: categories };
        }

        return await RecipeModel.find(query)
            .skip((page - 1) * recipesPerPage).limit(recipesPerPage)
            .populate('owner').populate('comments').populate('categories');    
    }
    catch (err) { throw err }
}

module.exports = {
    saveRecipe,
    findRecipeById,
    findRecipesByUserId,
    findRecipes
}