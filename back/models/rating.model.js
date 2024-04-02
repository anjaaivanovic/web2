const mongoose = require("mongoose")

var RatingSchema = mongoose.Schema({
    recipe: {type: mongoose.Schema.Types.ObjectId, ref: "recipe"},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
    rating: {type: Number}
})

var RatingModel = mongoose.model("rating", RatingSchema)

RatingModel.saveRating = async function(rating)
{
    var newRating = new RatingModel(rating)
    var res = await newRating.save()

    if (res) return newRating;
    else return null;
}
module.exports = RatingModel