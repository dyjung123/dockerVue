const models = require('../models/emotionData')
const seque = require('sequelize')

const addData = async (req, res, next) => {
    // console.log(req.body)
    const {imageName,userId,uploadDate,downloadURL,Confidence,HAPPY,CALM,SAD,
        DISGUSTED,CONFUSED,ANGRY,SURPRISED,FEAR,emoType} = req.body
    // await -> 동기
    // table이 없으면 table 생성
    await models.EmotionData.sync() // singleton pattern

    // build & save = create
    const emoData = models.EmotionData.build({UID:userId, imageId:imageName, createDate:uploadDate, 
        happy:HAPPY, sad:SAD, angry:ANGRY, calm:CALM, disgusted:DISGUSTED, surprised:SURPRISED, 
        confused:CONFUSED, fear:FEAR, confi:Confidence, downlink: downloadURL, emotype: emoType})
    await emoData.save().then(e => {
        // console.log('then',e)
    }).catch(e => { // save commit
        console.log('error', e)
    })
    res.status(201).json({ item: emoData })
}

const findAll = async (req,res,next)=>{ // select * from emotionData
    models.EmotionData.findAll().then((data)=>{
        res.send(data)
    }).catch((err)=>{
        console.log(err)
        res.status(500) // status 설정해서 보여줌, router로 상태에 따라서 redirect가능
    })
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

const findRecord = async (req,res,next) => {
    console.log('req', req.body)
    const {term, uid} = req.body
    models.EmotionData.findAll({
        attributes: ['createDate',[seque.fn('ROUND', seque.fn('AVG', seque.col('happy')), 1), 'happyavg'],
        [seque.fn('ROUND', seque.fn('AVG', seque.col('sad')), 1), 'sadavg'],[seque.fn('ROUND', seque.fn('AVG', seque.col('angry')), 1), 'angryavg'],
        [seque.fn('ROUND', seque.fn('AVG', seque.col('calm')), 1), 'calmavg'],[seque.fn('ROUND', seque.fn('AVG', seque.col('disgusted')), 1), 'disgustedavg'],
        [seque.fn('ROUND', seque.fn('AVG', seque.col('surprised')), 1), 'surprisedavg'],[seque.fn('ROUND', seque.fn('AVG', seque.col('confused')), 1), 'confusedavg'],
        [seque.fn('ROUND', seque.fn('AVG', seque.col('fear')), 1), 'fearavg'],[seque.fn('ROUND', seque.fn('AVG', seque.col('confi')), 1), 'confidenceavg']],
        where: {uid,createdAt:{between: [(new Date()).addDays(-term),new Date()]}},
        group: ['createDate']
    }).then(data=>{
        res.send(data)
    })
    
}

const getImage = async (req,res,next) => {
    const {uid, category, limit, offset} = req.body
    var condition
    if (category == 'all') {
        condition = {uid}
    } else {
        condition = {uid, emotype: category}
    }

    models.EmotionData.findAll({
        attributes: ['downlink', 'emotype'],
        where: condition,
        limit: limit,
        offset: offset
    }).then(data=>{
        res.send(data)
    }).catch(err => {
        console.log(err)
        res.status(500)
    })
}

// 입력된 이미지 이름을 가진 데이터를 모두 삭제합니다. (단, uid가 입력된 uid와 일치하는 경우에만)
const deleteData = async (req,res,next) => {
    console.log('delete', req.body)
    const {imgId,uid} = req.body
    models.EmotionData.destroy({
        where: {uid, imageId: {like: `%/${imgId}`} }
    }).then(() => {
        res.status(201)
    }).catch(err => {
        console.log(err)
        res.status(500)
    })
}

// 입력된 uid와 일치하고 저장 경로에 상관없이 입력된 imgId의 이름을 가진 img가 있을 경우,
// 해당 imageId들을 모두 찾아 반환한다.
// 여기서 imageId에는 firebase 저장 경로까지 포함하는 file name이다.
const checkDataExist = async (req,res,next) => {
    console.log('check', req.body)
    const {imgId,uid} = req.body

    // table이 없으면 table 생성
    await models.EmotionData.sync()

    models.EmotionData.findAll({
        attributes: [
            'imageId'
        ],
        // PAIRWISE 비교법을 이용
        where: seque.literal(`(imageId) IN (
                                            SELECT imageId
                                            FROM EmotionData
                                            WHERE UID = \'${uid}\'
                                            AND
                                            imageId LIKE \'%/${imgId}\'
                                           )`)
    }).then(data => {
        // console.log('yeah')
        // models.EmotionData.update({imageId: 'img/vdSaqubonfVYZyFVWOuxaHP0W0d2/2019/04/02/트럼프.jpg'},
        // {where: {imageId: '트럼프.jpg'}})
        // console.log('done')
        res.send(data)
    }).catch(err => {
        console.log(err)
        res.status(500)
    })
}

module.exports = {
    addData,
    findAll,
    findRecord,
    getImage,
    deleteData,
    checkDataExist
}