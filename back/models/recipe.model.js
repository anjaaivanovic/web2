const mongoose = require("mongoose")
const UserModel = require("./user.model")

var RecipeSchema = mongoose.Schema({
    title: {type:String, required: true},
    owner: {type: mongoose.Schema.Types.ObjectId, ref: "user", required: true},
    description: {type: String, required: true},
    image: {type: Blob},
    ingredients: [ {type: String}],
    steps: [ {type: String}],
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: "comment"}],
    categories: [{type: mongoose.Schema.Types.ObjectId, ref: "category", required: true}]
})

var RecipeModel = mongoose.model('recipe', RecipeSchema)

RecipeModel.saveRecipe = async function(recipe)
{
    var newRecipe = new RecipeModel(recipe)

    var result = await newRecipe.save()

    if (result)
    {
        var user = await UserModel.findById(result.owner)
        user.recipes.push(result._id)
        user.save()
        return true
    }
    return false
}

module.exports = RecipeModel