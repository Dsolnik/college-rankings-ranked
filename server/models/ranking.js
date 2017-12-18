const mongoose = require('mongoose');

var RankingSchema = new mongoose.Schema( {
    site: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true
    },
    rank: {
        type: Number,
        required: true
    },
    imgUrl: {
        type: String
    },
    stats: [{
        name: {
            type: String,
            required: true
        },
        value : {
            type: String,
            required: true
        }
    }]
},
{ usePushEach: true }
);

RankingSchema.statics.getRank = function (rank) {
    var Ranking = this;
    Ranking.find({rank});
}

RankingSchema.statics.getSite = function (site) {
    var Ranking = this;
    return Ranking.findOne({site});
}

var Ranking = mongoose.model('Ranking', RankingSchema);

module.exports = {Ranking};