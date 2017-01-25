const expect = require("expect");
const request = require("supertest");


const {app} = require("./../server");
const {Todo} = require("./../models/todo");
const {ObjectID} = require("mongodb");

const todos = [{
    _id: new ObjectID(),
    text: "First test todo"
}, {
    _id: new ObjectID(),
    text: "second test todo"
}, {
    _id: new ObjectID(),
    text: "third test todo"
}];


beforeEach((done) =>{
    Todo.remove({}).then(()=>{
        Todo.insertMany(todos); //insert dummy vbls into database for testing
    }).then(() => done());
});

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

});

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

