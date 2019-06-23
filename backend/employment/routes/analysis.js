const express = require('express')
const bodyparser = require('body-parser')
const analysisRouter = express.Router()

const analysisApi = require('../api/analysis')

analysisRouter.use(bodyparser.urlencoded({ extended: true }))

analysisRouter.use((req, res, next) => {
    console.log('Time : ',Date.now())
    next()
})

analysisRouter.post('/getimage',analysisApi.getImage) // firebase에 저장된 image download link 가져오기
analysisRouter.post('/addata',analysisApi.addData) // 분석 정보 추가
analysisRouter.post('/findrec',analysisApi.findRecord) // 1일 단위로 분석정보 평균 가져오기
analysisRouter.post('/delete',analysisApi.deleteData) // 임시 : delete record
analysisRouter.post('/check',analysisApi.checkDataExist) // check data exist

analysisRouter.get('/info/',analysisApi.findAll) // 관리용

module.exports = {
    analysisRouter
}