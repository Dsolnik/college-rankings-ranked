const mongoose = require('mongoose');

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
        _id: user._id.toHexString(), 
        access
    },process.env.JWT_SECRET).toString();

    user.tokens.push({
        access,
        token
    });

    return user.save().then(() => {
        return token;
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

AdminSchema.statics.findByUserAndPass = function (username, password) {
    var User = this;

    return User.findOne({
        username, 
        password
        }).then((user) => {
            if (!user) return Promise.reject();
            return user;
    }).catch((e) => Promise.reject());

};


var Admin = mongoose.model('Administrator', AdminSchema);

module.exports = {Admin};