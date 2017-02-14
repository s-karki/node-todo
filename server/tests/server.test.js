const expect = require("expect");
const request = require("supertest");


const {app} = require("./../server");
const {Todo} = require("./../models/todo");
const {User} = require("./../models/user");
const {ObjectID} = require("mongodb");
const {todos, populateTodos, users, populateUsers} = require("./seed.js");



beforeEach(populateUsers);
beforeEach(populateTodos);

//test POST request
describe("POST Todos", () =>{
    it("should create a new todo in the database", (done)=>{
        var text = "Test text";

        //send the request 
        request(app)
        .post("/todos")
        .set("x-auth", users[0].tokens[0].token)
        .send({text}) //send data, converted to JSON
        .expect(200)
        .expect((res) =>{
            expect(res.body.text).toBe(text); //equals text string defined above
        })
        .end((err, res) =>{
            if(err){
                return done(err);
            }

            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e) =>{
                done(e);
            });
        });

    });

    it("should not write to the database with an invalid value", (done)=>{

        //send the POST request
        request(app)
        .post("/todos") //post
        .set("x-auth", users[0].tokens[0].token)
        .send({}) //send from server, retrieve by POST
        .expect(400)
        .end((err, res) => {
            if(err){
                return done(err);
            }

            Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                done();
            }).catch((e) =>{
                done(e);
            });

        });
    });

} );

//Test GET requests
describe("GET /todos", ()=>{
    it("Should get all todos in the database", (done)=>{
        request(app)
        .get("/todos")
        .set("x-auth", users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todos.length).toBe(1); //with authorization in seed data, expect only 1 todo for users[0]
        })
        .end(done);
    });
});

