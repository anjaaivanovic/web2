const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors = require('cors');
const path = require('path')

const config = require("./config/config")

const userRoutes = require("./controllers/user.controller")
const recipeRoutes = require("./controllers/recipe.controller")
const savedRecipeRoutes = require("./controllers/savedRecipe.controller")
const categoryRoutes = require("./controllers/category.controller")
const commentRoutes = require("./controllers/comment.controller")

const swaggerJSDoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

const app = express()

const corsOptions = {
  origin: ["http://localhost:4200", "http://localhost:8000", "http://localhost:8080"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));  

app.use(bodyParser.json())
app.use("/auth", userRoutes)
app.use("/recipe", recipeRoutes)
app.use("/savedRecipe", savedRecipeRoutes)
app.use("/category", categoryRoutes)
app.use("/comment", commentRoutes)
app.use('/images', express.static(path.join(__dirname, 'data', 'images')));

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "Recipes API",
            description: "Recipes API description"
        },
        servers: ["http://localhost:3000"]
    },
    apis: ["./controllers/*.js"]
}

const swaggerDocs = swaggerJSDoc(swaggerOptions)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use('/front', express.static(path.join(__dirname, 'front')));

mongoose.connect(config.dbConnection).then( () => {
    console.log("Db connection successful!")
    app.listen(3000, () => console.log("Server started!"))
}).catch(
    err => console.log(err)
)