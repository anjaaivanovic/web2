const UserModel = require("../models/user.model")
const RecipeModel = require("../models/recipe.model")
const HelperService = require("../services/helper.service")
var ObjectId = require('mongoose').Types.ObjectId;

var register = async function(email, firstName, lastName, password)
{
    try
    {
        return await UserModel.register(email, firstName, lastName, password)
    }
    catch(err) { throw err }
}

var getProfile = async function(id){
    try{
        if (ObjectId.isValid(id))
        {
            var user = await UserModel.findOne({ _id: id });
            if (!user) return undefined;

            const averageRating = await HelperService.totalAverage(id);
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

var findUserIdsByName = async function(search) {
    try{
        var query = {}
        if (search) {
            var splitSearch = search.split(" ");
            if (splitSearch.length != 2)
            {
                const regex = new RegExp('\\b' + search, 'i'); 
                query.$or = [
                    { firstName: { $regex: regex } },
                    { lastName: { $regex: regex } }
                ];
            }
            else{
                const regexFn = new RegExp('\\b' + search[0].trim(), 'i');
                const regexLn = new RegExp('\\b' + search[0].trim(), 'i'); 
                query.$or = [
                    { firstName: { $regex: regexFn } },
                    { lastName: { $regex: regexLn } }
                ];
            }
            
        }
        return (await UserModel.find(query)).map(x => x.id)
    }
    catch (err) { throw err; }
}

module.exports = {
    register,
    getProfile,
    deleteUser,
    updateUser,
    findUserIdsByName
}