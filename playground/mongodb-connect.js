//const MongoClient = require("mongodb").MongoClient;
const {MongoClient, ObjectID} = require("mongodb");



MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
    if(err){
        return console.log("Unable to connect to database server")
    } 
    console.log("successful connection to MongoDB server");

    // db.collection("Todos").insertOne({
    //     text: "Eat better",
    //     completed: "false"
    // }, (err, result)=>{
    //     if(err){
    //         return console.log("Unable to insert Todo", err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

   // db.collection("Users").insertOne({
   //  name: "Saharsha",
   //  age: "20",
   //  location: "01002"
   // }, (err, result) =>{
   //  if(err){
   //      return console.log("Unable to insert user", err);
   //  }
   //  console.log(JSON.stringify(result.ops, undefined, 2));
   //  console.log(result.ops[0]._id.getTimestamp());
   // });

db.close();

});