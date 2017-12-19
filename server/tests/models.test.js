const expect = require('expect');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const {populateAdmins, populateRankings, rankings, admins} = require('./seed/seed');
const {Admin} = require('./../models/admin');
const {Ranking} = require('./../models/ranking');
const {app} = require('./../server');

beforeEach(populateAdmins);
beforeEach(populateRankings);

describe('Admin.findByUserAndPass', () => {
    it('should find correct admin', async () => {
        const user = await Admin.findByUserAndPass('username1', 'password1');
        expect(user.username).toBe('username1');
        expect(user.password).toBe('password1');
    });

    it('should not find incorrect admins', async () => {
        var error = false;
        try {
            const user = await Admin.findByUserAndPass('username1', 'password2');
        } catch (e) {
            error = true;
        }
        expect(error).toBe(true);
    });
});

describe('Admin.generateAuthToken', () => {
    it('should correctly login the user', async () => {
        const token = await Admin.login('username1', 'password1');
        const admin = await Admin.findByUserAndPass('username1', 'password1');
        expect(admin.tokens[0].token).toBe(token);
    });
});

describe('Ranking.getRank', () => {
    it('should correctly get #1', async () => {
        const number1 = await Ranking.getRank(1);
        expect(number1.length).toBe(1);
        expect(number1[0].site).toBe('QS');
    });

    it('should correctly get #2', async () => {
        const number1 = await Ranking.getRank(2);
        expect(number1.length).toBe(2);
        expect(number1[0].site).toBe('USNews');
        expect(number1[1].site).toBe('Times');
    });
})

describe('Ranking.getSite', () => {
    it('should correctly get USNews', async () => {
        const number1 = await Ranking.getSite('USNews');
        expect(number1.site).toBe('USNews');
    });
});