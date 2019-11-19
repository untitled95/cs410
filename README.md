# How To Host This Backend On Your server

- Git clone this repo into your server

- Make sure that your sever has Node.js installed. <br>
https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04 <br>
This link will be really helpful for you to understand how to install Node.js on ubuntu server.  <br>
After installation you can check by enter 
```
node -v 
```
It will showing something like
```
v12.12.0
```
It means you have sucessfully installed the Node.js.

- Make sure that your server has MongoDB installed. <br>
https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/ <br>
This link will help you to understand how to install MongoDB on ubuntu server. <br>
In case you want to use MongoDB atlas. You can change the uri in the app.js file to match the correct link to MongoDB atlas.

- How to keep your server running even after you closed the terminal <br>
For myself, I like using PM2 for running my Node.js app. <br>
https://www.npmjs.com/package/pm2 <br> 
```
npm install pm2 -g
```
cd into the cs410 folder and 
```
pm2 start "server.js"
```
voilà, now you have the server running on your server.


# How to use locally
- Install Node.js
- Install MongoDB
- Install dependence 
```
yarn install
```
- Run locally
```
node server.js
```
For my self I like using nodemon <br>
https://www.npmjs.com/package/nodemon <br>
It can auto compile after you made any change to your code. <br>
```
nodemon server.js
```
voilà, now you have the server running locally.

- Run test
```
jest --coverage
```
# This is the temp documents for backend APIs.


`@url = http://localhost:80/api` <br>
This url should be replace with the real IP address <br>
`@json = Content-Type: application/json` <br>
All data should be sent though json format <br>
The server would also sent back the data in json format. <br>

[show all users](#show-all-users)

## The APIs without any login
### show all users <a name = "show-all-users"/>
This is only use for test purpose, do not use this API in the
production environment
`get {{url}}/users`
will return all users' profile without their tokens.

### get all posts 
This is only use for test purpose, do not use this API in the
production environment  
`get {{url}}/posts`
will return all posts in the database


## The APIs need normal user login
### post something here
Post something into database. 
I need token to make sure who is posting
I also need title (post title) and body (post details)
`post {{url}}/post`
#### token
Authorization: Bearer 
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYTUxMmQxZjM5ZGFkMjViMjY2MjZhYSIsImlhdCI6MTU3MTY5NjgwM30.ZxIA7q1fua3IqwgaXgkG9D8WxrPj58QzI9XzZOeZdkY
#### json data

``` JSON
{
    "title" : "example title",
    "body" : "example body"  
}
```
### register user
`post {{url}}/register`
In the json, I need username and password data.


```
{
    "username" : "user1",
    "password" : "123456",
    "email" : "user1@test.com"
}
```
If duplicate username or duplicate email, code(409). On Success, code(200).

### user login 
`post {{url}}/login`
In the json, I need username and password which already registered before.

```
{
    "username" : "user1",
    "password" : "123"
}
```
On success, I will return the user detail with token. and code (200) If fail, if no username I will return message: no username. If wrong password, I will return message: wrong password. 
Both fail will get code(422).

Example
```
{
  "user": {
    "_id": "5da512d1f39dad25b26626aa",
    "username": "user1",
    "password": "$2b$10$0IaQjfHsGtj6KayaX0/XgO5lyKcUSGEsTLtMLasrzIUhNu84SI95u",
    "level": "normal",
    "createTime": "2019-10-15T00:29:05.000Z",
    "__v": 0,
    "favorite": null,
    "region": null,
    "updateTime": "2019-10-21T22:28:37.260Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYTUxMmQxZjM5ZGFkMjViMjY2MjZhYSIsImlhdCI6MTU3MTg0Nzk5M30.Iw0-3lK1LhJm66X8JHqrj3KkLQdVGXZo87f0IuLB7bQ"
}
```



### Get person info
`get {{url}}/profile`
I need token for the current user who request for their own profile.

Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYTUwZmY1M2VjN2UxMjQxZjA4NGIwZiIsImlhdCI6MTU3MTA5OTA5NH0.W5X_PqiOp5Drcdpw_ww021YvFOkaVMItTXHAOypRu6I


### update person info
`post {{url}}/update`
I need token for the current user who request for their own profile.
I also need json data with the field you want to change. 
I will not check the data you entered this time. 
On success, code(200) and I will return the updated user profile.
You can change
```
{
    region: {type: String},
    favorite: {type: String},
    level: {type: String}
}
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYTUxMmQxZjM5ZGFkMjViMjY2MjZhYSIsImlhdCI6MTU3MTMzMTIzMH0.3JuXvE9JtEGOQjMIx2ifOdCOI-iGfEKFqyRyfc5MrT4

```
{
    "username" : "blablabla"
}
```

### update person password
`post {{url}}/changePwd`
I need the token and the new password in json format.
On success, code(200).
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYTUxMmQxZjM5ZGFkMjViMjY2MjZhYSIsImlhdCI6MTU3MTY4Nzk4MH0.1ijgviB3NmjWeS1q6RIBqh6Ty1laRfPh06pdoDsEqTY

```
{
    "password" : "123"
}
```
## Message relative 
### Send message
`post {{url}}/send`
Authorization: Bearer Token

```
{
    "username": "the user you want to comunicate",
    "message" : "some message"
}
```
### get messages.
`post {{url}}/messages`
Authorization: Bearer Token

```
{
    "username": "the user you want to get all history messages"
}
```
For this one, the return info will be like
```
[
    {
        "users": [
            "user2",
            "user1"
        ],
        "_id": "5dc1c2ea60e3b50c01c820d6",
        "message": [
            {
                "direction": true,
                "content": "hey",
                "time": "2019-11-05T18:43:54.651Z"
            },
            {
                "direction": false,
                "content": "hello hey",
                "time": "2019-11-05T18:45:19.158Z"
            }
        ],
        "__v": 1
    }
]
```
 true means that this is the message user 2 send to the user1.
 false means that this is the message user 1 send to the user2.

### forget password.
`get {{url}}/forget'`
```
{
    "username": "the user who forget the password"
    "email": "the email address of that user"
}
```

On sucess, will return 200, and
```
{
    "Token": "token for update password"
}
```

If the username can not be found in the DB
it will return 200 and:
```
{
    message: 'Wrong user name!'
}
```

If the username and email address are not match
it will return 200 and:
```
{
    message: 'Incorrect Email Address...'
}
```

### update password.
`get {{url}}/updatePass'`
```
{
    "resetPasswordToken": "the token get from the api: /forget",
    "password": "new password"
}
```

On sucess, will return 200, and
```
{
    message: 'Password Reset Sucessfully!!'
}
```

If the token is wrong, it will return 200 and
```
{
    message: 'Invalid Token!.'
}
```

If the token is expired, it will return 200 and
```
{
    message: 'Password reset token is expired.'
}
```

If any other error, it will return 200 and
```
{
    message: 'Error!!'
}
```
