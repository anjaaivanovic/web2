const mongoose = require("mongoose")

var SavedRecipeSchema = mongoose.Schema({
    recipeId: { type: mongoose.Schema.Types.ObjectId, ref: "recipe", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }
})

SavedRecipeSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

var SavedRecipeModel = mongoose.model("savedRecipe", SavedRecipeSchema)

SavedRecipeModel.saveRecipe = async function(savedRecipe)
{
    var newsavedRecipe = new SavedRecipeModel(savedRecipe)
    var res = await newsavedRecipe.save()

    if (res) return newsavedRecipe;
    else return null;
}
module.exports = SavedRecipeModel