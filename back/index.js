const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

const config = require("./config/config")

const userRoutes = require("./controllers/user.controller")
const recipeRoutes = require("./controllers/recipe.controller")
const savedRecipeRoutes = require("./controllers/savedRecipe.controller")

const app = express()

app.use(bodyParser.json())
app.use("/auth", userRoutes)
app.use("/recipe", recipeRoutes)
app.use("/savedRecipe", savedRecipeRoutes)

mongoose.connect(config.dbConnection).then( () => {
    console.log("Db connection successful!")
    app.listen(3000, () => console.log("Server started!"))
}).catch(
    err => console.log(err)
)