var express = require('express');
var adminRouter = express.Router();
var {Admin} = require('./../models/ranking');
var {Ranking} = require('./../models/ranking');

var router = () => {

    adminRouter.route('/login')
        .get((req, res) => {
            res.render('login');
        })
        .post((req, res) => {
            res.send(req.body);
    });

    adminRouter.post('/update/:ranking', (req, res, next) => {
        var ranking_name = req.params.ranking;
        if (ranking_name != 'college') {
            return next();
        }
        var {site, stats} = req.body;
    });

    return adminRouter;
};

module.exports = router;