const _ = require("lodash");
const bluebird = require("bluebird");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const express = require("express");
const rp = require("request-promise");
const sqlite = require("sqlite");


const dbPromise = sqlite.open('./database.sqlite', {Promise: bluebird});

dotenv.config();
const debug = require("debug")(__filename);

console.clear();


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

require("./routes")(app);


app.use(function errorHandler(error, request, response, next) {
    console.error("error", _.pick(error, ["name", "message", "error"]));
    return response.json(_.pick(error, ["name", "message", "error"]));
})


var PORT = 8000
app.listen(PORT, function() {
    console.log("Server started at http://localhost:" + PORT);
})


process.on("uncaughtException", error => {
    console.error(error);
    process.exit(1); // not optional
});

// test the endpoint
const faker = require("faker");
rp({
    method: "POST",
    uri: "http://localhost:8000/comment",
    body: {
        name: faker.name.findName(),
        text: faker.lorem.sentences(),
        postId: faker.name.title().toLowerCase().replace(/ /g, "_"),
    },
    json: true
})
    .then(response => {debug("response", response)})
    .catch(error => {debug("error", error.error)})

rp({method: "GET", uri: "http://localhost:8000/comment"})
    .then(response => {debug("response", response)})
    .catch(error => {debug("error", error.error)})

