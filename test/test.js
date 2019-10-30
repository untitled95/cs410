const request = require('supertest');
const {app} = require('../src/app')



describe('Test the root path', () => {
    test('It should response the GET method', (done) => {
        request(app).get('/api/users').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });

    test('It should response the GET method', (done) => {
        request(app).get('/api/posts').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});