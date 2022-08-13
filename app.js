const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");

require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
//passing middleware
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
//static files
app.use(express.static("public"));
//templatine engine using handlebars
const handlebars = exphbs.create({ extname: ".hbs" });
app.engine(".hbs", handlebars.engine);
app.set("view engine", ".hbs");

const routes = require("./server/routes/user");
app.use("/", routes);
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
