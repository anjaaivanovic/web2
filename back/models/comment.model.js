const mongoose = require("mongoose")

var CommentSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "user", required: true},
    recipe: {type: mongoose.Schema.Types.ObjectId, ref: "recipe", required: true},
    text: {type: String, required: true},
    parent: {type: mongoose.Schema.Types.ObjectId, ref: "comment"},
    children: [{type: mongoose.Schema.Types.ObjectId, ref: "comment"}]
})

var CommentModel = mongoose.model("comment", CommentSchema)

CommentModel.saveComment = async function(comment)
{
    var newComment = new CommentModel(comment)
    var res = await newComment.save()

    if (newComment.parent) 
    {
        parent.children.push(newComment._id)
        res = await newComment.save()
    }

    if (res) return newComment;
    else return null;
}
module.exports = CommentModel