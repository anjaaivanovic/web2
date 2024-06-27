const UserModel = require("../models/user.model")
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
        return await UserModel.findOne({_id: id});
    else
        return undefined;

    }
    catch (err) { throw err }
}

module.exports = {
    register,
    getProfile
}