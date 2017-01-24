const expect = require("expect");
const request = require("supertest");


const {app} = require("./../server");
const {Todo} = require("./../models/todo");

beforeEach((done) =>{
    Todo.remove({}).then(()=>{
        done();
    });
}); //erase all Todos in the database before each test case 

describe("POST Todos", () =>{
    it("should create a new todo in the database", (done)=>{
        var text = "Test text";

        //send the request 
        request(app)
        .post("/todos")
        .send({text}) //send data with the POST request, converted to JSON
        .expect(200)
        .expect((res) =>{
            expect(res.body.text).toBe(text); //equals text string defined above
        })
        .end((err, res) =>{
            if(err){
                return done(err);
            }

            Todo.find().then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e) =>{
                done(e);
            });
        });

    });

    it("should not write to the database with an invalid value", ()=>{

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
                expect(todos.length).toBe(0);
                done();
            }).catch((e) =>{
                done(e);
            });

        });
    });

});
