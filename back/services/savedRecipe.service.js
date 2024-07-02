const SavedRecipeModel = require("../models/savedRecipe.model")
const RecipeModel = require("../models/recipe.model")
const RatingModel = require("../models/rating.model")
var ObjectId = require('mongoose').Types.ObjectId;

const recipesPerPage = 3

async function findSavedRecipes(userId, page = 1, categories = [], search = '', prepTime, cookTime, servingSize, sort = 'title', order = 'asc') {
    try {
        if (ObjectId.isValid(userId)) {
            var savedRecipes = await SavedRecipeModel.find({ userId: userId });
            var recipeIds = savedRecipes.map(item => item.recipeId);

            var query = { _id: { $in: recipeIds } };

            if (categories.length > 0) query.categories = { $in: categories };
            if (search) {
                const regex = new RegExp('\\b' + search, 'i'); 
                query.$or = [
                    { title: { $regex: regex } },
                    { description: { $regex: regex } }
                ];
            }
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
        }
    } catch (err) {
        throw err;
    }
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