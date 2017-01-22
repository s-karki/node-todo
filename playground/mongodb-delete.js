const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) =>{
    if(err){
        return console.log("Unable to connect to database");
    }
    console.log("Connected to database server");

    //deleteMany
    // db.collection("Todos").deleteMany({text: "eat dinner"}).then((res) =>{
    //     console.log(res);
    // });

    // //deleteOne (deletes first item it sees that meets the criteria)
    // // db.collection("Todos").deleteOne({text: "phone mum"}).then((res) => {
    // //     console.log(res);
    // // });

    // //findOneAndDelete --> returns deleted document (value parameter)
    // db.collection("Todos").findOneAndDelete({completed: "false"}).then((res)=>{
    //     console.log(res);
    // });


    // db.collection("Users").findOneAndDelete({_id: new ObjectID("5883fc21d4b77159399d286f")})
    // .then((res) => {
    //     console.log(res);
    // });

    db.collection("Users").deleteMany({name: "Saharsha"}).then((res) => {
        console.log(res);
    });

    //db.close()
});