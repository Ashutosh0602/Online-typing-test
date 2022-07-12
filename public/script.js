let y_name = prompt("Write your name");

let reply_name = false;
while (!reply_name) {
  if (y_name === null) {
    y_name = prompt("Write your name");
  } else {
    reply_name = true;
  }
}

let ls = document.getElementsByClassName("main_para")[0].innerText;
let txt = document.getElementsByClassName("main_para")[0];

const spanLength = "<span class='black'>x</span>".length;
let ls_item = 0;

document.addEventListener("keydown", (e) => {
  if (e.key == ls[ls_item]) {
    let oldText = txt.innerHTML;
    txt.innerHTML =
      oldText.slice(0, ls_item * spanLength) +
      `<span class='black'>${oldText[ls_item * spanLength]}</span>` +
      oldText.slice(ls_item * spanLength + 1);
    ls_item++;
  }
});

let total_entries = 0;
let time_s = 0;
let currentIndex = 0;
let in_word = 0;
let correct_word = 0;
let stop = 0;
let final_time;
let re_in_list = [];

function time() {
  setInterval(() => {
    time_s++;
    return;
  }, 1000);
}

document.addEventListener("keydown", (e) => {
  if (e.key === ls[0]) {
    if (stop === 1) {
      return;
    }
    time();
    stop++;
  }
});

document.addEventListener("keydown", (e) => {
  if (ls[currentIndex] === e.key) {
    total_entries++;
    console.log(ls[currentIndex]);
    currentIndex++;
    if (currentIndex === ls.length) {
      final_time = time_s;
      console.log(final_time);
      console.log(`total incorrect words:${in_word}`);
      const net_word = (total_entries / 5 - in_word) / (final_time / 60);
      if (net_word > 0) {
        let data = [y_name, net_word.toFixed(2)];
        socket.emit("dataInsert", data);
        document.getElementsByClassName("scoreNWP")[0].innerText =
          net_word.toFixed(2);
        document.getElementsByClassName("name_results_name")[0].innerText =
          y_name;
        document.getElementsByClassName("name_results_score")[0].innerText =
          net_word.toFixed(2);
        document.getElementsByClassName("score")[0].style.display = "flex";
      } else {
        net_word = 0;
        document.getElementsByClassName("scoreNWP")[0].innerText = net_word;
        document.getElementsByClassName("score")[0].style.display = "flex";
      }
    }
  } else if (
    e.code !== "ShiftRight" &&
    e.code !== "ShiftLeft" &&
    e.code !== "MetaLeft" &&
    e.code !== "MetaRight" &&
    e.code !== "AltRight" &&
    e.code !== "AltLeft" &&
    e.code !== "ControlLeft" &&
    e.code !== "ArrowDown" &&
    e.code !== "ArrowUp" &&
    e.code !== "ArrowLeft" &&
    e.code !== "ArrowRight" &&
    e.code !== "Tab" &&
    e.code !== "Space" &&
    e.code !== "CapsLock" &&
    e.code !== "Backspace"
  ) {
    total_entries++;
    if (e.key === re_in_list[0]) {
    } else {
      in_word++;
    }
    re_in_list[0] = e.key;
  }
});

const ins_elem = document.getElementsByClassName("new_event")[0];
const ins_elem_node = ins_elem.children[0].classList[0];

const socket = io.connect("http://localhost:3210");

socket.emit("user", y_name);

socket.on("findUser", (rank) => {
  for (let i = 0; i < rank.length; i++) {
    let elem = document.createElement("p");
    elem.innerText = rank[i].user;
    elem.classList.add("rankUser");
    document.getElementsByClassName("player_leader")[0].appendChild(elem);
  }
  console.log(rank);
});

socket.on("active", (user) => {
  if (ins_elem.childElementCount > 0) {
    for (let i = 0; i < ins_elem.childElementCount; i++) {
      document.getElementsByClassName(`${ins_elem_node}`)[i].innerText = "";
    }
  }
  for (let i = 0; i < user.length; i++) {
    let new_in_elm = document.createElement("p");
    new_in_elm.innerText = user[i].name;
    new_in_elm.classList.add("new_event_p");
    ins_elem.appendChild(new_in_elm);
  }
});
