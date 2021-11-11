const users = [];

// Verify if user id is already taken or invalid
function verifyLogin(data) {
    // if true, the id is either taken or invalid
    // if false, the id is both valid and available.

    if(data.username === '' || data.username === null) return true;

    if(users.length === 0) return false;

    return users.some(activeUser => activeUser.username === data.username)

}

// Add a user to the array of current online users
function userJoin(user) {
    users.push(user);
    return user;
}

// Handle user leaving
function userLeave(id) {
    if(users.length) {
        const index = users.findIndex(user => user.id === id);
        const deletedUser = users[index];

        if(index === -1) return false;
    
        users.splice(index, 1);
        return deletedUser;
    }
    
    return false;
}

// Retrieve array of current online users
function getUsers() {
    return users;
}

// Get full user object just by username
function getUserByUsername(username) {  
    return users.filter(user => user.username === username)[0];
}

module.exports = {
    userJoin,
    getUsers,
    verifyLogin,
    userLeave,
    getUserByUsername
}