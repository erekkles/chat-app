const socket = io('https://chat-socketio-test.herokuapp.com/');
        
const username = prompt("What's your nickname?");

// Emit join event to the server on connection, server will handle the login.
// Then, alert if user.username is taken. 
socket.emit('join', { username });
socket.on('taken', data => alert(`El id no está disponible o no es válido. Por favor elige otro.`))

let messages = document.querySelector('#messages');
let form = document.querySelector('#form');    
let input = document.querySelector('#input'); 
let active_users = document.querySelector('#active-users');
let typing_status = document.querySelector('#typing-status');

form.addEventListener('submit', e => {
    e.preventDefault();

    if (input.value) {

        let message = input.value;
        socket.emit('message', { username, message });
        input.value = "";

        printMessage({username, message});
    }

});

active_users.addEventListener('click', e => {
    e.stopImmediatePropagation();

    // Accepts as parameters: receiver's username, sender username and a message
    if(input.value) {
        socket.emit('privateMessage', {receiverUsername: e.target.textContent, senderUsername: username, message: input.value})
    }
})

input.addEventListener('focus', () => socket.emit('typing', username, 'focusEvent'));
input.addEventListener('blur', () => socket.emit('blur', 'blurEvent'));

socket.on('showTypingStatus', (username, status) => showTypingStatus(username, status));

socket.on('sendMessage', data => printMessage(data)); 

socket.on('getUsers', users => outputUsers(users));

/*
**** 
**** HELPER FUNCTIONS
****
*/

function showTypingStatus(username, status) {
    if(status === 'focusEvent') return typing_status.textContent = `${username} está escribiendo...`;
    typing_status.textContent = '';
}

function printMessage(data) {
    let item = document.createElement('li');
    item.textContent = `${data.username}: ${data.message}`;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
}

function outputUsers(users) {
    active_users.innerHTML = '';

    users.forEach(user => {

        const li = document.createElement('li');
        li.textContent = user.username;
        li.classList.add('user');

        active_users.appendChild(li);

    });
}
