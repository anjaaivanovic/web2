const mongoose = require("mongoose")
const CommentModel = require("./comment.model");
const CategoryModel = require("./category.model");

var RecipeSchema = mongoose.Schema({
    title: {type:String, required: true},
    owner: {type: mongoose.Schema.Types.ObjectId, ref: "user", required: true},
    description: {type: String, required: true},
    image: {type: String},
    ingredients: [ {type: String}],
    steps: [ {type: String}],
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: "comment"}],
    categories: [{type: mongoose.Schema.Types.ObjectId, ref: "category", required: true}],
    prepTime: {type: Number, required: true},
    cookTime: {type: Number, required: true},
    servingSize: {type: Number, required: true}
})

RecipeSchema.index({ title: 1 });
RecipeSchema.index({ time: 1 });
RecipeSchema.index({ title: 'text'});
var RecipeModel = mongoose.model('recipe', RecipeSchema)

RecipeModel.saveRecipe = async function(recipe)
{
    var newRecipe = new RecipeModel(recipe)

    var result = await newRecipe.save()

    if (result) return true
    return false
}

RecipeModel.updateRecipe = async function(id, updatedRecipe) {
    try {
        var result = await RecipeModel.findByIdAndUpdate(id, updatedRecipe, { new: true });
        return result;
    } catch (err) {
        throw err;
    }
};

module.exports = RecipeModel