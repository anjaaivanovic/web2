const RecipeModel = require("../models/recipe.model")
var ObjectId = require('mongoose').Types.ObjectId;

const recipesPerPage = 3
const commentsPerPage = 2

var saveRecipe = async function(recipe)
{
    try{
        return await RecipeModel.saveRecipe(recipe)
    }
    catch (err) { throw err }
}

var findRecipeById = async function(id, commentPage = 1) {
    try {
        if (ObjectId.isValid(id)) {
            var recipe = await RecipeModel.findOne({ _id: id })
                .populate('owner')
                .populate('categories')
                .lean();

            if (!recipe) return undefined;

            var totalComments = await RecipeModel.countDocuments({ _id: id, comments: { $exists: true, $not: { $size: 0 } } });
            var totalCommentPages = Math.ceil(totalComments / commentsPerPage);

            var comments = await RecipeModel.findOne({ _id: id }, { comments: { $slice: [(commentPage - 1) * commentsPerPage, commentsPerPage] } })
                .populate('comments')
                .select('comments')
                .lean();

            recipe.comments = comments ? comments.comments : [];

            return {
                recipe,
                commentPagination: {
                    currentPage: commentPage,
                    totalPages: totalCommentPages,
                    pageSize: commentsPerPage,
                    totalItems: totalComments
                }
            };
        } else {
            return undefined;
        }
    } catch (err) { throw err; }
}

var findRecipesByUserId = async function(userId, page = 1) {
    try {
        if (ObjectId.isValid(userId)) {
            var query = { owner: userId };
            var totalItems = await RecipeModel.countDocuments(query);
            var recipes = await RecipeModel.find(query)
                .skip((page - 1) * recipesPerPage)
                .limit(recipesPerPage)
                .populate('owner')
                .populate('comments')
                .populate('categories');

            var totalPages = Math.ceil(totalItems / recipesPerPage);

            return {
                data: recipes,
                pagination: {
                    currentPage: page,
                    totalPages: totalPages,
                    pageSize: recipesPerPage,
                    totalItems: totalItems
                }
            };
        } else {
            return undefined;
        }
    } catch (err) { throw err; }
}

var findRecipes = async function(page = 1, categories = [], search = '', sort = 'title', order = 'asc') {
    try {
        var query = {};
        if (categories.length > 0) {
            query.categories = { $in: categories };
        }
        if (search) {
            query.$text = { $search: search };
        }

        var sortCriteria = {};
        sortCriteria[sort] = order === 'asc' ? 1 : -1;

        var totalItems = await RecipeModel.countDocuments(query);
        var recipes = await RecipeModel.find(query)
            .sort(sortCriteria)
            .skip((page - 1) * recipesPerPage)
            .limit(recipesPerPage)
            .populate('owner')
            .populate('comments')
            .populate('categories');

        var totalPages = Math.ceil(totalItems / recipesPerPage);

        return {
            data: recipes,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                pageSize: recipesPerPage,
                totalItems: totalItems
            }
        };
    } catch (err) { throw err; }
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

var updateRecipe = async function(id, updatedRecipe) {
    try {
        return await RecipeModel.updateRecipe(id, updatedRecipe);
    } catch (err) {
        throw err;
    }
};

module.exports = {
    saveRecipe,
    findRecipeById,
    findRecipesByUserId,
    findRecipes,
    deleteRecipe,
    updateRecipe
}