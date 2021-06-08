// Const setup

const express = require("express");
const e = require("express");
const path = require("path");
const fs = require("fs");
const uniqid = require('uniqid');

// Making the server const
const app = express();
// Const for port to let heroku create port or else 3000
const PORT = process.env.PORT || 3000;


// Setting up express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));


// Routes setup similar to starwars app
// Root
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "/public/index.html")));
// Notes
app.get("/notes", (req, res) => res.sendFile(path.join(__dirname, "/public/notes.html")));


// Function shows existing notes if there are any
app.get("/api/notes", (req, res) => {
    fs.readFile("db/db.json", (error, data) => {
        if (error) {
            console.error(error)
        } else {
            res.send(data);
        }
    })
})

// Function allows posting of new notes
app.post("/api/notes", (req, res) => {
    fs.readFile("db/db.json", (error, data) => {
        if (error) {
            console.error(error)
        } else {
            let notes = JSON.parse(data);
            console.log(notes);
            let newNote = req.body;
            newNote["id"] = uniqid();
            notes.push(newNote);
            fs.writeFile("db/db.json", JSON.stringify(notes), (err) =>
                err ? console.error(err) : console.log('New Note has been stored in database (db)'))
            res.json(newNote);
        }
    })
})


// Function deletes note
app.delete("/api/notes/:id", (req, res) => {
    fs.readFile("db/db.json", (error, data) => {
        if (error) {
            console.error(error);
        } else {
            let notes = JSON.parse(data);
            notes = notes.filter(e => e.id != req.params.id)
            fs.writeFile("db/db.json", JSON.stringify(notes), (err) =>
                err ? console.error(err) : console.log('Note has successfully been deleted!'))
            res.send({});
        }
    })
})


// Event listener for server
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));