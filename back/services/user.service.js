const UserModel = require("../models/user.model")
const RecipeModel = require("../models/recipe.model")
const RatingModel = require("../models/rating.model")
var ObjectId = require('mongoose').Types.ObjectId;

var register = async function(email, firstName, lastName, password)
{
    try
    {
        return await UserModel.register(email, firstName, lastName, password)
    }
    catch(err) { throw err }
}

async function calculateAverageRatingForUserRecipes(userId) {
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
                // Calculate average rating
                const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
                const averageRating = totalRating / ratings.length;
                return averageRating;
            }
        }
    } catch (err) {
        throw err;
    }
}

var getProfile = async function(id){
    try{
        if (ObjectId.isValid(id))
        {
            var user = await UserModel.findOne({ _id: id });
            if (!user) return undefined;

            const averageRating = await calculateAverageRatingForUserRecipes(id);
            const totalRecipeCount = await RecipeModel.countDocuments({ owner: id });

            user = user.toObject();
            user.averageRating = averageRating;
            user.totalRecipeCount = totalRecipeCount;

            return user;
        }
    else
        return undefined;

    }
    catch (err) { throw err }
}

var deleteUser = async function(id){
    try{
        if (ObjectId.isValid(id))
        {
            var deletedCount = (await UserModel.deleteOne({_id: id})).deletedCount
            return deletedCount > 0
        }
        return false
    }
    catch (err){ throw err }
}

var updateUser = async function(id, updatedUser) {
    try {
        return await UserModel.updateUser(id, updatedUser);
    } catch (err) {
        throw err;
    }
};

module.exports = {
    register,
    getProfile,
    deleteUser,
    updateUser
}