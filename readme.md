# Task Manager API
Created by Darren Bridenbeck as part of [The Complete Node.js course](https://www.udemy.com/course/the-complete-nodejs-developer-course-2/) on Udemy

# Description
An API that allows users to manage their tasks. API supports CRUD actions on tasks and users, using authentication to ensure users are restricted to only their tasks.

# Specifications
## App.js
- Connect to Mongoose
- Setup express server
- Use User and Tasks routers

## Routers
### User Router
##### POST /users 
- adds new user to database
- sends welcome email to user
- generates Auth Token for user
- Passwords must be longer than 7 characters and not contain the word "password"

Expected request body:
```
{
	"name": "any name",
	"email": "email@gmail.com",
	"password": "MustBeLongerThan7Characters"
}
```

##### POST /users/login
- if email and password match a user in the db, log user in and create auth token

Expected request body:
```
{
	"email": "UserEmail@gmail.com",
	"password": "UserPassword"
}
```

##### POST /users/logout
- remove current auth token from user

##### POST /users/logout-all 
- remove all tokens from user

##### GET /users/me
- if user is authenticated return age, id, name, email, createdAt and updatedAt

##### PATCH /users/me
- allow updates to name, email, password, and age fields
- Age must be a positive number
- Passwords must be longer than 7 characters and not contain the word "password"

Request body can contain any of the following:
```
{
	"name": "any user name",
  "email": "UserEmail@gmail.com",
	"password": "UserPassword",
  "age": MustBePositiveNumber,
}
```

##### DELETE /users/me
- remove user from DB and send email notification to user

##### POST /users/me/avatar
- use multer and sharp to save image to DB
- Request should be made using form-data and files ending in .jpg, .jpeg, or .png


##### DELETE /users/me/avatar
- Remove avatar from user in DB

##### GET /users/:id/avatar
- get individual users avatar by user ID

### Task Router

##### POST /tasks
- create a task in database with the user._id as the owner
- Completed field is optional in request, default is false

Expected Request Body:
```
{
	"description": "store in prod db",
	"completed": boolean
}
```

##### **Note that for any GET/PATCH/DELETE actions user must be owner of the task!**

##### GET /tasks
Supports getting tasks by querying:
- Completed: true or false (e.g. /tasks?completed=true)
- sortBy: any field on task (description, completed, createdAt, updatedAt) by asc or desc (e.g. /tasks?sortBy=createdAt:asc)
  

##### GET /tasks/:id
- return task by id

### PATCH /tasks/:id
- updates a task which a user owns

Request body can have any of the following set:
```
{
	"completed": false,
	"description": "any text you want"
}
```

### DELETE /tasks/:id
- deletes task that a user owns

## Models
### User Model
##### Fields:
- name: string, required, will be trimmed
- age: number, default = 0, must be positive number
- email: string, required, will be trimmed, lowercased and must be unique and validated to be an email
- password: string, required, will be trimmed, minimum length is 7 and cannot contain "password"
- tokens: an array of objects with this structure:

```
{
  token: string, required
}
```

- avatar: type is Buffer
- createdAt: date when user was created
- updatedAt: date when user was last updated

##### user methods
###### toJSON
- remove password, tokens and avatar from JSON responses

###### generateAuthToken
- use jwt to create and add a token to token array on user

##### user statics
###### findByCredentials
- see if user email and password are valid, if so return user
- use bcrypt to see if user password matches stored password

### user pre
##### save
- use bcrypt to hash password on save

##### remove
- remove users tasks when a user is removed

### Task Model
##### Fields:
- description: string, required, will be trimmed
- completed: boolean
- owner: ObjectId, required
- createdAt: date
- updatedAt: date

## Auth Middleware
- use jwt to verify request token
- if unable to find user with request token, throw error

## /emails/account.js
- Utilizes sendgrid to send email to user when they join the service and when they delete their account

## /db/mongoose.js
- connect mongoose to mongoDB

# Setup/Install Requirements
1. Download repo
2. Run 'npm install' to install dependencies
3. Make sure mongoDB is installed, if not, do so here: https://www.mongodb.com/download-center/community
4. Start mongoDB server with /pathToMongodbFolder/mongodb/bin/mongod --dbpath=/pathToMongodbData/mongodb-data
5. Start API server with 'npm run dev'
6. Start making requests! (I'd recommend first creating a user, so that you have authorization to make all the other calls!)

# Known Bugs
- none currently

# Support and Contact Details
- Contact Darren Bridenbeck at darren.bridenbeck@gmail.com

# Technologies Used
- [Express](https://www.npmjs.com/package/express)
- [MongoDB](https://www.mongodb.com/) for database
- [Mongoose](https://www.npmjs.com/package/mongoose) as ODM
- [Supertest](https://www.npmjs.com/package/supertest) to test api
- [JWT](https://www.npmjs.com/package/jsonwebtoken) to create auth tokens
- [Validator](https://www.npmjs.com/package/validator) to validate user email and passwords
- [sharp](https://www.npmjs.com/package/sharp) to convert images for user avatars
- [multer](https://www.npmjs.com/package/multer) to handle form-data so that api can accept image files for user avatar
- [bcrypt](https://www.npmjs.com/package/bcrypt) to hash user passwords
- [@sendgrid/mail](https://www.npmjs.com/package/@sendgrid/mail) for sending emails to users