require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');

const {mongoose} = require('./db/mongoose');
var {Admin} = require('./models/admin');
var {Ranking} = require('./models/ranking');

const publicPath = path.join(__dirname, '../public');
const PORT = process.env.PORT || 3000;
var adminRouter = require('./routes/adminRouter')();


var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.static(publicPath));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/rankings', (req, res) => {
    Ranking.find({}).then((docs) => {
        console.log('cool!');
        res.render('rankings', {docs});
    }).catch((e) => {
        res.status(404).render('error', {
            errorTitle: 'Internal Error',
            errorMsg: 'Sorry, we had an error finding those!'
        });
    });
});


app.use('/admin', adminRouter);

app.use((req, res) => {
    res.status(404).render('error', {
        errorTitle: 'Not Found',
        errorMsg: 'Sorry, we couldn\'t find that'});
})

io.on('connect', (socket) => {
    console.log('socket connected!');

    socket.on('loginReq', (params, cb) => {
        var {username, password} = params;
        Admin.findByUserAndPass(username, password).then((user) => {
            var auth = user.generateAuthToken();
            cb(auth);
        }).catch((e) => cb('invalid credentials'));
    });

    socket.on('createSiteReq', (params, cb) => {
        var newRanking = new Ranking(params);
        newRanking.save().then((doc) => {
            cb({
                completed: true,
                conent: doc
            });
        }).catch((e) => cb({
            completed: false,
            content: e
        }));
    });

})

server.listen(PORT, () => {
    console.log(`server is up on port ${PORT}`)
});

