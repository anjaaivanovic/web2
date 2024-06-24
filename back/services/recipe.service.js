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
        return await RecipeModel.findOne({_id: id}).populate('owner').populate('comments').populate('categories');
    else
        return undefined;

    }
    catch (err) { throw err }
}

var findRecipesByUserId = async function(userId)
{
    try{
        if (ObjectId.isValid(userId))
        return await RecipeModel.find({owner: userId}).populate('owner').populate('comments').populate('categories');
    else
        return undefined;

    }
    catch (err) { throw err }
}

var findRecipes = async function(page, categories, search, sort, order)
{
    try{
        var query = {};
        if (categories && categories.length > 0) {
            query.categories = { $in: categories };
        }
        if (search) {
            query.$text = { $search: search };
        }

        var sortCriteria = {};
        if (sort && order) sortCriteria[sort] = order === 'asc' ? 1 : -1;
        else sortCriteria = { title: 1 };

        return await RecipeModel.find(query)
            .sort(sortCriteria)
            .skip((page - 1) * recipesPerPage).limit(recipesPerPage)
            .populate('owner').populate('comments').populate('categories');    
    }
    catch (err) { throw err }
}

var deleteRecipe = async function(id){
    try{
        if (ObjectId.isValid(id))
        {
            var deletedCount = (await RecipeModel.deleteOne({_id: id})).deletedCount
            return deletedCount > 0
        }
        return false
    }
    catch (err){ throw err }
}

module.exports = {
    saveRecipe,
    findRecipeById,
    findRecipesByUserId,
    findRecipes,
    deleteRecipe
}