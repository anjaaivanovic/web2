const UserModel = require("../models/user.model")

var register = async function(email, firstName, lastName, password)
{
    try
    {
        return await UserModel.register(email, firstName, lastName, password)
    }
    catch(err) { throw err }
}

module.exports = {
    register
}