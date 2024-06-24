const CategoryModel = require("../models/category.model")
var ObjectId = require('mongoose').Types.ObjectId;

var saveCategory = async function(category){
    try{
        return await CategoryModel.saveCategory(category)
    }catch (err){

    }
}

var deleteCategory = async function(id){
    try{
        if (ObjectId.isValid(id))
        {
            var deletedCount = (await CategoryModel.deleteOne({_id: id})).deletedCount
            return deletedCount > 0
        }
        return false
    }
    catch (err){ throw err }
}


var getCategories = async function()
{
    try{
        return await CategoryModel.find();    
    }
    catch (err) { throw err }
}

module.exports ={
    saveCategory,
    deleteCategory,
    getCategories
}