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
app.use(require("./utils/reverse-proxy")("http://localhost:3000"))


app.use(function errorHandler(error, request, response, next) {
    console.error(error);
    return response.status(500).json(_.pick(error, ["name", "message", "error"]));
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
//const faker = require("faker");
//var apiUrl = "http://localhost:8000/api/v0";
//bluebird.resolve().then(() => {
//    return rp({
//        method: "POST",
//        uri: apiUrl + "/comments",
//        body: {
//            author: faker.name.findName(),
//            text: faker.lorem.sentences(),
//            email: faker.internet.exampleEmail(),
//            postId: faker.name.title().toLowerCase().replace(/ /g, "_"),
//        },
//        json: true
//    })
//        .then(response => {debug("response", response)})
//        .catch(error => {debug("error", error.error)})
//}).then(() => {
//
//    return rp({
//        method: "GET",
//        uri: apiUrl + "/comments"
//    })
//        .then(response => {debug("response", response)})
//        .catch(error => {debug("error", error.error)})
//
//})
