const request = require('supertest');
const app = require('./server').app;

it('should return 404 (/)', function (done) {
    request(app).get('/')
    .expect(404)
    .end(done);
});

it('should return 200 (/teams)', function (done) {
    request(app).get('/teams')
    .expect(200)
    .end(done);
});

it('should return 200 (/team/65)', function (done) {
    request(app).get('/team/65')
    .expect(200)
    .end(done);
});