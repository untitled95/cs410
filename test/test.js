var should = require('chai').should(),
    expect = require('chai').expect,
    supertest = require('supertest'),
    api = supertest('http://localhost:80/api');

var token;

//user register test
describe('User register', function () {
    it('should return  200 response after user register with unique username', function (done) {
        api.post('/register')
            .set('Accept', 'application/json')
            .send({
                username: "user1",
                password: "123456",
                email: "user1@test.com"
            })
            .expect(200, done)
    })
    it('should return  409 response after user register with same username', function (done) {
        api.post('/register')
            .set('Accept', 'application/json')
            .send({
                username: "user1",
                password: "123456",
                email: "user2@test.com"
            })
            .expect(409, done)
    })
    it('should return  409 response after user register with same email', function (done) {
        api.post('/register')
            .set('Accept', 'application/json')
            .send({
                username: "user2",
                password: "123456",
                email: "user1@test.com"
            })
            .expect(409, done)
    })
})


//user login test
describe('User login', function () {
    it('should return 200, if using correct username and password', function (done) {
        api.post('/login')
            .set('Accept', 'application/json')
            .send({
                username: "user1",
                password: "123456"
            })
            .expect(200, done)
    })
    it('should return 422, if username not exits', function (done) {
        api.post('/login')
            .set('Accept', 'application/json')
            .send({
                username: "user2",
                password: "123456"
            })
            .expect(422, done)
    })
    it('should return 422, if password is not correct', function (done) {
        api.post('/login')
            .set('Accept', 'application/json')
            .send({
                username: "user1",
                password: "654321"
            })
            .expect(422, done)
    })
    it('should return token to the front end', function (done) {
        api.post('/login')
            .set('Accept', 'application/json')
            .send({
                username: "user1",
                password: "123456"
            })
            .expect(200)
            .end(function (err, res) {
                expect(res.body).to.have.property('token');
                expect(res.body.token).to.not.equal(null);
                token = res.body.token;
                done();
            })
    })
})


//user info update test for normal user
describe('user get their own profile', function () {
    it('should return user own profile', function (done) {
        api.get('/profile')
            .set('Authorization', token)
            .expect(200)
            .end(function (err, res) {
                expect(res.body).to.have.property('username');
                expect(res.body.username).to.equal('user1');
                expect(res.body).to.have.property('level');
                expect(res.body.level).to.equal('normal');
                done();
            })
    })
    it('should return 403 if token was not received', function (done) {
        api.get('/profile')
            .expect(403, done)
    })
    it('should return 403 if token was invalided', function (done) {
        api.get('/profile')
            .set('Authorization', 'someWrongToken')
            .expect(403, done)
    })
})

//update user profile
describe('user update their own profile', function () {
    it('can update single field', function (done) {
        api.post('/update')
            .set('Authorization', token)
            .set('Accept', 'application/json')
            .send({
                region: "north"
            })
            .expect(200)
            .end(function (err, res) {
                expect(res.body).to.have.property('username');
                expect(res.body.username).to.equal('user1');
                expect(res.body).to.have.property('level');
                expect(res.body.level).to.equal('normal');
                expect(res.body).to.have.property('email');
                expect(res.body.email).to.equal('user1@test.com');
                expect(res.body).to.have.property('region');
                expect(res.body.region).to.equal('north');
                done();
            })
    })
    it('can update several field at same time', function (done) {
        api.post('/update')
            .set('Authorization', token)
            .set('Accept', 'application/json')
            .send({
                region: "south",
                favorite: "nothing"
            })
            .expect(200)
            .end(function (err, res) {
                expect(res.body).to.have.property('username');
                expect(res.body.username).to.equal('user1');
                expect(res.body).to.have.property('level');
                expect(res.body.level).to.equal('normal');
                expect(res.body).to.have.property('favorite');
                expect(res.body.favorite).to.equal('nothing');
                expect(res.body).to.have.property('email');
                expect(res.body.email).to.equal('user1@test.com');
                expect(res.body).to.have.property('region');
                expect(res.body.region).to.equal('south');
                done();
            })
    })
    it('can ignore the wrong data from front end', function (done) {
        api.post('/update')
            .set('Authorization', token)
            .set('Accept', 'application/json')
            .send({
                name: "errorName",
                email: "errorEmail"
            })
            .expect(200)
            .end(function (err, res) {
                expect(res.body).to.have.property('username');
                expect(res.body.username).to.equal('user1');
                expect(res.body).to.have.property('level');
                expect(res.body.level).to.equal('normal');
                expect(res.body).to.have.property('favorite');
                expect(res.body.favorite).to.equal('nothing');
                expect(res.body).to.have.property('email');
                expect(res.body.email).to.equal('user1@test.com');
                expect(res.body).to.have.property('region');
                expect(res.body.region).to.equal('south');
                done();
            })
    })
})