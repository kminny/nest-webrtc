const socket = io('http://localhost:8000');

let currentRoom;

const statusButton = document.getElementById('status');
const onStatusButtonClick = () => {
  socket.emit('room_list');
};
statusButton.addEventListener('click', onStatusButtonClick);

socket.on('connect', () => {
  console.log('connected');

  socket.emit('events', {
    test: 'test',
  });
  socket.emit('identity', 0, (res) => {
    console.log('Identity: ', res);
  });

  socket.on('room_list', (res) => {
    console.log(res);
  });
  socket.on('join_room_response', (res) => {
    currentRoom = res;
    showRoom();
    alert(`${currentRoom} 방에 입장하였습니다.`);
  });
  socket.on('new_message', (res) => {
    console.log(res);
  });
  socket.on('events', (socket) => {
    console.log(socket);
  });
});

// Room
const room = document.getElementById('room');
const roomForm = room.querySelector('form');

const showRoom = () => {
  console.log('executed');
  const currentRoomText = document.getElementById('current-room');
  currentRoomText.innerText = currentRoom;
};

const onRoomFormSubmit = (e) => {
  e.preventDefault();
  const input = room.querySelector('input');
  socket.emit('join_room', input.value);
  input.value = '';
};
roomForm.addEventListener('submit', onRoomFormSubmit);

// Chat
const message = document.getElementById('message');
const messageForm = message.querySelector('form');
const chat = document.getElementById('chat');

const addMessage = (message) => {
  const ul = chat.querySelector('ul');
  const li = document.createElement('li');
  li.innerText = message;
  ul.appendChild(li);
};

const onMessageFormSubmit = (e) => {
  e.preventDefault();
  const input = message.querySelector('input');
  socket.emit('new_message', {
    roomName: currentRoom,
    nickname: 'kminny',
    message: input.value,
  });
  input.value = '';
};
messageForm.addEventListener('submit', onMessageFormSubmit);
