const {mongoose} = require("./../server/db/mongoose");
const {Todo} = require("./../server/models/todo");
const {User} = require("./../server/models/user");
const {ObjectID} = require("mongodb");



var id = "5887b2fda95184050ecdc811";


if(!ObjectID.isValid(id)){
    console.log("ID not valid");
}//method in mongodb to validate ID (helps with error handling )

//query mongo and handle errors (i.e. ID not found in database)



// Todo.find({
//     _id: id //automatically convert to ObjectID
// }).then((todos) => {
//     if(todos.length === 0){
//         return console.log("ID not found");
//     }
//     console.log("Todo find all with id: ", todos);
// }); //find all results

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     if(!todo){
//         return console.log("ID not found");
//     }
//     console.log("Todo find one with id: ", todo);
// });//find one

// Todo.findById(id).then((todo) =>{
//     if(!todo){
//         return console.log("ID not found");
//     }
//    console.log("Todo find one with id (slighly better): ", todo); 
// }).catch((e) => { //check for invalid ID 
//     console.log(e);
// }); //find one by ID


//In users:
//I.   User not found
//II.  User was found, print to screen
//III. Print errors 
id = "5887ba511b6383a651efdff3";

User.findById(id).then((user) => {
    if(!user){
        return console.log("Unable to find user");
    }
    console.log("Found User: ", JSON.stringify(user, undefined, 2));
}).catch((e) => console.log(e));


