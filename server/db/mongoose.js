const mongoose = require("mongoose");

mongoose.Promise = global.Promise; //native Promise library 
mongoose.connect(process.env.MONGODB_URI);
//mongoose continuously waits for new connections before making a query.
//no need to micromanage order. 

module.exports = {
    mongoose
};