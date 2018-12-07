const _ = require("lodash");
const path = require("path");
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

app.use(function requestLogger(request, response, next) {
    console.log(request.method, request.path);
    return next();
})

//app.use(express.static("public"));


app.use("/api/v0", require("./routes"));


// temporarily forward all unhandled requests to the react server for faster development
app.use(function(request, response, next) {
    console.log("request", request);
    var forwardedServerUrl = "http://localhost:3000" + request.originalUrl;
    console.log("forwardedServerUrl", forwardedServerUrl);
    var rpOptions = {
        method: request.method,
        uri: forwardedServerUrl,
        body: request.body,
        json: true
    };
    console.log("rpOptions", rpOptions);
    rp(rpOptions)
        .then(body => {
            console.log("got body", body);
            response.send(body);
        })
    .catch(next);
})


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
    uri: "http://localhost:8000/api/v0/comments",
    body: {
        author: faker.name.findName(),
        text: faker.lorem.sentences(),
        email: faker.internet.exampleEmail(),
        postId: faker.name.title().toLowerCase().replace(/ /g, "_"),
    },
    json: true
})
    .then(response => {debug("response", response)})
    .catch(error => {debug("error", error.error)})

rp({
    method: "GET",
    uri: "http://localhost:8000/api/v0/comments"
})
    .then(response => {debug("response", response)})
    .catch(error => {debug("error", error.error)})

