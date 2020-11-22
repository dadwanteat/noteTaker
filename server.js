const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

let id = 0;

function readJSON(){
    let dbData = fs.readFileSync(path.join(__dirname, "/db/db.json"), "utf8");
    return JSON.parse(dbData);
};

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function (req, res) {
    res.json(readJSON());
});

app.post("/api/notes", function (req, res) {
    let dbData = readJSON();
    let addNote = {
        title: req.body.title,
        text: req.body.text,
        id: Math.floor(Math.random()*100)
    };
    dbData.push(addNote);
    fs.writeFileSync(path.join(__dirname, "/db/db.json"), JSON.stringify(dbData, null, 2));
    res.send("Success!");
});

app.delete("/api/notes/:id", function (req, res){
    let dbData = readJSON();
    let dataArray = dbData.filter(function(note){
        return note.id != req.params.id;
    });
    fs.writeFileSync(path.join(__dirname, "/db/db.json"), JSON.stringify(dataArray, null, 2));
    res.send("Success!");
});

app.listen(PORT, function () {
    console.log("Listening on port " + PORT);
});