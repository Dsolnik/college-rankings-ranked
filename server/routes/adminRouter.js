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
        // else {

        // }
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

    adminRouter.post('/create', async (req, res) => {
        let body = _.pick(req.body, ['site', 'stats', 'imgUrl', 'ranking']);
        let newDoc = Ranking(body);
        try {
            let newRanking = await newDoc.save();
            res.send(newRanking);
        } catch (e) {
            res.status(400).send();
        }
    });

    adminRouter.post('/update', async (req, res) => {
        var {site, stats, imgUrl, ranking} = req.body;

        if (!site) return res.status(400).send();

        try {
            let doc = await Ranking.findOne({site});
            if (!doc) {
                let newDoc = await Ranking(_.pick(req.body, ['site', 'stats','imgUrl','ranking'])).save();
                return res.send(newDoc);
            }
            if (stats) {
                stats.forEach((stat) => {
                    let obj = _.find(doc.stats, (curStat) => curStat.name === stat.name);
                    if (obj) {
                        obj.value = stat.value;
                    }
                    else {
                        doc.stats.push(stat);
                    }
                });
            }
            if (imgUrl) doc.imgUrl = imgUrl;
            if (ranking) doc.ranking = ranking;
            let newDoc = await doc.save();
            res.send(newDoc);
        } catch (e) {
            res.sendStatus(400);
        }
    });
    return adminRouter;
};

module.exports = router;