const request = require('supertest');
const app = require("../src/app");
const Task = require('../src/models/task');
const { 
  userOneId, 
  userTwoId, 
  userOne, 
  userTwo, 
  taskOne,
  taskTwo,
  taskThree,
  populateDatabase,
} = require("./fixtures/db");

beforeEach(populateDatabase);

test('Should create task for user', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "from my test"
    })
    .expect(201);

    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toEqual(false);
});

test('Should get users tasks', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
  
  expect(response.body.length).toEqual(2);
});

test('Should not allow users to delete other users tasks', async () => {
  const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);

  const task = await Task.findById(taskOne._id);
  expect(task.description).toEqual("first task");
});

