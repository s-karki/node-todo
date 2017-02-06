const expect = require("expect");
const request = require("supertest");


const {app} = require("./../server");
const {Todo} = require("./../models/todo");
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
        .send({}) //send from server, retrieve by POST
        .expect(400)
        .end((err, res) => {
            if(err){
                return done(err);
            }

            Todo.find().then((todos) => {
                expect(todos.length).toBe(3);
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
        .expect(200)
        .expect((res)=>{
            expect(res.body.todos.length).toBe(3);
        })
        .end(done);
    });
});

describe("GET /todos/:id", ()=>{
    //single todo 
    it("should list todo doc", (done)=>{
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    //valid ObjectID, but not found in databse
    it("should return 404 if todo is not found", (done)=>{
        var dummyID = new ObjectID().toHexString(); 

        request(app)
        .get(`/todos/${dummyID}`)
        .expect(404)
        .end(done);
    });

    //invalid ObjectID
    it("should return 404 if an invalid ObjectID was passed", (done)=>{
        var notAnID = 0000;

        request(app)
        .get(`/todos/${notAnID}`)
        .expect(404)
        .end(done);
    });
});

describe("DELETE /todos/:id", ()=>{

    it("should remove a todo", (done) =>{
        var hexID = todos[1]._id.toHexString();

        request(app)
        .delete(`/todos/${hexID}`)
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

            

            //query database using database
            //expect nothing toNotExist
            //call done 
        });
    });

    it("should return a 404 if todo not found", (done) =>{
        var dummyID = new ObjectID().toHexString(); 

        request(app)
        .delete(`/todos/${dummyID}`)
        .expect(404)
        .end(done);
    });

    it("should return a 404 if ObjectID is invalid", (done) => {
         var notAnID = 0000;

        request(app)
        .delete(`/todos/${notAnID}`)
        .expect(404)
        .end(done);
    });

describe("PATCH /todos/:id", ()=>{
    it("should update the todo", (done) =>{

        var id = todos[0]._id.toHexString();
        var text = "test update text";

        request(app)
        .patch(`/todos/${id}`)
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

    it("should clear completedAt when todo is not completed", (done) => {
  
        var id = todos[1]._id.toHexString();
        var text = "test update text~~~";

        request(app)
        .patch(`/todos/${id}`)
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

});



