const request = require('supertest');
const { app } = require('../src/app')
const { User, Post,Message } = require('../models');

var token;
var adminToken;
var token2;

beforeAll(() => {
    const user = User.create({
        username: "admin",
        password: require('bcrypt').hashSync("admin", 10),
        email: "admin@test.com",
        region: "all",
        favorite: "nothing",
        level: "admin",
        createTime: Date()
    });
    const user2 = User.create({
        username: "user2",
        password: require('bcrypt').hashSync("123456", 10),
        email: "user2@test.com",
        region: "South",
        favorite: "nothing",
        level: "normal",
        createTime: Date()
    });

})

afterAll(() => {
    User.db.dropCollection('users');
    Post.db.dropCollection('posts');
    Message.db.dropCollection('messages');
});


describe('auth test', () => {
    test('should return 403 with the wrong token', (done) => {
        request(app).get('/api/profile')
            .set('Authorization', `Bearer ${token}`)
            .then((res) => {
                expect(res.statusCode).toBe(403);
                done();
            })
    })
})

describe('General tests', () => {
    test('Should return 200 with the get all users request', (done) => {
        request(app).get('/api/users').then((res) => {
            expect(res.statusCode).toBe(200);
            done();
        })
    })
    test('Should return 200 with the get all posts request', (done) => {
        request(app).get('/api/posts').then((res) => {
            expect(res.statusCode).toBe(200);
            done();
        })
    })
    test('Should return 200 after admin login', (done) => {
        request(app).post('/api/login')
            .send({
                username: "admin",
                password: "admin"
            })
            .then((res) => {
                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveProperty("token")
                adminToken = res.body.token;
                done()
            })
    })
    test('Should return 200 after user2 login', (done) => {
        request(app).post('/api/login')
            .send({
                username: "user2",
                password: "123456"
            })
            .then((res) => {
                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveProperty("token")
                token2 = res.body.token;
                done()
            })
    })
})

describe('Register tests', () => {
    test('It should response the 200 with unique username and password', (done) => {
        request(app).post('/api/register')
            .send({
                username: "user1",
                email: "user1@test.com",
                password: "123456"
            })
            .then((res) => {
                expect(res.statusCode).toBe(200);
                done();
            });
    });

    test('It should response 422 if register with duplicate username', (done) => {
        request(app).post('/api/register')
            .send({
                username: "user1",
                email: "user2@test.com",
                password: "123456"
            })
            .then((res) => {
                expect(res.statusCode).toBe(422);
                done();
            });
    });
    test('It should response 422 if register with duplicate email', (done) => {
        request(app).post('/api/register')
            .send({
                username: "user2",
                email: "user1@test.com",
                password: "123456"
            })
            .then((res) => {
                expect(res.statusCode).toBe(422);
                done();
            });
    });
});

describe('Login test', () => {
    test('It should response 200 if using the correct username and password', (done) => {
        request(app).post('/api/login')
            .send({
                username: "user1",
                password: "123456"
            })
            .then((res) => {
                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveProperty("token")
                token = res.body.token;
                done()
            })
    })
    test('It should response 422 if using the incorrect password', (done) => {
        request(app).post('/api/login')
            .send({
                username: "user1",
                password: "1234567"
            })
            .then((res) => {
                expect(res.statusCode).toBe(422);
                done()
            })
    })
    test('It should response 422 if using the wrong username', (done) => {
        request(app).post('/api/login')
            .send({
                username: "someRandomUser",
                password: "123456"
            })
            .then((res) => {
                expect(res.statusCode).toBe(422);
                done()
            })
    })
})


describe('Profiles relative tests', () => {
    test('It should response 200 if using the correct normal users token', (done) => {
        request(app).get('/api/profile')
            .set('Authorization', `Bearer ${token}`)
            .then((res) => {
                expect(res.statusCode).toBe(200);
                done()
            })
    })
    test('It should response 200 if using the correct admin users token, and return all users profiles', (done) => {
        request(app).get('/api/profile')
            .set('Authorization', `Bearer ${adminToken}`)
            .then((res) => {
                expect(res.statusCode).toBe(200);
                expect(res.body.length).toBe(3);
                done()
            })
    })
    test('It should response 200', (done) => {
        request(app).post('/api/update')
            .set('Authorization', `Bearer ${token}`)
            .send({
                region: "North",
                favorite: "Nothing"
            })
            .then((res) => {
                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveProperty("region");
                expect(res.body.region).toBe("North");
                expect(res.body).toHaveProperty("favorite");
                expect(res.body.favorite).toBe("Nothing");
                done()
            })
    })
    test('It should response 200', (done) => {
        request(app).post('/api/changePwd')
            .set('Authorization', `Bearer ${token}`)
            .send({
                password: "234"
            })
            .then((res) => {
                expect(res.statusCode).toBe(200);
                done()
            })
    })
    test('It can login with the new password', (done) => {
        request(app).post('/api/login')
            .send({
                username: "user1",
                password: "234"
            })
            .then((res) => {
                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveProperty("token")
                token = res.body.token;
                done()
            })
    })
})

