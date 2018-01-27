require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');
const helmet = require('helmet');
const cookieSession = require('cookie-session');

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
app.use(helmet());
app.use(cookieSession({
    name: 'session',
    secret: process.env.COOKIE_SECRET,
    maxAge: 2 * 60 * 60 * 1000 // 2 hours
}));

app.get('/', (req, res) => {
    // res.redirect('/rankings');
    res.render('index');
});

app.get('/rankings', async (req, res) => {
    try {
        const docs = await Ranking.getAll();
        res.render('rankings', {docs});
    } catch (e) {
        res.status(404).render('error', {
            errorTitle: 'Internal Error',
            errorMsg: 'Sorry, we had an error finding those!'
        });
    }
});


app.use('/admin', adminRouter);

app.use((req, res) => {
    res.status(404).render('error', {
        errorTitle: 'Not Found',
        errorMsg: 'Sorry, we couldn\'t find that'});
})

// io.on('connect', (socket) => {
//     console.log('socket connected!');

//     socket.on('loginReq', async (params, cb) => {
//         var {username, password} = params;
//         try {
//             const user = await Admin.findByUserAndPass(username, password);
//             // const auth = await user.generateAuthToken();
//             cb('cool');
//         } catch (e) {
//             cb('invalid credentials');
//         }
//     });

//     socket.on('createSiteReq', (params, cb) => {
//         var newRanking = new Ranking(params);
//         newRanking.save().then((doc) => {
//             cb({
//                 completed: true,
//                 conent: doc
//             });
//         }).catch((e) => cb({
//             completed: false,
//             content: e
//         }));
//     });

// })

server.listen(PORT, () => {
    console.log(`server is up on port ${PORT}`)
});

module.exports = {app};