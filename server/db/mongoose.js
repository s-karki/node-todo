const mongoose = require("mongoose");

mongoose.Promise = global.Promise; //native Promise library 
mongoose.connect("mongodb://localhost:27017/TodoApp");
//mongoose continuously waits for new connections before making a query.
//no need to micromanage order. 

module.exports = {
    mongoose
};