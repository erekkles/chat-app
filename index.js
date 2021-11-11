// const express = require('express');
const { userJoin, getUsers, verifyLogin, userLeave, getUserByUsername } = require('./utils/users');

// const app = express();
const express = require('express');
const app = express();
const http = require('http').Server(app);
const cors = require('cors');

/* Initialize socket.io server */
const io = require("socket.io")(http, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
const port = process.env.PORT || 3000;

app.use(cors({
    origin: '*'
}));

app.get('/', (req, res) => {
    res.send("Server up and running")
})

const botName = "SERVER"

io.on('connection', socket => {

    // Receive join event from client, then handle it.
    socket.on('join', data => {

        if(verifyLogin(data)) return socket.emit('taken', data);

        const user = userJoin({...data, id: socket.id});

        socket.broadcast.emit('sendMessage', { username: botName, message: `${data.username} se ha conectado!` });

        io.emit('getUsers', getUsers());
        
    });

    socket.on('typing', (username, status) => socket.broadcast.emit('showTypingStatus', username, status));
    socket.on('blur', status => socket.broadcast.emit('showTypingStatus', status))

    // Handle incoming message logic
    socket.on('message', data => socket.broadcast.emit('sendMessage', data));

    socket.on('privateMessage', (data) => {
        const receiver = getUserByUsername(data.receiverUsername);
        io.to(receiver.id).to(socket.id).emit('sendMessage', {username: `${data.senderUsername} (private)`, message: data.message})
    })

    // Handle user disconnection
    socket.on('disconnect', () => {
        const deletedUser = userLeave(socket.id)
        if(!deletedUser) return;

        io.emit('getUsers', getUsers());
        io.emit('sendMessage', { username: botName, message: `${deletedUser.username} se ha desconectado!` })
    })
    

})

http.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})