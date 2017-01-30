//SHA-256 Hashing 
//Hashing: One-way algo. Obfuscate plain-text into a fixed length string. 

//How this works: Customer enters password, server hashes it, matches this hash with the one in 
//the database. If hashes match, then the password is correct.

//Still vulnerable to man-in-the-middle attacks (need HTTPS). But hashing secures data from
//interference from clients, since we can tell when information has changed. 

//Salting a hash: Add some randomly generated information to make hashes unique. 
//The salt is only accessible from the server, so men in the middle are not able to 
//manipulate private data.

//Standard: JWT (JSON Web Token)

const {SHA256} = require("crypto-js");
const jwt = require("jsonwebtoken");

var data = {
    id: 10
};



var token = jwt.sign(data, "123abff"); //creates the hash, returns token
console.log(token);

var decoded = jwt.verify(token, "1123abff");
console.log("decoded", decoded);//determines if data was manipulated




// var message = "This is a private message";
// var hash = SHA256(message).toString();

// // console.log(`Message: ${message}`);
// // console.log(`Hash: ${hash}`);

// var data = {
//     id: 4
// };

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();


// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if(resultHash === token.hash){
//     console.log("Data was not changed.");
// } else {
//     console.log("Data was changed.")
// }


