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

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.static(publicPath));
app.use(helmet());
app.use(cookieSession({
    name: 'session',
    secret: process.env.COOKIE_SECRET,
    maxAge: 2 * 60 * 60 * 1000 // 2 hours
}));

app.use('/admin', adminRouter);

app.get('/', async (req, res) => {
    const docs = await Ranking.getAll();
    res.render('index', {docs});
});

// default error page
app.use((req, res) => {
    res.status(404).render('error', {
        errorTitle: 'Not Found',
        errorMsg: 'Sorry, we couldn\'t find that'});
})

server.listen(PORT, () => {
    console.log(`server is up on port ${PORT}`)
});

module.exports = {app};
