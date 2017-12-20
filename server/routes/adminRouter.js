var express = require('express');
var adminRouter = express.Router();
var _ = require('lodash');
var {Admin} = require('./../models/admin');
var {Ranking} = require('./../models/ranking');

var router = () => {

    adminRouter.route('/login')
        .get((req, res) => {
            res.render('login');
        })
        .post(async (req, res) => {
            let {username, password} = req.body;
            try {
                let token = await Admin.login(username, password);
                req.session.token = token;
                res.header('x-auth', token).send();
            } catch (e) {
                res.sendStatus(401);
            }
        });

    // adminRouter.use(async (req, res, next) => {
        // if (!res.session || !res.session.token) return res.sendStatus(401);

    // });

    adminRouter.route('/signUp')
        .post(async (req, res) => {
            let body = _.pick(req.body,['username','password']);
            let newAdmin = Admin(body);
            try {
                let user = await newAdmin.save();
                res.send(user);
            } catch (e) {
                res.send(e);
            }
        });

    adminRouter.route('/check')
        .get((req, res) => {
            if (req.session && req.session.token) {
                res.send('COOL!');
            }
            res.send(404);
        });

    // adminRouter.post('/create', async (req, res) => {
        // let body = _.pick(req.body, ['site', 'stats', 'imgUrl', 'rank']);
        // let newDoc = Ranking()
    // });

    adminRouter.post('/update', async (req, res) => {
        var {site, stats, imgUrl, rank} = req.body;

        if (!site) return res.status(400).send();

        try {

            let doc = await Ranking.findOne({site});
            if (stats) doc.stats.push(...stats);
            if (imgUrl) doc.imgUrl = imgUrl;
            if (rank) doc.rank = rank;
            let new_doc = await doc.save();
            res.send(new_doc);

        } catch (e) {

            res.sendStatus(400)

        }
    });

    return adminRouter;
};

module.exports = router;