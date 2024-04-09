const CommentModel = require("../models/comment.model")
var ObjectId = require('mongoose').Types.ObjectId;

var saveComment = async function(comment)
{
    try{
        return await CommentModel.saveComment(comment)
    }
    catch (err) { throw err }
}

var deleteComment = async function(id){
    try{
        if (ObjectId.isValid(id))
        {
            var deletedCount = (await CommentModel.deleteOne({_id: id})).deletedCount
            return deletedCount > 0
        }
        return false
    }
    catch (err){ throw err }
}

module.exports ={
    saveComment,
    deleteComment
}
