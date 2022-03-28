const socket = io();

const nickNameForm = document.querySelector("#nickname");
const welcome = document.querySelector("#welcome");
const roomEnterForm = welcome.querySelector("#roomEnter");
const room = document.querySelector("#room");
room.hidden = true;
const leaveBtn = room.querySelector("#leave");

let roomName;

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = nickNameForm.querySelector("input");
  const currnetNickname = nickNameForm.querySelector("h4");
  currnetNickname.innerText = `Your Nickname: ${input.value}`;
  socket.emit("nickname", input.value);
}

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function showRoom(newCount) {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room : ${roomName}`;
  const h4 = room.querySelector("h4");
  h4.innerText = `Number of people : ${newCount}`;
  const msgForm = room.querySelector("#msg");
  msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomEnterSubmit(event) {
  event.preventDefault();
  const input = roomEnterForm.querySelector("input");
  roomName = input.value;
  socket.emit("enter_room", input.value, showRoom);
  input.value = "";
}

function leaveRoom() {
  welcome.hidden = false;
  room.hidden = true;
}

function handleLeaveSubmit(event) {
  event.preventDefault();
  socket.emit("leave_room", roomName, leaveRoom);
}

nickNameForm.addEventListener("submit", handleNicknameSubmit);
roomEnterForm.addEventListener("submit", handleRoomEnterSubmit);
leaveBtn.addEventListener("click", handleLeaveSubmit);

socket.on("welcome", (nickName, newCount) => {
  const h4 = room.querySelector("h4");
  h4.innerText = `Number of people : ${newCount}`;
  addMessage(`${nickName} entered room !`);
});

socket.on("bye", (nickName, newCount) => {
  const h4 = room.querySelector("h4");
  h4.innerText = `Number of people : ${newCount}`;
  addMessage(`${nickName} left room !`);
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});