describe("GET /todos/:id", ()=>{
    //single todo 
    it("should list todo doc", (done)=>{
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .set("x-auth", users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it("should not return a todo doc created by another user", (done)=>{
        request(app)
        .get(`/todos/${todos[1]._id.toHexString()}`)
        .set("x-auth", users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    //valid ObjectID, but not found in databse
    it("should return 404 if todo is not found", (done)=>{
        var dummyID = new ObjectID().toHexString(); 

        request(app)
        .get(`/todos/${dummyID}`)
        .set("x-auth", users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    //invalid ObjectID
    it("should return 404 if an invalid ObjectID was passed", (done)=>{
        var notAnID = 0000;

        request(app)
        .get(`/todos/${notAnID}`)
        .set("x-auth", users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });
});

describe("DELETE /todos/:id", ()=>{
    it("should remove a todo", (done) =>{
        var hexID = todos[1]._id.toHexString();

        request(app)
        .delete(`/todos/${hexID}`)
        .set("x-auth", users[1].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo._id).toBe(hexID);
        })
        .end((err, res) => {
            if(err){
                return done(err)
            }

            Todo.findById(hexID).then((todo)=>{
                expect(todo).toNotExist();
                done();
            }).catch((e) => done(e));
        });
    });

    it("should not remove a todo created by another user", (done) =>{
        var hexID = todos[0]._id.toHexString();

        request(app)
        .delete(`/todos/${hexID}`)
        .set("x-auth", users[1].tokens[0].token)
        .expect(404)
        .end((err, res) => {
            if(err){
                return done(err)
            }

            Todo.findById(hexID).then((todo)=>{
                expect(todo).toExist(); //deletion should not have happened
                done();
            }).catch((e) => done(e));
        });
    });


    it("should return a 404 if todo not found", (done) =>{
        var dummyID = new ObjectID().toHexString(); 

        request(app)
        .delete(`/todos/${dummyID}`)
        .set("x-auth", users[1].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it("should return a 404 if ObjectID is invalid", (done) => {
         var notAnID = 0000;

        request(app)
        .delete(`/todos/${notAnID}`)
        .set("x-auth", users[1].tokens[0].token)
        .expect(404)
        .end(done);
    });
});

describe("PATCH /todos/:id", ()=>{
    it("should update the todo", (done) =>{

        var id = todos[0]._id.toHexString();
        var text = "test update text";

        request(app)
        .patch(`/todos/${id}`)
        .set("x-auth", users[0].tokens[0].token)
        .send({
            completed: true,
            text
        })
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(true);
            expect(res.body.todo.completedAt).toBeA('number');
        })
        .end(done);
    });

  
    it("should not update the todo of another user", (done) =>{
        var id = todos[0]._id.toHexString();
        var text = "test update text";

        request(app)
        .patch(`/todos/${id}`)
        .set("x-auth", users[1].tokens[0].token)
        .send({
            completed: true,
            text
        })
        .expect(404)
        .end(done);
    });


    it("should clear completedAt when todo is not completed", (done) => {
        var id = todos[1]._id.toHexString();
        var text = "test update text~~~";

        request(app)
        .patch(`/todos/${id}`)
        .set("x-auth", users[1].tokens[0].token)
        .send({
            completed: false,
            text
        })
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toNotExist();
        })
        .end(done);

    });

});

describe("GET /users/me", ()=> {
    it("should return user if authenticated", (done) => {
        request(app)
        .get("/users/me")
        .set("x-auth", users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
        }).end(done);

    });

    //no authentication
    it("should return 401 if not authenticated", (done) => {
        request(app)
        .get("/users/me")
        .expect(401)
        .expect((res) => {
            expect(res.body).toEqual({})
        }).end(done);

    });

});

describe("POST /users", () => {
    it("should create a user", (done) => {
        var email = "example@ex.org";
        var password = "444bbpq";

        request(app)
        .post("/users")
        .send({email, password})
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth'].toExist);
            expect(res.body._id).toExist;
            expect(res.body.email).toBe(email);
        }).end((err) => {
            if (err) {
                return done(err)
            }
                User.findOne({email}).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                }).catch((e) => done(e));
            
        });

    });

    it("should return a validation error if password is too short", (done) => {
        var email = "example2@ex.org";
        var password = "5ccc"; //password minlength is 6 characters

        request(app)
        .post("/users")
        .send({email, password})
        .expect(400)
        .end(done);
    }); 

    it("should return a validation error if email is invalid", (done) => {
        var email = "notanemail";
        var password = "12345677";

        request(app)
        .post("/users")
        .send({email, password})
        .expect(400)
        .end(done);
    }); 

    it("should not create user if the email is in use", (done) => {
        var email = users[0].email; //email in seed data (seed.js)
        var password = "password12300";

        request(app)
        .post("/users")
        .send({email, password})
        .expect(400)
        .end(done);

    });

});

describe("POST /users/login", () => {
    it("should login user and return auth token", (done) => {
        request(app)
        .post("/users/login")
        .send({
            email: users[1].email,
            password: users[1].password
        })
        .expect(200)
        .expect((res) => {
            expect(res.header['x-auth']).toExist();
        })
        .end((err, res)=>{
            if(err){
                return done(err)
            }
            
            User.findById(users[1]._id).then((user) => {
                expect(user.tokens[1]).toInclude({
                    access: 'auth',
                    token: res.header['x-auth']
                });
                done();
            }).catch((e) => done(e));
        });

    });


    it("should reject invalid login", (done) => {
        var email = users[1].email;
        var password = "password_invalid";

        request(app)
        .post("/users/login")
        .send({
            email,
            password
        })
        .expect(400)
        .expect((res) => {
            expect(res.header['x-auth']).toNotExist();
        })
        .end((err, res) => {
            if(err){
                return done(err)
            }

            User.findByCredentials(email, password).then((user) => {
                expect(user.tokens.length).toBe(1);
                done();
            }).catch((e) => done(e));
        });
    }); 

});

describe("DELETE /users/me/token", () => {

    it("should remove auth token on logout", (done) => {
        request(app)
        .delete("/users/me/token")
        .set("x-auth", users[0].tokens[0].token)
        .expect(200)
        .end((err, res) => {
            if(err){
                return done(err);
            }

            User.findById(users[0]._id)
            .then((user) => {
                expect(user.tokens.length).toBe(0);
                done();
            }).catch((e) => done(e));
        });
    });
});


