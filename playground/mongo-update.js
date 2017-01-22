const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) =>{
    if(err){
        return console.log("Unable to connect to database");
    }
    console.log("Connected to database server");

db.collection("Todos").findOneAndUpdate({_id: new ObjectID("58852910ce7310a7d3974661")}, 
    {
        $set: { //update operators (mongodb docs)
            completed: true
        }
    }, {
        returnOriginal: false //do not want to return original/old document
    }
).then((res) => {
    console.log(res);
});

db.collection("Users").findOneAndUpdate({name: "Saharsha"},{
    $inc: {
        age: -2
    }
}, {
    returnOriginal: false
}).then((res) =>{
    console.log(res);
});



//db.close()
});