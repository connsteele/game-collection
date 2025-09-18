const express = require("express");
const app = express();
const path = require("path");

// View Setup
app.use(express.urlencoded({extended: false}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routers
const indexRouter = require("./routes/indexRouter");

app.use("/", indexRouter);

const PORT = 3000;
app.listen(process.env.PORT, (error) => {
    if (error)
        throw error;
    console.log(`Server running on port ${process.env.PORT}`);
})