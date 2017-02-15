var env = process.env.NODE_ENV || "development" ; //select development or productio environment
console.log("env *******", env);


if(env === "development" || env === "test"){
    var config = require("./config.json"); //JSON to JS Object
    var envConfig = config[env]; //use a variable to access a property with bracket notation

    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key]; //can easily add new development variables
    }); 
}

