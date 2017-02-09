
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcryptjs");

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        default: null,
        unique: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value);
            },
            message: "{VALUE} is not a valid email"
        },
    }, 
    password: {
        type: String, 
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            require: true
        }
    }]
});

UserSchema.methods.toJSON = function () { //override mongoose model to JSON
    var user = this; 
    var userObject = user.toObject(); //Convert model to an object

    return _.pick(userObject, ['_id', 'email']); 
    //only pick userID and email to prevent private data (token)
    //from being exposed. 
};

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  });
};

UserSchema.statics.findByToken = function (token) {
    var User = this; //Model is this binding (static)
    var decoded; 

    try{
        decoded = jwt.verify(token, 'abc123');
    } catch(e){
        return new Promise((resolve, reject) => {
            reject();
        });   
    }
    return User.findOne({
        '_id': decoded._id,
        'tokens.token' : token, 
        'tokens.access' : 'auth'
    });
};

UserSchema.statics.findByCredentials = function (email, password) {
    var user = this; 

    return User.findOne({email}).then((user) => {
        if(!user){
            return Promise.reject();
        }


        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {    
                if(res === false){
                   reject();
                }  else {
                    resolve(user);
                }
                
            });
        });
    });
};


//configure model before saving
UserSchema.pre('save', function(next) {
    var user = this; 

    if(user.isModified('password')){
   
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash; 
                next();
            });
        });

    } else {
        next();
    }
});

var User = mongoose.model("User", UserSchema);

module.exports = {
    User
};