describe('Post relative', () => {
    test('It should response 200 after post with non-empty title and body', (done) => {
        request(app).post('/api/post')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: "post 1",
                body: "post 1 body"
            })
            .then((res) => {
                expect(res.statusCode).toBe(200);
                done()
            })
    })
    test('It should response 403 after post with empty title or body', (done) => {
        request(app).post('/api/post')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: "",
                body: "post 1 body"
            })
            .then((res) => {
                expect(res.statusCode).toBe(403);
                done()
            })
    })
    test('It should response 403 after post with empty title or body', (done) => {
        request(app).post('/api/post')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: "post 1",
                body: ""
            })
            .then((res) => {
                expect(res.statusCode).toBe(403);
                done()
            })
    })
})


//delete post by admin 
var post_id;

describe('test delete post', () => {
    // get user1's first post id
    test('Should return 200 with the get all posts request', (done) => {
        request(app).get('/api/posts').then((res) => {
            expect(res.statusCode).toBe(200);
            post_id = res.body[0]._id;
            done();
        })
    })

    // user2 wants to user1's post
    test('can not delete post by wrong user, should return 403', (done) => {
        request(app).post('/api/delPost')
            .set('Authorization', `Bearer ${token2}`)
            .send({
                _id: post_id
            })
            .then((res) => {
                expect(res.statusCode).toBe(403)
                done()
            })
    })

    test('Should return 200 with the get one post', (done) => {
        request(app).get('/api/posts').then((res) => {
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(1);
            done();
        })
    })

    //user1 wants to delete user1's post
    test('can delete post by correct user, should return 200', (done) => {
        request(app).post('/api/delPost')
            .set('Authorization', `Bearer ${token}`)
            .send({
                _id: post_id
            })
            .then((res) => {
                expect(res.statusCode).toBe(200)
                done()
            })
    })

    test('cannot delete post for empty post database, should return 404', (done) => {
        request(app).post('/api/delPost')
            .set('Authorization', `Bearer ${token}`)
            .send({
                _id: post_id
            })
            .then((res) => {
                expect(res.statusCode).toBe(404)
                done()
            })
    })

    //add some posts
    test('It should response 200 after post with non-empty title and body', (done) => {
        request(app).post('/api/post')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: "post 1",
                body: "post 1 body"
            })
            .then((res) => {
                expect(res.statusCode).toBe(200);
                done()
            })
    })

    // get user1's first post id
    test('Should return 200 with the get all posts request', (done) => {
        request(app).get('/api/posts').then((res) => {
            expect(res.statusCode).toBe(200);
            post_id = res.body[0]._id;
            done();
        })
    })

    //admin wants to delete
    test('can delete post by admin, should return 200', (done) => {
        request(app).post('/api/delPost')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                _id: post_id
            })
            .then((res) => {
                expect(res.statusCode).toBe(200)
                done()
            })
    })

    test('Should return 200 with the get no post', (done) => {
        request(app).get('/api/posts').then((res) => {
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(0);
            done();
        })
    })
})

var post_id2;
describe('Edit post test', () => {
    test('User1 post something', (done) => {
        request(app).post('/api/post')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: "post 1 title",
                body: "post 1 body",
                region: "North",
                payRate: 10
            })
            .then((res) => {
                expect(res.statusCode).toBe(200);
                post_id = res.body._id;
                done()
            })
    })

    test('User2 post something', (done) => {
        request(app).post('/api/post')
            .set('Authorization', `Bearer ${token2}`)
            .send({
                title: "user2 post 1 title",
                body: "user 2 post 1 body",
                region: "South",
                payRate: 5
            })
            .then((res) => {
                expect(res.statusCode).toBe(200);
                post_id2 = res.body._id;
                done()
            })
    })

    test('User 1 can edit his own post', (done) => {
        request(app).post('/api/editPost')
            .set('Authorization', `Bearer ${token}`)
            .send({
                _id: post_id,
                title: "edit post 1 title",
                body: "edited post 1 body",
                region: "edited north",
                payRate: 0
            })
            .then((res) => {
                expect(res.body).toHaveProperty("title");
                expect(res.body.title).toBe("edit post 1 title");
                expect(res.body).toHaveProperty("body");
                expect(res.body.body).toBe("edited post 1 body");
                expect(res.body).toHaveProperty("region");
                expect(res.body.region).toBe("edited north");
                expect(res.body).toHaveProperty("payRate");
                expect(res.body.payRate).toBe(0);
                done();
            })
    })

    test('Should return 404. User 1 can not edited post not exits', (done) => {
        request(app).post('/api/editPost')
            .set('Authorization', `Bearer ${token}`)
            .send({
                _id: "5db769ce1989d472fa436bb4",
                title: "edit post 1 title",
                body: "edited post 1 body",
                region: "edited north",
                payRate: 0
            })
            .then((res) => {
                expect(res.statusCode).toBe(404);
                done();
            })
    })

    test('User 1 can edit his own post pay rate', (done) => {
        request(app).post('/api/editPost')
            .set('Authorization', `Bearer ${token}`)
            .send({
                _id: post_id,
                payRate: 2
            })
            .then((res) => {
                expect(res.body).toHaveProperty("title");
                expect(res.body.title).toBe("edit post 1 title");
                expect(res.body).toHaveProperty("body");
                expect(res.body.body).toBe("edited post 1 body");
                expect(res.body).toHaveProperty("region");
                expect(res.body.region).toBe("edited north");
                expect(res.body).toHaveProperty("payRate");
                expect(res.body.payRate).toBe(2);
                done();
            })
    })

    test('User 1 can not edit user2 post ', (done) => {
        request(app).post('/api/editPost')
            .set('Authorization', `Bearer ${token}`)
            .send({
                _id: post_id2,
                title: "edit post 1 title",
                body: "edited post 1 body",
                region: "edited north",
                payRate: 2
            })
            .then((res) => {
                expect(res.statusCode).toBe(403);
                done();
            })
    })

    test('view user own posts', (done) => {
        request(app).get('/api/viewPosts')
            .set('Authorization', `Bearer ${token}`)
            .then((res) => {
                expect(res.body.length).toBe(1);
                done();
            })
    })
})

