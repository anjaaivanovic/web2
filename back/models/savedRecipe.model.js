const mongoose = require("mongoose")

var SavedRecipeSchema = mongoose.Schema({
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: "recipe", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }
})


var SavedRecipeModel = mongoose.model("savedRecipe", SavedRecipeSchema)

SavedRecipeModel.saveComment = async function(savedRecipe)
{
    var newsavedRecipe = new SavedRecipeModel(savedRecipe)
    var res = await savedRecipe.save()

    if (res) return newsavedRecipe;
    else return null;
}
module.exports = SavedRecipeModel