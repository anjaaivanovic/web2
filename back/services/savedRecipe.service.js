const SavedRecipeModel = require("../models/savedRecipe.model")
const RecipeModel = require("../models/recipe.model")
var ObjectId = require('mongoose').Types.ObjectId;

const recipesPerPage = 3

var findSavedRecipes = async function(userId, page, categories, sort, order)
{
    try{
        if (ObjectId.isValid(userId))
        {
            var ids = await SavedRecipeModel.find({userId: userId})
            var recipeIds = ids.map(item => item.recipeId);
        
            var query = {_id: {$in: recipeIds}};

            if (categories && categories.length > 0) {
                query.categories = { $in: categories };
            }

            var sortCriteria = {};
            if (sort && order) sortCriteria[sort] = order === 'asc' ? 1 : -1;
            else sortCriteria = { title: 1 };

            return await RecipeModel.find(query)
                .sort(sortCriteria)
                .skip((page - 1) * recipesPerPage).limit(recipesPerPage)
                .populate('owner').populate('comments').populate('categories');    
        }
    }
    catch (err) { throw err }
}

var save = async function (recipe)
{
    try{
        return await SavedRecipeModel.saveRecipe(recipe);
    }
    catch (err) { throw err }
}

var unsave = async function(userId, recipeId)
{
    try{
        if (ObjectId.isValid(userId) && ObjectId.isValid(recipeId))
        {
            var deletedCount = (await SavedRecipeModel.deleteOne({ userId: userId, recipeId: recipeId})).deletedCount
            return deletedCount > 0
        }
        return false;
    }
    catch (err) { throw err }
}

module.exports = {
    findSavedRecipes,
    save,
    unsave
}