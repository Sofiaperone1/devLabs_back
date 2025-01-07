import express from "express"
import sequelize from './api/database.js'; 

const app = express();

app.use (express.json())

sequelize.authenticate();

app.get ( "/" , (req,res) => {
    res.status(200).json({
        message:"Hello World"
    })
})

app.listen(4000, () => {
    console.log("server running")
})

export default app;