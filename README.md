#This is the temp documents for backend APIs.


`@url = http://localhost:80/api`
This url should be replace with the real IP address
`@json = Content-Type: application/json`
All data should be sent though json format 
The server would also sent back the data in json format.


## The APIs without any login
### show all users
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
{{json}}

{
    "title" : "example title",
    "body" : "example body"  
}

### register user
`post {{url}}/register`
In the json, I need username and password data.
{{json}}

{
    "username" : "user1",
    "password" : "123456",
    "email" : "user1@test.com"
}
If duplicate username or duplicate email, code(409). On Success, code(200).

### user login 
`post {{url}}/login`
In the json, I need username and password which already registered before.
{{json}}

{
    "username" : "user1",
    "password" : "123"
}

On success, I will return the user detail with token. and code (200) If fail, if no username I will return message: no username. If wrong password, I will return message: wrong password. 
Both fail will get code(422).

Example
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




### Get person info
`get {{url}}/profile`
I need token for the current user who request for their own profile.

Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYTUwZmY1M2VjN2UxMjQxZjA4NGIwZiIsImlhdCI6MTU3MTA5OTA5NH0.W5X_PqiOp5Drcdpw_ww021YvFOkaVMItTXHAOypRu6I


###update person info
`post {{url}}/update`
I need token for the current user who request for their own profile.
I also need json data with the field you want to change. 
I will not check the data you entered this time. 
On success, code(200) and I will return the updated user profile.
You can change
{
    region: {type: String},
    favorite: {type: String},
    level: {type: String}
}

Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYTUxMmQxZjM5ZGFkMjViMjY2MjZhYSIsImlhdCI6MTU3MTMzMTIzMH0.3JuXvE9JtEGOQjMIx2ifOdCOI-iGfEKFqyRyfc5MrT4
{{json}}

{
    "username" : "blablabla"
}


###update person password
`post {{url}}/changePwd`
I need the token and the new password in json format.
On success, code(200).
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYTUxMmQxZjM5ZGFkMjViMjY2MjZhYSIsImlhdCI6MTU3MTY4Nzk4MH0.1ijgviB3NmjWeS1q6RIBqh6Ty1laRfPh06pdoDsEqTY
{{json}}

{
    "password" : "123"
}

## The APIs need admin user login
###admin get all users' info.

`get {{url}}/admin/profiles`
I need the token.

Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYTUxMmQxZjM5ZGFkMjViMjY2MjZhYSIsImlhdCI6MTU3MTEwMDI4Mn0.AJOldbgHrXHP5w0lmoG_aW1BVAyO1bd_pnsve6YzOKM
