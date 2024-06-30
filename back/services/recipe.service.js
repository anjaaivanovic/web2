const RecipeModel = require("../models/recipe.model")
const RatingModel = require("../models/rating.model")
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

async function calculateAverageRating(recipeId) {
    try {
        const ratings = await RatingModel.find({ recipe: recipeId });
        if (ratings.length === 0) {
            return 0;
        } else {
            const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
            const averageRating = totalRating / ratings.length;
            return averageRating;
        }
    } catch (err) {
        throw err;
    }
}

var findRecipeById = async function(id, commentPage = 1) {
    try {
        if (ObjectId.isValid(id)) {
            var recipe = await RecipeModel.findOne({ _id: id })
                .populate('owner')
                .populate('categories')
                .lean();

            if (!recipe) return undefined;

            const averageRating = await calculateAverageRating(id);
            var totalComments = await RecipeModel.countDocuments({ _id: id, comments: { $exists: true, $not: { $size: 0 } } });
            var totalCommentPages = Math.ceil(totalComments / commentsPerPage);

            var comments = await RecipeModel.findOne({ _id: id }, { comments: { $slice: [(commentPage - 1) * commentsPerPage, commentsPerPage] } })
                .populate('comments')
                .select('comments')
                .lean();

            recipe.comments = comments ? comments.comments : [];

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

var findRecipes = async function(userId, page = 1, categories = [], search = '', prepTime, cookTime, servingSize, sort = 'title', order = 'asc') {
    try {
        var query = {};
        
        if (userId && ObjectId.isValid(userId)) query.owner = userId;
        if (categories.length > 0) query.categories = { $in: categories };
        if (search) query.$text = { $search: search };
        if (prepTime) query.prepTime = { $lte: prepTime };
        if (cookTime) query.cookTime = { $lte: cookTime };
        if (servingSize) query.servingSize = { $gte: servingSize };

        var sortCriteria = {};
        var sortByRating = false;
        if (sort == "rating"){  
            sortCriteria = { averageRating: order === 'asc' ? 1 : -1 };
            sortByRating = true;
        }
        else sortCriteria[sort] = order === 'asc' ? 1 : -1;

        var totalItems = await RecipeModel.countDocuments(query);
        var recipesQuery = RecipeModel.find(query)
            .populate('owner')
            .populate('comments')
            .populate('categories');
        
        if (sortByRating) {
            var averageRatings = await calculateAverageRatings(userId, categories, search, prepTime, cookTime, servingSize, sort, order);

            var ratingMap = averageRatings.reduce((map, avgRating) => {
                map[avgRating._id.toString()] = avgRating.averageRating;
                return map;
            }, {});

            recipesQuery = recipesQuery.sort((recipeA, recipeB) => {
                var ratingA = ratingMap[recipeA._id.toString()] || 0;
                var ratingB = ratingMap[recipeB._id.toString()] || 0;
                return (order === 'asc' ? ratingA - ratingB : ratingB - ratingA);
            });
        } else {
            recipesQuery = recipesQuery.sort(sortCriteria);
        }

        var recipes = await recipesQuery
        .skip((page - 1) * recipesPerPage)
        .limit(recipesPerPage);

        var recipeIds = recipes.map(recipe => recipe._id);

        var ratings = await RatingModel.aggregate([
            {
                $match: { recipe: { $in: recipeIds } }
            },
            {
                $group: {
                    _id: '$recipe',
                    averageRating: { $avg: '$rating' }
                }
            }
        ]);

        var recipesWithRatings = recipes.map(recipe => {
            var rating = ratings.find(r => r._id.toString() === recipe._id.toString());
            return {
                ...recipe.toObject(),
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

module.exports = {
    saveRecipe,
    findRecipeById,
    findRecipes,
    deleteRecipe,
    updateRecipe,
    rateRecipe,
    deleteRating
}