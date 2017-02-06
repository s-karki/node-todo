const {Todo} = require("./../models/todo");
const {ObjectID} = require("mongodb");
const {User} = require("./../models/user");
const jwt = require("jsonwebtoken");

const userOneID = new ObjectID();
const userTwoID = new ObjectID();

const users = [{
    _id: userOneID,
    email: "ex1@example.com",
    password: "useronepass",
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneID, access: 'auth'}, 'abc123').toString()
    }]
}, {
    _id: userTwoID,
    email: "ex2@example.com",
    password: "usertwopass"
}];

const todos = [{
    _id: new ObjectID(),
    text: "First test todo"
}, {
    _id: new ObjectID(),
    text: "second test todo",
    completed: true,
    completedAt: 15000
}, {
    _id: new ObjectID(),
    text: "third test todo"
}];


const populateTodos = (done) => {
    Todo.remove({}).then(()=>{
        Todo.insertMany(todos); //insert dummy vbls into database for testing
    }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(()=>{
        var userOne = new User(users[0]).save(); //different methods, two test users 
        var userTwo = new User(users[1]).save(); //with and without authentication

        //handles an array of promises
        //callback is invoked when all promises in the array resolve
        
        return Promise.all([userOne, userTwo])
    }).then(() => (done()));
};
module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
};