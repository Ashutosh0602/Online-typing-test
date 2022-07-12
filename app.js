const express = require("express");
const app = express();
const typeUser = require("./schema");
const ls_text = require("./textpara");
const mongoose = require("mongoose");

const socket = require("socket.io");
var port = process.env.PORT || 3210;

const body = require("body-parser");
app.use(body.urlencoded({ extended: false }));

const js = require("ejs");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

mongoose
  .connect(
    "mongodb+srv://natours:12345qwerty@cluster0.kylf9c1.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
    }
  )
  .then((con) => {
    // console.log(con.connections);
    console.log("database connected successfully");
  });

let p1_name;
let user = [];

function rd_text() {
  return Math.floor(Math.random() * ls_text.length);
}
const h1 = "hello how are you";
app.get("/", (req, res) => {
  //   res.send(`${ls_text[rd_text()]}`);
  res.render("home", { para: ls_text[rd_text()] });
});

app.post("/create", (req, res) => {
  res.render("create", { para: ls_text[rd_text()], name: p1_name });
});

const server = app.listen(port, (e) => {
  if (!e) {
    console.log(`Server connected to port ${port}.....`);
  } else {
    console.log(e);
  }
});

function emit() {
  return "world Connected";
}

const io = socket(server);
io.on("connection", (socket) => {
  socket.on("user", (Name) => {
    user.push({ name: Name, id: socket.id });
    socket.emit("active", user);
    socket.local.emit("active", user);
    typeUser.find().then((d) => {
      socket.emit("findUser", d);
    });
  });

  socket.on("dataInsert", (data) => {
    typeUser.insertMany({ user: `${data[0]}`, speed: data[1] }).then((e) => {
      return;
    });
    console.log(data);
  });
  socket.on("disconnect", () => {
    user.forEach((usr) => {
      if (usr.id === socket.id) {
        console.log(usr.name, "disconnected");
        user.splice(user.indexOf(usr), 1);
      }
    });
    socket.local.emit("active", user);
  });
});
