const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

const port = 3000;

app.use((req, res, next) => {
  next();
});

app.get("/", (req, res) => {
  // console.log("In '/' route");
  fs.readdir(`./files`, (req, files) => {
    console.log(files.length);
    res.render("index", { files: files });
  });
});

app.get("/about/:username", (req, res) => {
  res.send(`welcome, ${req.params.username}`);
});

app.post("/create", (req, res) => {
  console.log(req.body);

  fs.writeFile(
    `./files/${req.body.title.split(" ").join("")}.txt`,
    req.body.data,
    () => {
      res.redirect("./");
    }
  );
});

app.get("/files/:filename", (req, res) => {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.render("show", { filename: req.params.filename, data: data });
    }
  });
});
app.get("/edit/:filename", (req, res) => {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.render("edit", { filename: req.params.filename, data: data });
    }
  });
});
app.post("/edit", (req, res) => {

  console.log(req.body)
  fs.rename(`files/${req.body.previous}`, `files/${req.body.new}`, (err) => {
    res.redirect("./");
  });
});

app.get("/about/:username/:age", (req, res) => {
  res.send(`welcome, ${req.params.username} your age is ${req.params.age}`);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
