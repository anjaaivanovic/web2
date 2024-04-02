const mongoose = require("mongoose")

var CategorySchema = mongoose.Schema({
    name: {type: String}
})

var CategoryModel = mongoose.model("category", CategorySchema)

CategoryModel.saveCategory = async function(category)
{
    var newCategory = new CategoryModel(category)
    var res = await newCategory.save()

    if (res) return newCategory;
    else return null;
}
module.exports = CategoryModel