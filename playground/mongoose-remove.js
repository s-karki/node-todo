const {mongoose} = require("./../server/db/mongoose");
const {Todo} = require("./../server/models/todo");
const {User} = require("./../server/models/user");
const {ObjectID} = require("mongodb");


Todo.remove({}).then((res) =>{
    console.log(res);
}); //remove all data

//Todo.findOneAndRemove({}) remove first match and return it
Todo.findOneAndRemove({
    _id: "58890666aed5396fb22fb268"
});

//Todo.findByIdAndRemove remove first ID match and return it
Todo.findByIdAndRemove("58890666aed5396fb22fb268").then((res)=>{
    console.log(res);
});
