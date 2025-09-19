const express = require("express");
const app = express();
const path = require("path");

// View Setup
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "styles"))); // For css
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routers
const indexRouter = require("./routes/indexRouter");
const newRouter = require("./routes/newRouter");
const updateRouter = require("./routes/updateRouter");

app.use("/", indexRouter);
app.use("/new", newRouter);
app.use("/update", updateRouter);

const PORT = 3000;
app.listen(PORT, (error) => {
    if (error)
        throw error;
    console.log(`Server running on port ${PORT}`);
})