describe('message relative tests',()=>{
    test('send the very first message',(done)=>{
        request(app).post('/api/send')
        .set('Authorization',`Bearer ${token}`)
        .send({
            username: "user2",
            message: "hello"
        })
        .then(((res)=>{
            expect(res.statusCode).toBe(200);
            expect(res.body.message.length).toBe(1);
            expect(res.body.message[0].direction).toBe(true);
            done();
        }))
    })
    test('send the second first message',(done)=>{
        request(app).post('/api/send')
        .set('Authorization',`Bearer ${token}`)
        .send({
            username: "user2",
            message: "hello2"
        })
        .then(((res)=>{
            expect(res.statusCode).toBe(200);
            expect(res.body.message.length).toBe(2);
            expect(res.body.message[1].direction).toBe(true);
            done();
        }))
    })
    test('user 2 send user1 a message',(done)=>{
        request(app).post('/api/send')
        .set('Authorization',`Bearer ${token2}`)
        .send({
            username: "user1",
            message: "hello3"
        })
        .then(((res)=>{
            expect(res.statusCode).toBe(200);
            expect(res.body.message.length).toBe(3);
            expect(res.body.message[2].direction).toBe(false);
            done();
        }))
    })
    test('should return 3 after get message length between user1 and user2 ',(done)=>{
        request(app).post('/api/messages')
        .set('Authorization',`Bearer ${token2}`)
        .send({
            username: "user1"
        })
        .then(((res)=>{
            expect(res.statusCode).toBe(200);
            expect(res.body.message.length).toBe(3);
            expect(res.body.message[2].direction).toBe(false);
            done();
        }))
    })
})

var changePassToken;
describe('change password tests',()=>{
    test('user input wrong email address',(done)=>{
        request(app).get('/api/forget')
        .send({
            username: "user2",
            email: "user1@test.com"
        })
        .then(((res)=>{
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Incorrect Email Address...');
            done();
        }))
    })

    test('user input wrong user name',(done)=>{
        request(app).get('/api/forget')
        .send({
            username: "useraa",
            email: "user1@test.com"
        })
        .then(((res)=>{
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Wrong user name!');
            done();
        }))
    })

    test('user input correct email address',(done)=>{
        request(app).get('/api/forget')
        .send({
            username: "user2",
            email: "user2@test.com"
        })
        .then(((res)=>{
            expect(res.statusCode).toBe(200);
            //expect(res.body.Token.length).toBe(1);
            changePassToken = res.body.Token;
            done();
        }))
    })

    test('change password with incorrect token',(done)=>{
        request(app).post('/api/updatePass')
        .send({
            resetPasswordToken: "613bf72c32ab7bdbc94856951847858c679e42cf9149e9a1913d2fc9d20e83b5c784526d5e3623c4ce1efc6d7c2e4935",
            password: "654321"
        })
        .then(((res)=>{
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Invalid Token!.');
            done();
        }))
    })

    test('change password with correct token',(done)=>{
        request(app).post('/api/updatePass')
        .send({
            resetPasswordToken: changePassToken,
            password: "654321"
        })
        .then(((res)=>{
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Password Reset Successfully!!');
            done();
        }))
    })

    test('It can login with the new password', (done) => {
        request(app).post('/api/login')
            .send({
                username: "user2",
                password: "654321"
            })
            .then((res) => {
                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveProperty("token")
                token = res.body.token;
                done()
            })
    })
})
