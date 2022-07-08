const express = require("express");
const app = express();

const socket = require("socket.io");
var port = process.env.PORT || 3210;

const body = require("body-parser");
app.use(body.urlencoded({ extended: false }));

const js = require("ejs");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

let p1_name;
let user = [];

const ls_text = [
  "While I slipped into a coma, the hospital sent a priest and a social worker to comfort my parents. It was the same priest who had met with them a decade earlier on the evening they found out my sister had cancer.",
  `As day faded into night, a series of machines kept me alive. My parents slept restlessly on a hospital mattress one moment they would collapse from fatigue, the next they would be wide awake with worry. My mother would tell me later, "It was one of the worst nights I've ever had."`,
  `The following months were hard. It felt like everything in my life was on pause. I had double vision for weeks; I literally couldn't see straight. It took more than a month, but my eyeball did eventually return to its normal location. Between the seizures and my vision problems, it was eight months before I could drive a car again. At physical therapy, I practiced basic motor patterns like walking in a straight line. I was determined not to let my injury get me down, but there were more than a few moments when I felt depressed and overwhelmed.`,
  `Brailsford and his coaches began by making small adjustments you might expect from a professional cycling team. They redesigned the bike seats to make them more comfortable and rubbed alcohol on the tires for a better grip. They asked riders to wear electrically heated overshorts to maintain ideal muscle temperature while riding and used biofeedback sensors to monitor how each athlete responded to a particular workout. The team tested various fabrics in a wind tunnel and had their outdoor riders switch to indoor racing suits, which proved to be lighter and more aerodynamic.`,
  `That said, it doesn't matter how successful or unsuccessful you are right now. What matters is whether your habits are putting you on the path toward success. You should be far more concerned with your current trajectory than with your current results. If you're a millionaire but you spend more than you earn each month, then you're on a bad trajectory. If your spending habits don't change, it's not going to end well. Conversely, if you're broke, but you save a little bit every month, then you're on the path toward financial freedom even if you're moving slower than you'd like.`,
  `The backend creates a token for a user. You hand that token to the client side during login or registration. This token allows the client side to connect to the chat API for that user. Stream's permission system does the heavy work of determining which actions are valid for the user, so the backend just needs enough logic to provide a token to give the client side access to a specific user.`,
  `You'll have the ability to pick and choose products that you personally believe in, or even products from your favorite brands, so make sure that your campaigns center around truly valuable products that consumers will enjoy. You'll achieve an impressive conversion rate while simultaneously establishing the reliability of your personal brand.`,
];

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

const server = app.listen(3210, (e) => {
  if (!e) {
    console.log("Server connected to port 3210.....");
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
    // console.log(user);
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
