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
const deleteRouter = require("./routes/deleteRouter");

app.use("/", indexRouter);
app.use("/new", newRouter);
app.use("/update", updateRouter);
app.use("/delete", deleteRouter);

const PORT = 3000;
app.listen(PORT, (error) => {
    if (error)
        throw error;
    console.log(`Server running on port ${PORT}`);
})