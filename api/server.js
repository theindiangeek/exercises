const dotenv = require('dotenv');
const dotenvParseVariables = require('dotenv-parse-variables');
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const config = dotenv.config({})
if (config.error) throw config.error;
global.env = dotenvParseVariables(config.parsed);

app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
db.sequelize.sync();

require("./app/routes/movies")(app);

// set port, listen for requests
const PORT = env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});