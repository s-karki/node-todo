 
require("./config/config.js");
const _ =  require("lodash");
const bodyParser = require("body-parser");
const express = require("express");
const bcrypt = require("bcryptjs");

var {mongoose} = require("./db/mongoose");
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {ObjectID} = require("mongodb");
var {authenticate} = require("./middleware/authenticate");

var app = express();
const port = process.env.PORT || 3000; //for heroku 

app.use(bodyParser.json()); //can send json to express app


app.post("/todos", authenticate, (req, res) =>{
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    }); 

//save to the database 
    todo.save().then((doc) =>{
        res.send(doc);
    }, (err) =>{
        res.status(400).send(err);
    });

});

app.get("/todos", authenticate, (req, res)=>{
    Todo.find({
        _creator: req.user._id
    }).then((todos)=>{
        res.send({todos}); //retrieves the array from the database
    }, (err) =>{
        res.status(400).send(e);
    });
});



app.get("/todos/:id", authenticate, (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        res.status(404).send();
        return 
    }
    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => { //query database
        if(!todo){
            res.status(404).send(); //failure case 
            //console.log("Unable to find todo");
            return 
        }
        res.status(200).send({todo}); //success case (better to write as an object)
    }, (e) => { //error 
        res.status(400).send();
        console.log("Bad request", e);
    });

});

app.delete("/todos/:id", authenticate, (req, res) =>{
    //get the id
    var id = req.params.id;
    //validate the id --> invalid returns 404 
    if(!ObjectID.isValid(id)){
        return res.status(404).send(); 
    }

    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((todo) =>{
        if(!todo){
            return res.status(404).send();
        }
        res.status(200).send({todo});

    }).catch((e)=>{
        res.status(400).send();
    });
 
});

//HTTP PATCH Method to UPDATE a resource 
app.patch("/todos/:id", authenticate, (req, res)=>{
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']); //users only update text and completed

    if(!ObjectID.isValid(id)){
        return res.status(404).send(); 
    }

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false; 
        body.completedAt = null; //remove from database
    }



    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {$set: body}, {new: true}).then((todo) =>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    });

});


//public route for signup 
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user); //HTTP response header
  }).catch((e) => {
    res.status(400).send(e);
  })
});

//get route for a specific user
app.get("/users/me", authenticate, (req, res) => {
    res.send(req.user); 
});

//POST users/login/ {email, password}
app.post("/users/login", (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user)=>{
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user); 
        });
    }).catch((e) => {
        res.status(400).send();
    });
});

app.delete("/users/me/token", authenticate, (req, res) => {
    req.user.removeToken(req.token)
    .then(() => {
        res.status(200).send()
    }, () => {
        res.status(400);
    });
});

app.listen(port, ()=>{
    console.log(`Started on port  ${port}`);
});


module.exports.app = app; 




