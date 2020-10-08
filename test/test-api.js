var expect  = require('chai').expect;
const request = require('supertest');
const app = require('../index');

describe('GET /', function() {
    it('Response message', async () => {
        const res = await request(app)
            .get('/')
            .set('Accept', 'application/json');

        try {

            expect(res.body.message).to.equal('Hello world');

            process.exit(0)
            
        } catch (err) {

            console.error('Test error: ', err)
            process.exit(1)
            
        }

    });
});