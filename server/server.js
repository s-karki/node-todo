var bodyParser = require("body-parser");
var express = require("express");

var {mongoose} = require("./db/mongoose");
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {ObjectID} = require("mongodb");

var app = express();

app.use(bodyParser.json()); //can send json to express app


app.post("/todos", (req, res) =>{
    var todo = new Todo({
        text: req.body.text
    }); //call a sort of ctor with an object that has req's body

//save to the database 
    todo.save().then((doc) =>{
        res.send(doc);
    }, (err) =>{
        res.status(400).send(err);
    });

});

app.get("/todos", (req, res)=>{
    Todo.find().then((todos)=>{
        res.send({todos});
    }, (err) =>{
        res.status(400).send(e); //bad request
    });
});



app.get("/todos/:id", (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)){ //validate object
        res.status(404).send();
        return console.log("Invalid ID");
    }

    Todo.findById(id).then((todo) => { //query database
        if(!todo){
            res.status(404).send(); //failure case 
            return console.log("Unable to find todo");
        }
        res.status(200).send({todo}); //success case (better to write as an object)
    }, (e) => { //error 
        res.status(400).send();
        console.log("Bad request", e);
    });

});

app.listen(3000, ()=>{
    console.log("Started on port 3000");
});


module.exports.app = app; 




// var newTodo = new Todo({
//     text: "Read book"
// }); //akin to a constructor 

// newTodo.save().then((res) =>{
//     console.log("saved todo", res);
// }, (err) =>{
//     console.log("Unable to save Todo");
// });


// var newTask = new Todo({
//     text: "   Sampling.    "
// });

// newTask.save().then((res)=>{
//     console.log("save todo", res);
// }, (err)=>{
//     console.log("unable to save todo", err);
// });



// var newUser = new User({
//     email: "bbt@gmail.com"
// });

// newUser.save().then((res)=>{
//     console.log("Saved user ", res);
// }, (err) => {
//     console.log("Could not save user ", err);
// });




