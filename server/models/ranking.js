const mongoose = require('mongoose');

var RankingSchema = new mongoose.Schema( {
    site: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true
    },
    ranking: {
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
        value: {
            type: Number,
            required: true
        }
    }]
},
{ usePushEach: true }
);

RankingSchema.statics.getRank = function (ranking) {
    var Ranking = this;
    return Ranking.find({ranking});
}

RankingSchema.statics.getSite = function (site) {
    var Ranking = this;
    return Ranking.findOne({site});
}


var Ranking = mongoose.model('Ranking', RankingSchema);

module.exports = {Ranking};