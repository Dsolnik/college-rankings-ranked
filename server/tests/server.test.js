const expect = require('expect');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const {populateAdmins, populateRankings, rankings, admins} = require('./seed/seed');
const {Admin} = require('./../models/admin');
const {Ranking} = require('./../models/ranking');
const {app} = require('./../server');

beforeEach(populateAdmins);
beforeEach(populateRankings);

describe('POST /admin/login', () => {
    it('should correctly login admins', (done) => {
        let username = admins[0].username;
        let password = admins[0].password;
        request(app)
          .post('/admin/login')
          .send({username, password})
          .expect(200)
          .expect((res) => {
              expect(typeof res.headers['x-auth']).toBe('string');
          }).end(done);
    });

    it('should not login wrong users', (done) => {
        let username = admins[0].username;
        let password = admins[0].password + 'a';
        request(app)
          .post('/admin/login')
          .send({username, password})
          .expect(401)
          .end(done);
    });
});