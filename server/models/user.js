const mongoose = require("mongoose");

//User model 
var User = mongoose.model("User", {
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        default: null
    }
});

module.exports = {
    User
};