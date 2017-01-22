const {MongoClient, ObjectID} = require("mongodb");


MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db)=>{

    if(err){
        return console.log("Unable to connect to database server")
    } 
    console.log("successful connection to MongoDB server");

//query in find() call with key-value pairs
    db.collection("Todos").find({_id: new ObjectID("588404e3ce7310a7d397382f")}).toArray().then((docs) =>{ 
        console.log("Todos");
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log("Unable to print from todos database");
    });


    //count (number of documents)
   db.collection("Todos").find().count().then((count) =>{ 
        console.log(`Todos: ${count}`);
    }, (err) => {
        console.log("Unable to print from todos database");
    });

   db.collection("Users").find({name: "Saharsha"}).toArray().then((res) =>{
    console.log("users with name Saharsha");
    console.log(JSON.stringify(res, undefined, 2))
   }, (err) =>{
    if(err){
        console.log("Unable to retrieve items", err);
    }
   });

db.close();

});

