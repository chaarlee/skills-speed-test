"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var body_parser_1 = require("body-parser");
var cookie_parser_1 = require("cookie-parser");
var dotenv_1 = require("dotenv");
var path_1 = require("path");
dotenv_1.default.config();
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(function (req, res, next) {
    var secret = req.headers["sst-secret"];
    if (secret) {
        // @TODO handle typescript error
        // req.secret = secret;
    }
    next();
});
var DBSpeedTest = require("./lib/db-speedTest.ts").DBSpeedTest;
var DB = new DBSpeedTest(path_1.default.join(__dirname, "db/"));
app.get("/", function (req, res) {
    res.send("Express + TypeScript Server");
});
app.get("/health", function (req, res) {
    res.send("Server is running");
});
app.get("/ping", function (req, res) {
    res.send("pong");
});
app.post("/login", function (req, res) {
    var secret = req.body.secret;
    var competitor = DB.getCompetitorBySecret(secret);
    if (!competitor) {
        res.status(401).send("Invalid secret");
        return;
    }
    res.send("OK");
});
app.get("/competitor", function (req, res) {
    var secret = req.headers["sst-secret"];
    // const secret = req.secret;
    var competitor = DB.getCompetitorBySecret(secret);
    // console.log("competitor", competitor);
    if (!competitor) {
        res.status(401).send("Invalid secret");
        return;
    }
    res.json(competitor);
});
app.get("/tasksWithResult", function (req, res) {
    var secret = req.headers["sst-secret"];
    res.json(DB.getTasksWithResult(secret));
});
app.post("/submitSubmission", function (req, res) {
    var secret = req.headers["sst-secret"];
    var competitor = DB.getCompetitorBySecret(secret);
    if (!competitor) {
        res.status(401).send("Invalid secret");
        return;
    }
    var taskId = req.body.taskId;
    var submittedSolution = req.body.submittedSolution;
    var submission = DB.submitSubmission(competitor.id, taskId, submittedSolution);
    res.json(submission);
});
var PORT = process.env.PORT || 5432;
app.listen(PORT, function () {
    console.log("[server]: Server is running at http://localhost:".concat(PORT));
});
