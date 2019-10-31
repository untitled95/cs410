const request = require('supertest');
const { app } = require('../src/app')
const { User, Post } = require('../models');

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
});


describe('auth test',()=>{
    test('should return 403 with the wrong token',(done)=>{
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
    test('Should return 200 after admin login',(done)=>{
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
    test('Should return 200 after user2 login',(done)=>{
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
    test('It can login with the new password',(done)=>{
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

describe('Post relative',()=>{
    test('It should response 200 after post with non-empty title and body', (done) => {
        request(app).post('/api/post')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title:"post 1",
                body:"post 1 body"
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
                title:"",
                body:"post 1 body"
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
                title:"post 1",
                body:""
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

    test('cannot delete post for wrong post id, should return 404', (done) => {
        request(app).post('/api/delPost')
            .set('Authorization', `Bearer ${token}`)
            .send({
                _id: "111111111"
            })
            .then((res) =>{
                expect(res.statusCode).toBe(404)
                done()
            })
    })

    // user2 wants to user1's post
    test('can not delete post by wrong user, should return 403', (done) => {
        request(app).post('/api/delPost')
            .set('Authorization', `Bearer ${token2}`)
            .send({
                _id: post_id
            })
            .then((res) =>{
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

    //user1 wants to user1's post
    test('can delete post by correct user, should return 200', (done) => {
        request(app).post('/api/delPost')
            .set('Authorization', `Bearer ${token}`)
            .send({
                _id: post_id
            })
            .then((res) =>{
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

    
    test('cannot delete post for empty post database, should return 404', (done) => {
        request(app).post('/api/delPost')
            .set('Authorization', `Bearer ${token}`)
            .send({
                _id: post_id
            })
            .then((res) =>{
                expect(res.statusCode).toBe(404)
                done()
            })
    })

    //add some posts
    test('It should response 200 after post with non-empty title and body', (done) => {
        request(app).post('/api/post')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title:"post 1",
                body:"post 1 body"
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
            .then((res)=>{
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
