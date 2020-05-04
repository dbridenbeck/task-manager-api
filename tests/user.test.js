const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const { userOneId, userOne, populateDatabase } = require("./fixtures/db");

beforeEach(populateDatabase);

test('Should sign up a new user', async () => {
  const response = await request(app)
    .post('/users')
    .send({
      name: 'Andrew',
      email: "whoever@example.com",
      password: "mypasss777!"
    })
    .expect(201);

    const user = await User.findById(response.body.user._id);
    expect(response.body).toMatchObject({
      user: {
        name: "Andrew",
        email: "whoever@example.com",
      },
      token: user.tokens[0].token,
    });

    expect(user.password).not.toBe("mypasss777!");
});

test('Should sign in an existing user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should not login nonexistant user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: "wrongpassword"
    })
    .expect(400);
});

test('Should fetch user profile', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test('Should not get profile for unauthenticated user', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401);
});

test('Should delete account for user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

    const user = await User.findById(userOneId);
    expect(user).toBeNull();
});

test('Should not delete account for unauthenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401);
});

test('Should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update valid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "roger"
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.name).toEqual("roger");
});

test('Should not update invalid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: "zimbabwe"
    })
    .expect(400);
});