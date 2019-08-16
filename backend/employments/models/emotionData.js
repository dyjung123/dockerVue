const {Sequelize, skima} = require('./sequelize')

const EmotionData = skima.define('emotionData', {
    UID: {
        type: Sequelize.STRING,
        notNull : true
    },
    imageId: {
        type: Sequelize.STRING, // if Id length is too long, you must use TEXT type
        notNull : true,
        primaryKey : true,
    },
    createDate: {
        type: Sequelize.STRING,
        notNull : true
    },
    happy: {
        type: Sequelize.FLOAT,
        notNull : true
    },
    sad: {
        type: Sequelize.FLOAT,
        notNull : true
    },
    angry: {
        type: Sequelize.FLOAT,
        notNull : true
    },
    calm: {
        type: Sequelize.FLOAT,
        notNull : true
    },
    disgusted: {
        type: Sequelize.FLOAT,
        notNull : true
    },
    surprised: {
        type: Sequelize.FLOAT,
        notNull : true
    },
    confused: {
        type: Sequelize.FLOAT,
        notNull : true
    },
    fear: {
        type: Sequelize.FLOAT,
        notNull : false
    },
    confi: {
        type: Sequelize.FLOAT,
        notNull : true
    },
    downlink: {
        type: Sequelize.STRING,
        notNull : true
    },
    emotype: {
        type: Sequelize.STRING,
        notNull : true
    }},
    {tableName: 'emotionData'
})

module.exports = {EmotionData}