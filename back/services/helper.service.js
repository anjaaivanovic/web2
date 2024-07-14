const RecipeModel = require("../models/recipe.model")
const RatingModel = require("../models/rating.model")

function roundIfNeeded(num) {
    let numString = num.toString();
    let decimalIndex = numString.indexOf('.');
    if (decimalIndex !== -1 && numString.length - decimalIndex - 1 > 1) return parseFloat(num.toFixed(2));
    return num;
}

recipeAverage = async function calculateAverageRating(recipeId) {
    try {
        const ratings = await RatingModel.find({ recipe: recipeId });
        if (ratings.length === 0) {
            return 0;
        } else {
            const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
            const averageRating = totalRating / ratings.length;
            return roundIfNeeded(averageRating);
        }
    } catch (err) {
        throw err;
    }
}


totalAverage = async function calculateAverageRatingForUserRecipes(userId) {
    try {
        const recipes = await RecipeModel.find({ owner: userId }, '_id');

        if (recipes.length === 0) {
            return 0;
        } else {
            const recipeIds = recipes.map(recipe => recipe._id);
            const ratings = await RatingModel.find({ recipe: { $in: recipeIds } });

            if (ratings.length === 0) {
                return 0;
            } else {
                const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
                const averageRating = totalRating / ratings.length;
                return roundIfNeeded(averageRating);
            }
        }
    } catch (err) {
        throw err;
    }
}

var averageRatings = async function() {
    var avgs = await RatingModel.aggregate([
        {
            $group: {
                _id: '$recipe',
                averageRating: { $avg: '$rating' }
            }
        },
        {
            $project: {
                _id: '$_id', // Include a new field called id with the value of _id
                averageRating: 1 // Keep the averageRating field
            }
        }
    ]);

    return avgs;
}


module.exports = {
    recipeAverage,
    totalAverage,
    averageRatings
}