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

AdminSchema.methods.generateAuthToken = function () {

    var user = this;
    var access = 'auth';
    var token = jwt.sign({
        data: {
            _id: user._id.toHexString(),
            access
            }
    },process.env.JWT_SECRET,  { expiresIn: '1h' }).toString();

    user.tokens.push({
        access,
        token
    });

    return user.save().then(() => {
        return token;
    });

};

AdminSchema.statics.findByToken = async function(token) {
    var User = this;
    var decoded;

    try{
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        throw new Error();
    }

    return User.findOne({'_id': decoded._id,
        'tokens.token' : token,
        'tokens.access' : 'auth'
    });
};

AdminSchema.methods.removeToken = function (token) {
    var user = this;

    return user.update({
        $pull: {
            tokens : {token}
        }
    });
};

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