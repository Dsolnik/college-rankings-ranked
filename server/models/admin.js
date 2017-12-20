const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var AdminSchema = new mongoose.Schema( {
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    tokens: [{
        access:  {
            type: String,
            required: true
        }, token: {
            type: String,
            required: true
        }
    }]
},
{ usePushEach: true }
);

AdminSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'username']);
};

// admin.generateAuthToken
// generates auth token for the admin, adding it to the users' tokens array and returning the token
AdminSchema.methods.generateAuthToken = async function () {

    var user = this;
    var access = 'auth';
    var token = await jwt.sign({
        data: {
            _id: user._id.toHexString(),
            access
            }
    },process.env.JWT_SECRET,  { expiresIn: '1h' }).toString();

    user.tokens.push({
        access,
        token
    });

    await user.save();

    return token;
};

// admin.removeToken
// removes token from the tokens array
AdminSchema.methods.removeToken = function (token) {
    var user = this;

    return user.update({
        $pull: {
            tokens : {token}
        }
    });
};

// Admin.findByToken
// verifies the token and finds user with that token
AdminSchema.statics.findByToken = async function(token) {
    const User = this;
    let decoded = await jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findOne({'_id': decoded._id,
        'tokens.token' : token,
        'tokens.access' : 'auth'
    });
    return user;
};

// Admin.login
// logs in a user, returning an auth token for the session
AdminSchema.statics.login = async function (username, password) {
    const Admin = this;
    const user = await Admin.findByUserAndPass(username, password);
    const token = await user.generateAuthToken();
    return token;
}

AdminSchema.statics.findByUserAndPass = async function (username, password) {

    const Admin = this;
    const user = await Admin.findOne({username, password});
    if (!user) throw new Error();
    return user;
};


var Admin = mongoose.model('Administrator', AdminSchema);

module.exports = {Admin};