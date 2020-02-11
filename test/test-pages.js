var expect = require('chai').expect;
var request = require('request');

it('Home page content', function(done) {
    request('http://localhost:3000/', function(error, response, body) {
        expect(body).to.equal('Hello World');
    });
    done();
});

describe('Course Pages', function() {

    it('Courses', function(done) {
        request('http://localhost:3000/courses', function(error, response, body) {
            expect(response.statusCode).to.equal(200);
        });
        done();
    });

    it('Courses 1', function(done) {
        request('http://localhost:3000/courses/1', function(error, response, body) {
            expect(response.statusCode).to.equal(200);
        });
        done();
    });

})