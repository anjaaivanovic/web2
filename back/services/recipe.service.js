const RecipeModel = require("../models/recipe.model")
const RatingModel = require("../models/rating.model")
const CommentModel = require("../models/comment.model")
const HelperService = require("../services/helper.service")
const UserService = require("../services/user.service")
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

            if (!recipe) return undefined;

            var averageRating = await HelperService.recipeAverage(id)

            var commentsQuery = CommentModel.find({ recipe: id })
                .sort({ createdAt: -1 })
                .skip((commentPage - 1) * commentsPerPage)
                .limit(commentsPerPage)
                .populate('user');

            var comments = await commentsQuery;
            var totalComments = await CommentModel.countDocuments({ recipe: id });
            var totalCommentPages = Math.ceil(totalComments / commentsPerPage);

            recipe.comments = comments;
            return {
                recipe,
                averageRating,
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

var findRecipes = async function(userId, page = 1, categories = [], search = '', prepTime, cookTime, servingSize, sort = 'title', order = 'asc', home = null) {
    try {
        var authors = []
        var query = {};
        if (userId && ObjectId.isValid(userId)) query.owner = userId;
        if (categories.length > 0) query.categories = { $in: categories };
        if (search) {
            authors = await UserService.findUserIdsByName(search);
            const regex = new RegExp('\\b' + search, 'i'); 
            query.$or = [
                { title: { $regex: regex } },
                { owner: { $in: authors } }
            ];
        }
        if (prepTime) query.prepTime = { $lte: prepTime };
        if (cookTime) query.cookTime = { $lte: cookTime };
        if (servingSize) query.servingSize = { $gte: servingSize };
        if (home) query.owner = { $ne: home };

        var sortCriteria = {};
        var sortByRating = false;
        if (sort === "rating") {  
            sortCriteria = { averageRating: order === 'asc' ? 1 : -1 };
            sortByRating = true;
        } else {
            sortCriteria[sort] = order === 'asc' ? 1 : -1;
        }

        var totalItems = await RecipeModel.countDocuments(query);
        var recipesQuery = RecipeModel.find(query)
            .populate('owner')
            .populate('comments')
            .populate('categories')
            .lean();
        
        var recipes = await recipesQuery;
        
        if (sortByRating) {
            var averageRatings = await HelperService.averageRatings();
            var ratingMap = averageRatings.reduce((map, avgRating) => {
                map[avgRating._id.toString()] = avgRating.averageRating;
                return map;
            }, {});

            recipes = recipes.sort((recipeA, recipeB) => {
                var ratingA = ratingMap[recipeA._id.toString()] || 0;
                var ratingB = ratingMap[recipeB._id.toString()] || 0;
                return (order === 'asc' ? ratingA - ratingB : ratingB - ratingA);
            });
        } else {
            recipes = recipes.sort((a, b) => {
                if (a[sort] < b[sort]) return order === 'asc' ? -1 : 1;
                if (a[sort] > b[sort]) return order === 'asc' ? 1 : -1;
                return 0;
            });
        }

        var paginatedRecipes = recipes.slice((page - 1) * recipesPerPage, page * recipesPerPage);

        var ratings = await RatingModel.aggregate([
            {
                $group: {
                    _id: '$recipe',
                    averageRating: { $avg: '$rating' }
                }
            }
        ]);

        var recipesWithRatings = paginatedRecipes.map(recipe => {
            var rating = ratings.find(r => r._id.toString() === recipe._id.toString());
            return {
                ...recipe,
                averageRating: rating ? rating.averageRating : 0
            };
        });

        var totalPages = Math.ceil(totalItems / recipesPerPage);

        return {
            data: recipesWithRatings,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                pageSize: recipesPerPage,
                totalItems: totalItems
            }
        };
    } catch (err) { 
        throw err; 
    }
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

var rateRecipe = async function(rating) {
    try{
        return await RatingModel.saveRating(rating)
    }
    catch (err) { throw err }
}

var deleteRating = async function(id) {
    try{
        if (ObjectId.isValid(id))
        {
            var deletedCount = (await RatingModel.deleteOne({_id: id})).deletedCount
            return deletedCount > 0
        }
        return false
    }
    catch (err){ throw err }
}

var checkRated = async function(userId, recipeId){
    try {
        if (ObjectId.isValid(userId) && ObjectId.isValid(recipeId)) {
          const count = await RatingModel.countDocuments({ user: userId, recipe: recipeId });
          return count > 0;
        }
        return false;
      } catch (error) {
        console.error('Error checking rated recipe:', error);
        throw error;
    }
}

module.exports = {
    saveRecipe,
    findRecipeById,
    findRecipes,
    deleteRecipe,
    updateRecipe,
    rateRecipe,
    deleteRating,
    checkRated
}